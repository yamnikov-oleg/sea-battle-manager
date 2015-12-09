$(function(){

  // SHIPS PLACEMENT RENDERER

  var AllPointsInRect = function(bnd) {
    var points = [];
    for (var i = bnd[0].i; i < bnd[1].i; i++) {
      for (var j = bnd[0].j; j < bnd[1].j; j++) {
        if (i < 0 || j < 0 || i >= FIELD_HEIGHT || j >= FIELD_WIDTH) continue;
        points.push({ i: i, j: j });
      }
    }
    return points;
  }

  var ShipObject = function(segCount, renderer) {
    if (this === window) return;
    this.segCount = segCount;
    this.renderer = renderer;
    this.position = null;

    this.orientation = ShipOrientation.Horizontal;

    this.hoverPos = null;
  }

  ShipObject.prototype.Boundaries = function(pos_i, pos_j) {
    var halfShip = Math.floor((this.segCount-1)/2);

    if (this.orientation == ShipOrientation.Vertical) {
      var point_a = {
        i: pos_i - halfShip,
        j: pos_j,
      };
      var point_b = {
        i: point_a.i + this.segCount,
        j: point_a.j + 1,
      };
    } else {
      var point_a = {
        i: pos_i,
        j: pos_j - halfShip,
      };
      var point_b = {
        i: point_a.i + 1,
        j: point_a.j + this.segCount,
      };
    }

    return [point_a, point_b];
  }

  ShipObject.prototype.AllPoints = function(pos_i, pos_j) {
    var bnd = this.Boundaries(pos_i, pos_j);
    return AllPointsInRect(bnd);
  }

  ShipObject.prototype.AllNeighbors = function(pos_i, pos_j) {
    var bnd = this.Boundaries(pos_i, pos_j);
    bnd[0].i--;
    bnd[0].j--;
    bnd[1].i++;
    bnd[1].j++;
    return AllPointsInRect(bnd);
  }

  ShipObject.prototype.CanBePlaced = function(pos_i, pos_j) {
    var boundaries = this.Boundaries(pos_i, pos_j);
    for (var i = 0; i < boundaries.length; i++) {
      if (boundaries[i].i < 0 || boundaries[i].i > FIELD_HEIGHT) return false;
      if (boundaries[i].j < 0 || boundaries[i].j > FIELD_WIDTH) return false;
    }

    var neighbors = this.AllNeighbors(pos_i, pos_j);
    for (var n = 0; n < neighbors.length; n++) {
      for (var s = 0; s < this.renderer.ships.length; s++) {
        if (this.renderer.ships[s].Contains(neighbors[n].i, neighbors[n].j)) return false;
      }
    }

    return true;
  }

  ShipObject.prototype.Contains = function(pos_i, pos_j) {
    if (!this.IsPlaced()) return false;
    var points = this.AllPoints(this.position.i, this.position.j);
    for (var i = 0; i < points.length; i++) {
      if (points[i].i == pos_i && points[i].j == pos_j) {
        return true;
      }
    }
    return false;
  }

  ShipObject.prototype.IsPlaced = function() {
    return !!this.position;
  }

  ShipObject.prototype.SwitchOrientation = function() {
    this.orientation = (
      this.orientation == ShipOrientation.Vertical ?
      ShipOrientation.Horizontal :
      ShipOrientation.Vertical
    );
  }

  ShipObject.prototype.Place = function(pos_i, pos_j) {
    this.position = { i: pos_i, j: pos_j };
  }

  ShipObject.prototype.Unplace = function() {
    this.position = null;
  }

  ShipObject.prototype.RenderShadow = function(field, pos_i, pos_j) {
    if (this.CanBePlaced(pos_i, pos_j)) {
      var neighbors = this.AllNeighbors(pos_i, pos_j);
      neighbors.forEach(function(pnt){
        field.SetColor(pnt.i, pnt.j, CellColor.NeighborShadow);
      });
    }
    var points = this.AllPoints(pos_i, pos_j);
    var color = ( this.CanBePlaced(pos_i, pos_j) ? CellColor.ShipShadow : CellColor.ShipShadowFail );
    points.forEach(function(pnt){
      field.SetColor(pnt.i, pnt.j, color);
    });
  }

  ShipObject.prototype.Render = function(field, rr_active) {
    if (rr_active) {
      var neighbors = this.AllNeighbors(this.position.i, this.position.j);
      neighbors.forEach(function(pnt){
        field.SetColor(pnt.i, pnt.j, CellColor.Neighbor);
      });
    }

    var points = this.AllPoints(this.position.i, this.position.j);
    points.forEach(function(pnt){
      field.SetColor(pnt.i, pnt.j, CellColor.Ship);
    });
  }

  var ShipsPlacementRenderer = function() {
    if (this === window) return;
    this.priority = 50;
    this.active = true;

    this.ships = [];
    for (var segCount = 4; segCount > 0; segCount--) {
      for (var i = 0; i < (5-segCount); i++) {
        this.ships.push(new ShipObject(segCount, this));
      }
    }
    this.placedShip = this.ships[0];
  }

  ShipsPlacementRenderer.prototype.PlaceNewShip = function() {
    for (var i = 0; i < this.ships.length; i++) {
      if (!this.ships[i].IsPlaced()) {
        this.placedShip = this.ships[i];
        return;
      }
    }
    this.placedShip = null;
  }

  ShipsPlacementRenderer.prototype.TakenByShip = function(cell_i, cell_j) {
    for (var i = 0; i < this.ships.length; i++) {
      if (this.ships[i].Contains(cell_i, cell_j)) {
        return this.ships[i];
      }
    }
    return null;
  }

  ShipsPlacementRenderer.prototype.Render = function(field) {
    if (this.active && this.hoverPos && this.placedShip) {
      this.placedShip.RenderShadow(field, this.hoverPos.i, this.hoverPos.j);
    }
    for (var i = 0; i < this.ships.length; i++) {
      if (this.ships[i].IsPlaced()) this.ships[i].Render(field, this.active);
    }
  }

  ShipsPlacementRenderer.prototype.OnHover = function(field, i, j) {
    if (!this.active) return;

    this.hoverPos = { i: i, j: j };
  }

  ShipsPlacementRenderer.prototype.OnClick = function(field, click_i, click_j) {
    if (!this.active) return;

    if (this.placedShip && this.placedShip.CanBePlaced(click_i, click_j)) {
      this.placedShip.Place(click_i, click_j);
      this.PlaceNewShip();
    } else {
      var ship = this.TakenByShip(click_i, click_j);
      if (ship) {
        ship.Unplace();
        this.placedShip = ship;
      }
    }
  }

  ShipsPlacementRenderer.prototype.OnContext = function(field, i, j) {
    if (!this.active) return;

    this.placedShip.SwitchOrientation();
  }

  // EXPORTED CODE

  window.ShipOrientation = {
    Vertical: 'V',
    Horizontal: 'H',
  };

  // INIT CODE
  window.ShipsPlacementRr = new ShipsPlacementRenderer();
  OwnFrm.AddRenderer(window.ShipsPlacementRr);

});
