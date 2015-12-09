$(function(){

  // OPP SHOTS RENDERER

  var OppShotsRenderer = function(ships_renderer) {
    if (this === window) return;
    this.priority = 10;
    this.active = false;
    this.ships_renderer = ships_renderer;
    this.selectedCell = null;

    this.cellStates = new Array(FIELD_HEIGHT);
    for (var i = 0; i < FIELD_HEIGHT; i++) {
      this.cellStates[i] = new Array(FIELD_WIDTH);
      for (var j = 0; j < FIELD_WIDTH; j++) {
        this.cellStates[i][j] = false;
      }
    }
  }

  OppShotsRenderer.prototype.IsSelected = function(i, j) {
    return this.selectedCell && this.selectedCell.i == i && this.selectedCell.j == j;
  }

  OppShotsRenderer.prototype.Render = function(field) {
    for (var i = 0; i < FIELD_HEIGHT; i++) {
      for (var j = 0; j < FIELD_WIDTH; j++) {

        if (this.active) field.SetSelected(i, j, this.IsSelected(i,j));

        if (this.cellStates[i][j]) {
          if (this.ships_renderer.TakenByShip(i,j)) {
            field.SetColor(i,j, CellColor.Hit);
          } else {
            field.SetColor(i,j, CellColor.Miss);
          }
        }

      }
    }
  }

  OppShotsRenderer.prototype.OnClick = function(field, i, j) {
    if (!this.active) return;

    if (!this.IsSelected(i,j)) {
      this.selectedCell = { i: i , j: j };
      return;
    }

    this.cellStates[i][j] = !this.cellStates[i][j];
  }

  // INIT CODE

  window.OppShotsRr = new OppShotsRenderer(ShipsPlacementRr);
  OwnFrm.AddRenderer(OppShotsRr);

});
