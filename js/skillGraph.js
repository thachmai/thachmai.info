'use strict';

function skillGraph() {
    function me() {
    }

    var COMPACT_DIVIDER = 0.5;
    var COMPACT_HEIGHT = 20;
    var GOLDEN = 1.61812;
    var skills = [];
    var width = 0;
    var lastMode;
    var barPadding;

    function renderCompact() {
        function circlesEnter(d, i) {
            var r = 7;

            function circle(d, j) {
                var x = width * COMPACT_DIVIDER + (j + 1) * ( r * 2 + r / GOLDEN );
                var y = (i + 1) * COMPACT_HEIGHT - r + 2;

                if (d !== 0.5) {
                    d3.select(this).append('path').attr('d', function () {
                        return ['M', x, y - r, 'a', r, r, '0 0 0 0 ', 2 * r,
                        'h 0',
                        'a', r, r, '0 0 0 0', -2 * r, 
                        'h 0 Z'].join(' ');
                    }).attr('class', function () { return d ? 'skill-fill' : 'skill-empty'; });
                } else {
                    d3.select(this).append('path').attr('d', function () {
                        return ['M', x, y - r, 'a', r, r, '0 0 0 0', 2 * r, 'h 0 v', -2 * r, 'Z'].join(' ');
                    }).attr('class', 'skill-fill');
                    d3.select(this).append('path').attr('d', function () {
                        return ['M', x, y - r, 'h 0 a', r, r, '0 0 1 0', 2 * r, 'h 0 Z',].join(' ');
                    }).attr('class', 'skill-empty');
                }
            }

            var bars = d3.range(1, 5).map(function (n) {
                return (d.level >= n) ? 1 :
                    ((d.level === n - 0.5) ? 0.5 : 0);
            });

            d3.select(this).selectAll('.bar').data(bars)
                .enter()
                .append('g').attr('class', 'bar').each(circle);
        }

        var binding = d3.select(this).selectAll('.skill').data(skills, function (d) { return d.id; });
        var enter = binding.enter().append('g').attr('class', 'skill');

        lastMode = 'compact';

        // labels
        enter.append('text').text(function (d) { return d.name; })
            .attr('text-anchor', 'end')
            .attr('x', width * COMPACT_DIVIDER).attr('y', function (d, i) { return (i + 1) * COMPACT_HEIGHT; });

        // circles
        enter.each(circlesEnter);
    }

    function transitionToBar(padding, duration) {
    }

    // "this" must refer to the node to render into
    // returns the size of the graph in pixels
    me.renderCompact = function (selection) {
        selection.each(renderCompact);
    };

    me.transitionToBar = function (selection, padding, duration) {
        selection.each(function (d, i) {
            var binding = d3.select(this).selectAll('.skill');

            binding.attr('transform', 'translate(' + padding + ' 0)').transition().duration(duration)
                .attr('transform', 'translate(' + width * COMPACT_DIVIDER + ' 0)');
        });
    };

    // skill format: { id, name, level (0 to 4), description }
    me.skills = function (value) {
        if (!value) return skills;

        skills = value;
        return me;
    };

    me.width = function (value) {
        if (!value) return width;

        width = value;
        return me;
    };

    me.barPadding = function (value) {
        if (!value) return barPadding;

        barPadding = value;
        return me;
    };

    me.mode = function (value) {
        if (!value) return mode;

        lastMode = mode;
        mode = value;
        return me;
    }

    // this should be called after .skills and width to get the height for the graph
    me.estHeight = function () {
        return (skills.length + 1) * COMPACT_HEIGHT;
    };

    return me;
}

window.skillGraph = skillGraph;
