$(function(){

  // Togglers for recommendations renderer
  $('.rec-toggler').click(function(e){
    var value = $(this).val();
    RecRenderer.setting = eval(value);
    OpponentFrm.RequestRedraw();
  });

  // Togglers for own field mode
  $('.own-mode').click(function(e){
    var value = $(this).val();
    if (value == 'Placing') {
      ShipsPlacementRr.active = true;
      OppShotsRr.active = false;
    } else {
      ShipsPlacementRr.active = false;
      OppShotsRr.active = true;
    }
    OwnFrm.RequestRedraw();
  });

});
