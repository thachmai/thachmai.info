// a d3 extension that renders a radar chart (or spider chart)
// requires the data to be in the following form: d.value, d.maxValue, d.serieName
function radarChart() {
	var radarClass = 'radar-data',
		axisClass = 'radar-axis',
		tickCount = 3,
		tickSize = 2,
		radius = 200,
        click = null,
		maxValue = 3;

	function chart(selector) {

		selector.each(function (d, i) {
		    var globalG = selector.append('g').attr('class', 'radar-container'),
                axisG = globalG.append('g').attr('class', axisClass),
				radarG = globalG.append('g').attr('class', radarClass),
				scale = d3.scale.linear().domain([0, maxValue]).range([0, radius]),
				axisTicks = scale.ticks(tickCount),
				radarPoints = [],
				axisPoints = new Array(maxValue);

			d.forEach(function (serie, index) {
				var angle = Math.PI * 2 * index / d.length;
					xRatio = Math.cos(angle),
					yRatio = Math.sin(angle),
					x = xRatio  * radius,
					y = yRatio * radius,
					labelX = xRatio * (radius + 20),
					labelY = yRatio * (radius + 20),
					labelRotation = index / d.length * 360;

				axisG.append('line')
					.attr('x1', 0)
					.attr('y1', 0)
					.attr('x2', x)
					.attr('y2', y);

				axisTicks.forEach(function (t) {
					var tRadius = scale(t), x = tRadius * xRatio, y = tRadius * yRatio;

					axisG.append('circle')
						.attr('cx', x)
						.attr('cy', y)
						.attr('r', tickSize);

					if (typeof axisPoints[t] === 'undefined') axisPoints[t] = [];

					axisPoints[t].push( x + ',' + y);
				});

				// serieName
				radarG.append('text')
					.text(serie.serieName)
					.attr('x', labelX)
					.attr('y', labelY)
					.attr('text-anchor', 'end')
					//.attr('baseline-shift', '30%')
					.attr('transform', 'rotate(' + labelRotation + ' ' + labelX + ' ' + labelY + ')')
                    .attr('data-rotate', labelRotation)
                    .on('click', function (d) {
                        var that = d3.select(this),
                            r = that.attr('data-rotate');

                        globalG.transition().duration(1000)
                            .attr('transform', 'rotate(' + (360 - r) + ')');

                        if (typeof click === 'function') {
                            click(d.filter(function (e) {
                                return e.serieName === that.text();
                            })[0]);
                        }
                    });
				
				radarPoints.push(scale(serie.value) * xRatio + ',' + scale(serie.value) * yRatio);
			});

			axisPoints.forEach(function (p) {
				axisG.append('polygon')
					.attr('points', p.join(' '));
			});

		    radarG.append('polygon')
                .attr('style', 'pointer-events: none;')
                .attr('points', radarPoints.map(function () { return '0,0'; }).join(' '))
                .transition().duration(1000).attr('points', radarPoints.join(' '));

		    if (typeof click === 'function') {
		        click(d[0]);
		    }
		});
	}

	chart.radarClass = function (c) {
		if (arguments.length === 0) {
			return radarClass;
		} else {
			radarClass = c;
			return chart;
		}
	};

	chart.axisClass = function (c) {
		if (arguments.lngth === 0) {
			return axisClass;
		} else {
			axisClass = c;
			return chart;
		}
	}

	chart.radius = function (r) {
		if (arguments.length === 0) {
			return radius;
		} else {
			radius = r;
			return chart;
		}
	};

	chart.click = function (c) {
	    if (arguments.length === 0) {
	        return click;
	    } else {
	        click = c;
	        return chart;
	    }
	};

	return chart;
}