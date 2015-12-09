$(function(){

  // RENDER MANAGER CLASS

  var FieldRenderManager = function(field) {
    if (this === window) return;
    this.field = field;
    this.renderers = [];

    var frm = this;
    this.field.onclick = function(field, i, j) {
      frm.OnClick(i, j);
    };
    this.field.onhover = function(field, i, j) {
      frm.OnHover(i, j);
    };
    this.field.oncontext = function(field, i, j) {
      frm.OnContext(i, j);
    };
  }

  FieldRenderManager.prototype.AddRenderer = function(r) {
    this.renderers.push(r);
    this.renderers.sort(function(a,b){
      return -(a.priority - b.priority);
    });
  }

  FieldRenderManager.prototype.RemoveRenderer = function(r) {
    for (var i = 0; i < this.renderers.length; i++) {
      if (this.renderers[i] == r) {
        this.renderers.splice(i,1);
        break;
      }
    }
  }

  FieldRenderManager.prototype.ClearField = function() {
    for (var i = 0; i < FIELD_HEIGHT; i++) {
      for (var j = 0; j < FIELD_WIDTH; j++) {
        this.field.SetColor(i, j, CellColor.Empty);
        this.field.SetSelected(i, j, false);
      }
    }
  }

  FieldRenderManager.prototype.ApplyRenderers = function() {
    this.ClearField();
    for (var i = 0; i < this.renderers.length; i++) {
      this.renderers[i].Render(this.field);
    }
  }

  FieldRenderManager.prototype.RequestRedraw = function() {
    this.ApplyRenderers();
  }

  FieldRenderManager.prototype.OnClick = function(cell_i,cell_j) {
    for (var i = 0; i < this.renderers.length; i++) {
      if (this.renderers[i].OnClick != undefined) {
        this.renderers[i].OnClick(this.field, cell_i, cell_j);
      }
    }
    this.RequestRedraw();
  }

  FieldRenderManager.prototype.OnHover = function(cell_i,cell_j) {
    for (var i = 0; i < this.renderers.length; i++) {
      if (this.renderers[i].OnHover != undefined) {
        this.renderers[i].OnHover(this.field, cell_i, cell_j);
      }
    }
    this.RequestRedraw();
  }

  FieldRenderManager.prototype.OnContext = function(cell_i,cell_j) {
    for (var i = 0; i < this.renderers.length; i++) {
      if (this.renderers[i].OnContext != undefined) {
        this.renderers[i].OnContext(this.field, cell_i, cell_j);
      }
    }
    this.RequestRedraw();
  }

  // EXPORTED CODE

  window.CellColor = {
    Empty: 'white',
    Miss: 'rgb(8, 129, 255)',
    Ship: 'rgb(42, 185, 24)',
    Hit: 'rgb(203, 56, 10)',
    Neighbor: 'rgb(176, 229, 255)',
    ShipShadow: 'rgb(93, 254, 60)',
    NeighborShadow: 'rgb(199, 237, 255)',
    ShipShadowFail: 'rgb(194, 237, 71)',

    Rec4Seg: 'rgb(196, 255, 219)',
    Rec2Seg: 'rgb(252, 255, 191)',
  };

  // INIT CODE

  window.OpponentFrm = new FieldRenderManager(OpponentField);
  window.OwnFrm = new FieldRenderManager(OwnField);

});
