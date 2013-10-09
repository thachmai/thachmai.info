(function (globeController) {
	var radius = 100;
	var globeContainer = d3.select('#GlobeContainer').node();
	var globeCanvas = d3.select('#GlobeCanvas').attr('width', radius * 2).attr('height', radius * 2);
	var globeContext = globeCanvas.node().getContext('2d');
	var globeProjection = d3.geo.orthographic().scale(radius - 2).translate([radius, radius]).clipAngle(90);
	var globePath = d3.geo.path().projection(globeProjection).context(globeContext);
	var worldGeojson = null;
	var highlightGeojson = null;
	var highlights = null;
	var globeStop = false;
	var lastMouseCheck = Date.now();
	var style = { highlightColor: 'rgba(255, 0, 0, 0.6)' };
	var spinState = {};

	globeController.projection = globeProjection;

	function GeoHighlight(id, lon, lat, onActivate) {
		this.id = id;
		this.lon = lon;
		this.lat = lat;
		this.onActivate = onActivate;

		return this;
	}

	function drawGlobe(rotations) {
		var coords;

		globeProjection.rotate([rotations[0], rotations[1], 0]);

		// code path for canvas rendering
		// much faster but offers no easy way for interaction
		globeContext.clearRect(0 ,0, radius * 2, radius * 2);

		globeContext.beginPath();
		globePath(worldGeojson);
		globeContext.fillStyle = 'gray';
		globeContext.fill();

		var coords = globeProjection([0, 0]);
		globeContext.fillStyle = style.highlightColor;
		globeContext.beginPath();
		globePath(highlightGeojson);
		globeContext.fill();
	}

	function dragGlobe(dx, dy) {
		var rotates = globeProjection.rotate(),
			rawY = globeProjection.rotate()[1] - dy,
			yRotation =  rawY > 50 ? 50 : rawY;

		if (yRotation < -50) {
			yRotation = -50;
		} 

		drawGlobe([globeProjection.rotate()[0] + dx, yRotation]);
	}

	// returns the highlight for the (approx) position
	// returns null if there is no match
	function findHighlight(position) {
		var result = null;

		if (Array.isArray(highlights)) {
			highlights.forEach(function (h) {
				if (Math.abs(h.lon - position[0]) < 4 && Math.abs(h.lat - position[1]) < 4) {
					result = h;
					return;
				}
			});
		}

		return result;
	}

	function drawHighlightText(highlight) {
		var screenPos;

		globeContext.fillStyle = style.highlightColor;
		globeContext.font = "bold 15px Arial";
		globeContext.textAlign = "center";
		globeContext.textBaseline = "bottom";

		screenPos = globeProjection([highlight.lon, highlight.lat]);
		globeContext.fillText(highlight.id, screenPos[0], screenPos[1] - 5);			
	}

	function handleCanvasMouseover() {
		var now = Date.now(), found = false, match;

		if (now - lastMouseCheck < 200) {
			return;
		}

		lastMouseCheck = now;

		match = findHighlight(globeProjection.invert(d3.mouse(globeContainer)));

		if (match !== null) {
			globeStop = true;
			drawGlobe(globeProjection.rotate());

			drawHighlightText(match);
		}
	}

	// public //
	globeController.centerGlobe = function (center) {
		drawGlobe([-center[0], -center[1]]);
	};

	globeController.glideTo = function (destination) {
		var start = Date.now(),
			rotates = globeProjection.rotate(),
			highlight = null,
			center;

		if (typeof destination === 'string') {
			highlights.forEach(function (h) {
				if (h.id === destination) {
					highlight = h;
					center = [h.lon, h.lat];
				}
			});
		} else {
			center = destination;
		}
		
		globeStop = true;

		spinState.forceStop = true;

		d3.timer.flush();

		spinState.forceStop = false;
		spinState.start = Date.now();
		spinState.lonInt = d3.interpolate(rotates[0], -center[0]);
		spinState.latInt = d3.interpolate(rotates[1], - center[1]);
		spinState.center = center;			

		d3.timer(function () {
			var now = Date.now(),
				duration = 1000;

			drawGlobe([spinState.lonInt((now - start)/duration), spinState.latInt((now - start)/duration)]);
			//console.log(globeProjection.rotate()[0] + center[0], globeProjection.rotate()[1] + center[1]);

			if (spinState.forceStop ||
				(Math.abs(globeProjection.rotate()[0] + spinState.center[0]) < 2 && Math.abs(globeProjection.rotate()[1] + spinState.center[1]) < 2) ||
				now - start > duration) {

				if (highlight !== null) drawHighlightText(highlight);
				return true;
			}
		});
	};

	globeController.setGeoHighlights = function (geoHighlights) {
		highlightGeojson = { type: 'MultiPoint', coordinates: [] };

		geoHighlights.forEach(function (h) {
			highlightGeojson.coordinates.push([h.lon, h.lat]);
		});

		highlights = geoHighlights;
	};

	// init //
	d3.json('world-110m.json', function (error, world) {
		var start = Date.now(), velocity = 0.01,
			drag = d3.behavior.drag();

		worldGeojson = topojson.object(world, world.objects.land);

		d3.timer(function () {
			var angle = (Date.now() - start) * velocity;

			if (!globeStop) {
				drawGlobe([angle, -10]);
			} else {
				return true;
			}
		});

		drag.on('dragstart', function () { globeStop = true; });
		drag.on('drag', function () {
			dragGlobe(d3.event.dx, d3.event.dy);
		});
		globeCanvas.call(drag);

		globeCanvas.on('mouseover', handleCanvasMouseover);
		globeCanvas.on('mousemove', handleCanvasMouseover);
	});

	globeController.setGeoHighlights([new GeoHighlight('Grenoble', 6, 45), new GeoHighlight('Valence', 4.89, 44.9), new GeoHighlight('Hochiminh', 106.66, 10.75), new GeoHighlight('Singapore', 103.75, 1.366),
		new GeoHighlight('Ottawa', -75.6919, 45.4214), new GeoHighlight('Oklahoma', 139.65, 35.5)]);
} (window.globeController = {}));