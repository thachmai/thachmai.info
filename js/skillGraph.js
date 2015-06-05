'use strict';

// this thing is turning into a rather scary piece of fine pasta
// so.... plan the morphism first maybe before jumping into code? :)
// Finish the first version and refactor.

function skillGraph() {
    function me() {
    }

    var COMPACT_DIVIDER = 0.5;
    var COMPACT_HEIGHT = 20;
    var GOLDEN = 1.61812;
    var r = 7;
    var skills = [];
    var width = 0;
    var lastMode;
    var barPadding;

    function barTextX(padding) { 
        return width * COMPACT_DIVIDER + padding;
    }

    // y coordinate for each skill bar
    function skillBarY(d, i) {
        return (i + 1) * COMPACT_HEIGHT - r + 2;
    }

    function barFull(x, y) {
        return ['M', x, y - r, 'a', r, r, '0 0 0 0 ', 2 * r,
        'h 0',
        'a', r, r, '0 0 0 0', -2 * r, 
        'h 0 Z'].join(' ');
    }

    function barFirst(x, y) {
        return ['M', x, y - r, 'a', r, r, '0 0 0 0', 2 * r, 'h 0 v', -2 * r, 'Z'].join(' ');
    }

    function barSecond(x, y) {
        return ['M', x, y - r, 'h 0 a', r, r, '0 0 1 0', 2 * r, 'h 0 Z',].join(' ');
    }

    function circle(d, i) {
        var x = width * COMPACT_DIVIDER + (i + 1) * ( r * 2 + r / GOLDEN );
        var y = 0;

        if (d !== 0.5) {
            d3.select(this).append('path').attr('d', barFull(x, y))
                .attr('class', function () { return d ? 'skill-fill' : 'skill-empty'; });
        } else {
            d3.select(this).append('path').attr('d', barFirst(x, y))
                .attr('class', 'skill-fill');
            d3.select(this).append('path').attr('d', barSecond(x, y))
                .attr('class', 'skill-empty');
        }
    }

    function renderCompact() {
        function circlesEnter(d, i) {
            var bars = d3.range(1, 5).map(function (n) {
                return (d.level >= n) ? 1 :
                    ((d.level === n - 0.5) ? 0.5 : 0);
            });

            d3.select(this).selectAll('.bar').data(bars)
                .enter()
                .append('g').attr('class', 'bar').attr('transform', function (d) {
                    // watch out, it's the outter i
                    return 'translate(0 ' + skillBarY(d, i) + ')';
                }).each(circle);
        }

        var binding = d3.select(this).selectAll('.skill').data(skills, function (d) { return d.id; });
        var enter = binding.enter().append('g').attr('class', 'skill');

        lastMode = 'compact';

        // labels
        enter.append('text').text(function (d) { return d.name; })
            .attr('text-anchor', 'end')
            .attr('x', barTextX(0)).attr('y', function (d, i) { return (i + 1) * COMPACT_HEIGHT; });

        // circles
        enter.each(circlesEnter);
    }

    // "this" must refer to the node to render into
    // returns the size of the graph in pixels
    me.renderCompact = function (selection) {
        selection.each(renderCompact);
    };

    me.transitionToBar = function (selection, padding, duration) {
        var x;

        selection.each(function (d, i) {
            var binding = d3.select(this).selectAll('.skill');

            binding.select('text').attr('x', function () { return x = this.x.baseVal[0].value + padding; });
            binding.selectAll('.bar').each(function (d, i) {
                var x2 = x + (i + 1) * ( r * 2 + r / GOLDEN );
                var y = 0;

                if (d === 0.5) {
                    d3.select(this).select('path:nth-of-type(1)').attr('d', barFirst(x2, y));
                    d3.select(this).select('path:nth-of-type(2)').attr('d', barSecond(x2, y));
                } else {
                    d3.select(this).select('path').attr('d', barFull(x2, y));
                }
            });

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
    
    // this should be called after .skills and width to get the height for the graph
    me.estHeight = function () {
        return (skills.length + 1) * COMPACT_HEIGHT;
    };

    return me;
}

window.skillGraph = skillGraph;
