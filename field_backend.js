$(function(){

  // FIELD CLASS

  var TField = function(side, elem) {
    if (this === window) return;
    this.elem = elem;
    this.side = side;

    this.onhover = function(field, i, j){};
    this.onclick = function(field, i, j){};
    this.oncontext = function(field, i, j){};
  }

  TField.prototype.Populate = function() {
    this.elem.html('');

    var basicCell = $('<div></div>').addClass('cell').addClass('game').css('float', 'left');
    var basicHCell = $('<div></div>').addClass('cell').addClass('header').css('float', 'left');
    var rowSep = $('<div></div>').css('display', 'hidden').css('clear', 'both');

    this.elem.append(basicHCell.clone());
    for (var j = 0; j < FIELD_WIDTH; j++) {
      var hcell = basicHCell.clone().html(ColumnMarkers[j]);
      this.elem.append(hcell);
    }
    this.elem.append(rowSep.clone());

    for (var i = 0; i < FIELD_HEIGHT; i++) {
      var hcell = basicHCell.clone().html(RowMarkers[i]);
      this.elem.append(hcell);

      for (var j = 0; j < FIELD_WIDTH; j++) {
        var cell = basicCell.clone()
          .attr('id', CellId(this.side, i, j))
          .html(RowMarkers[i] + ColumnMarkers[j]);

        var field = this;
        cell.hover(function(e){
          var cell = CellData( $(this).attr('id') );
          field.onhover(field, cell.i, cell.j);
        });
        cell.click(function(e){
          var cell = CellData( $(this).attr('id') );
          field.onclick(field, cell.i, cell.j);
        });
        cell.on('contextmenu', function(e){
          var cell = CellData( $(this).attr('id') );
          field.oncontext(field, cell.i, cell.j);
          return false;
        });

        this.elem.append(cell);
      }

      this.elem.append(rowSep.clone());
    }
  }

  TField.prototype.SetColor = function(i, j, color) {
    var id = CellId(this.side, i, j);
    var elem = $('#'+id);
    elem.css('background-color', color);
  }

  TField.prototype.SetSelected = function(i, j, selected) {
    var id = CellId(this.side, i, j);
    var elem = $('#'+id);
    if (selected) {
      elem.addClass('selected');
    } else {
      elem.removeClass('selected');
    }
  }

  TField.prototype.ForEachCell = function(callback) {
    for (var i = 0; i < FIELD_HEIGHT; i++) {
      for (var j = 0; j < FIELD_WIDTH; j++) {
        callback(i,j);
      }
    }
  }

  // EXPORTED CODE

  window.FIELD_WIDTH = 10;
  window.FIELD_HEIGHT = 10;

  window.OpponentField = new TField('opp', $('#opp-field'));
  window.OwnField = new TField('own', $('#own-field'));

  // INTERNAL CODE

  var LettersWithYo = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и'];
  var LettersNoYo = ['а', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и', 'к'];
  var Numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  var RowMarkers = LettersWithYo;
  var ColumnMarkers = Numbers;

  var CellId = function(side, i, j) {
    return side+'-cell-'+i+'-'+j;
  }

  var CellData = function(id) {
    var cell = {};

    var li = id.lastIndexOf('-');
    var tmp = id.substr(li+1);
    cell.j = Number.parseInt(tmp);

    id = id.substr(0, li);
    li = id.lastIndexOf('-');
    tmp = id.substr(li+1);
    cell.i = Number.parseInt(tmp);

    li = id.indexOf('-');
    cell.side = id.substr(0, li);

    return cell;
  }

  // INIT CODE

  OpponentField.Populate();
  OwnField.Populate();
  window.onbeforeunload = function() {
    return "Игра в процессе";
  }

});
