$(function(){

  // OWN SHOTS RENDERER

  var OwnShotsRenderer = function() {
    if (this === window) return;
    this.priority = 50;
    this.selectedCell = null;

    this.cellStates = new Array(FIELD_HEIGHT);
    for (var i = 0; i < FIELD_HEIGHT; i++) {
      this.cellStates[i] = new Array(FIELD_WIDTH);
      for (var j = 0; j < FIELD_WIDTH; j++) {
        this.cellStates[i][j] = CellState.Unshot;
      }
    }
  }

  OwnShotsRenderer.prototype.IsSelected = function(i, j) {
    return this.selectedCell && this.selectedCell.i == i && this.selectedCell.j == j;
  }

  OwnShotsRenderer.prototype.Render = function(field) {
    for (var i = 0; i < FIELD_HEIGHT; i++) {
      for (var j = 0; j < FIELD_WIDTH; j++) {

        field.SetSelected(i, j, this.IsSelected(i,j));

        if (this.cellStates[i][j] == CellState.Miss) {
          field.SetColor(i,j, CellColor.Miss);
        } else if (this.cellStates[i][j] == CellState.Hit) {
          field.SetColor(i,j, CellColor.Hit);
        }

      }
    }
  }

  OwnShotsRenderer.prototype.OnClick = function(field, i, j) {
    var statesOrder = [CellState.Unshot, CellState.Miss, CellState.Hit];
    var selected = this.IsSelected(i,j);

    if (!selected) {
      this.selectedCell = { i: i , j: j };
      return;
    }

    if (this.cellStates[i][j] == statesOrder[statesOrder.length-1]) {
      this.cellStates[i][j] = statesOrder[0];
      return;
    }
    for (var k = 0; k < statesOrder.length-1; k++) {
      if (this.cellStates[i][j] == statesOrder[k]) {
        this.cellStates[i][j] = statesOrder[k+1];
        return;
      }
    }
  }

  // EXPORTED CODE

  window.CellState = {
    Unshot: 0,
    Miss: 1,
    Hit: 2,
  };

  // INIT CODE

  OpponentFrm.AddRenderer(new OwnShotsRenderer());

});
