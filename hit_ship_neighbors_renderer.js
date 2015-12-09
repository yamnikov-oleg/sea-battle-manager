$(function(){

	// HIT SHIP NEIGHBORS RENDERER CLASS

	var HitShipNeighborsRenderer = function(ships_renderer, hits_renderer) {
		if (this === window) return;
		this.priority = 100;
		this.ships_renderer = ships_renderer;
		this.hits_renderer = hits_renderer;
	}

	HitShipNeighborsRenderer.prototype.Render = function(field) {
		if (!this.hits_renderer.active) return;

		for (var si = 0; si < this.ships_renderer.ships.length; si++) {
			var ship = this.ships_renderer.ships[si];
			if (!ship.IsPlaced()) continue;
			var points = ship.AllPoints(ship.position.i, ship.position.j);
			var hit = true;
			for (var pi = 0; pi < points.length; pi++) {
				var pnt = points[pi];
				if (!this.hits_renderer.cellStates[pnt.i][pnt.j]) {
					hit = false;
					break;
				}
			}
			if (!hit) continue;

			var neighbors = ship.AllNeighbors(ship.position.i, ship.position.j);
			for (var ni = 0; ni < neighbors.length; ni++) {
				var pnt = neighbors[ni];
				if (!this.hits_renderer.cellStates[pnt.i][pnt.j]) {
					field.SetColor(pnt.i, pnt.j, CellColor.Neighbor);
				}
			}
		}
	}

	// INIT CODE

	OwnFrm.AddRenderer(new HitShipNeighborsRenderer(ShipsPlacementRr, OppShotsRr));

});