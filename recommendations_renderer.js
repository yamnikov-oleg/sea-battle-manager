$(function(){

  // RECOMMENDATIONS RENDERER

  var RecommendRenderer = function() {
    if (this === window) return;
    this.priority = 100;
    this.setting = RecSetting.None;
  }

  RecommendRenderer.prototype.Render = function(field) {
    if (this.setting == RecSetting.None) return;

    for (var i = 0; i < FIELD_HEIGHT; i++) {
      for (var j = 0; j < FIELD_WIDTH; j++) {

        if (this.setting == RecSetting.SecDiagonal) {
          var i_ = 9-i;
        } else {
          var i_ = i;
        }

        if (i_-j == 2 || i_-j == -2) field.SetColor(i,j, CellColor.Rec4Seg);
        if (i_-j == 6 || i_-j == -6) field.SetColor(i,j, CellColor.Rec4Seg);

        if (i_ == j) field.SetColor(i,j, CellColor.Rec2Seg);
        if (i_-j == 4 || i_-j == -4) field.SetColor(i,j, CellColor.Rec2Seg);
        if (i_-j == 8 || i_-j == -8) field.SetColor(i,j, CellColor.Rec2Seg);

      }
    }
  }

  // EXPORTED CODE

  window.RecSetting = {
    None: 'none',
    MainDiagonal: 'main',
    SecDiagonal: 'sec',
  };

  // INIT CODE

  window.RecRenderer = new RecommendRenderer();
  OpponentFrm.AddRenderer(RecRenderer);

});
