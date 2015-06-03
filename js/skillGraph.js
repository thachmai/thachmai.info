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

    function renderCompact() {
        function circlesEnter(d, i) {
            var r = 7;
            var that = this;

            // x, y: center, value: 0, 0.5 or 1
            function circle(x, y, value) {
                if (value !== 0.5) {
                    d3.select(that).append('path').attr('d', function () {
                        return ['M', x, y - r, 'a', r, r, '0 0 0 0 ', 2 * r,
                        'h 0',
                        'a', r, r, '0 0 0 0', -2 * r, 
                        'h 0 Z'].join(' ');
                    }).attr('class', function () { return value ? 'skill-fill' : 'skill-empty'; });
                } else {
                    d3.select(that).append('path').attr('d', function () {
                        return ['M', x, y - r, 'a', r, r, '0 0 0 0', 2 * r, 'h 0 v', -2 * r, 'Z'].join(' ');
                    }).attr('class', 'skill-fill');
                    d3.select(that).append('path').attr('d', function () {
                        return ['M', x, y - r, 'h 0 a', r, r, '0 0 1 0', 2 * r, 'h 0 Z',].join(' ');
                    }).attr('class', 'skill-empty');
                }
            }

            d3.range(1, 5).forEach(function (n) {
                var x = width * COMPACT_DIVIDER + n * ( r * 2 + r / GOLDEN );
                var y = (i + 1) * COMPACT_HEIGHT - r + 2;
                var value = (d.level >= n) ? 1 :
                    ((d.level === n - 0.5) ? 0.5 : 0);

                circle(x, y, value);
            });
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

    function renderBar() {
        var binding = d3.select(this).selectAll('.skill').data(skills, function (d) { return d.id; });
        var enter = binding.enter().append('g').attr('class', 'skill');
    }

    // "this" must refer to the node to render into
    // returns the size of the graph in pixels
    me.renderCompact = function (selection) {
        selection.each(renderCompact);
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
