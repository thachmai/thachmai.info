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
    var dispatch = d3.dispatch('end');
    var lastMode;
    var barPadding;

    function barTextX(padding) { 
        return width * COMPACT_DIVIDER + padding;
    }

    // y coordinate for each skill bar
    function skillBarY(d, i) {
        return (i + 1) * COMPACT_HEIGHT - r + 2;
    }

    function barX(i, length) {
        var x0 = width * COMPACT_DIVIDER + r * 2 + r / GOLDEN;
        return x0 + i * length + i * (r * 2 + r / GOLDEN); 
    }

    function barLength() {
        return Math.min(90, (width - width * COMPACT_DIVIDER - r * 12) / 4);
    } 

    function barFull(x, y, l) {
        if (!l) l = 0;
        return ['M', x, y - r, 'a', r, r, '0 0 0 0 ', 2 * r,
            'h', l,
            'a', r, r, '0 0 0 0', -2 * r, 
            'h', -l , 'Z'].join(' ');
    }

    function barFirst(x, y, l) {
        if (!l) l = 0;
        return ['M', x + l/2, y - r, 'h', -l/2,
            'a', r, r, '0 0 0 0', 2 * r, 'h', l/2 , 'v', -2 * r, 'Z'].join(' ');
    }

    function barSecond(x, y, l) {
        if (!l) l = 0;
        return ['M', x + l/2, y - r, 'h', l/2, 'a', r, r, '0 0 1 0', 2 * r, 'h', -l/2 , 'Z',].join(' ');
    }

    function barData(d) {
        return d3.range(1, 5).map(function (n) {
            return (d.level >= n) ? 1 :
                ((d.level === n - 0.5) ? 0.5 : 0);
        });
    }

    function circle(d, i) {
        var x = barX(i, 0);
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
            var bars = barData(d);

            d3.select(this).selectAll('.bar').data(bars)
                .enter()
                .append('g').attr('class', 'bar').attr('transform', function (d) {
                    // watch out, it's the outter i
                }).each(circle);
        }

        var binding = d3.select(this).selectAll('.skill').data(skills, function (d) { return d.id; });
        var enter = binding.enter().append('g').attr('class', 'skill').attr('transform', function (d, i) {
            return 'translate(0 ' + skillBarY(d, i) + ')';
        });

        lastMode = 'compact';

        // labels
        enter.append('text').text(function (d) { return d.sname; })
            .attr('text-anchor', 'end')
            .attr('x', barTextX(0)).attr('y', 6);

        // circles
        enter.each(circlesEnter);
    }

    function renderBar() {
        var binding = d3.select(this).selectAll('.skill').data(skills, function (d) { return d.id; });
        var enter = binding.enter().append('g').attr('class', 'skill').attr('transform', function (d, i) {
            return 'translate(0 ' + skillBarY(d, i) + ')';
        });

        binding.each(function (d) {
            d3.select(this).selectAll('.bar').data(barData(d));
        });
        lastMode = 'bar';

        binding.transition().attr('transform', function (d, i) {
            return 'translate(0 ' + skillBarY(d, i) + ')';
        });
        binding.select('text').attr('x', barTextX(0)).text(function (d) { return d.lname; });
        binding.selectAll('path').remove();

        enter.style('opacity', 0).transition().delay(function (d, i) { return 400; }).style('opacity', 1);

        enter.append('text').attr('x', barTextX(0))
            .text(function (d) { return d.lname; }).attr('y', 6)
            .attr('text-anchor', 'end');

        enter.each(function (d) {
            d3.select(this).selectAll('.bar').data(barData(d))
                .enter().append('g').attr('class', 'bar');
        });
        
        binding.selectAll('.bar').each(function (d, i) {
            var l = barLength();
            var x = barX(i, l);
            var y = 0;

            if (d === 0.5) {
                d3.select(this).append('path').attr('d', barFirst(x, y, l)).attr('class', 'skill-fill');
                d3.select(this).append('path').attr('d', barSecond(x, y, l)).attr('class', 'skill-empty');
            } else {
                d3.select(this).append('path').attr('d', barFull(x, y, l))
                    .attr('class', d === 0 ? 'skill-empty' : 'skill-fill');
            }
        });

        binding.exit().remove();
    }

    // "this" must refer to the node to render into
    // returns the size of the graph in pixels
    me.renderCompact = function (selection) {
        selection.each(renderCompact);
    };

    me.renderBar = function (selection) {
        selection.each(renderBar);
    };

    me.transitionToBar = function (selection, padding, duration) {
        function transStart() {
            transCount++;
        }
        function transEnd(next) {
            if (--transCount) return;
            next.call(this);
        }

        var transCount = 0;

        selection.each(function (d, i) {
            var binding = d3.select(this).selectAll('.skill');
            var that = this;
            var x;

            binding.select('text').attr('x', function () {
                x = parseFloat(d3.select(this).attr('x')) + padding;
                return x;
            });
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

            // transition to center position
            binding.select('text').transition().duration(duration)
                .attr('x', width * COMPACT_DIVIDER).each(transStart).each('end', transEnd.bind(that, next));

            binding.selectAll('.bar').each(function (d, i) {
                var x = width * COMPACT_DIVIDER + (i + 1) * ( r * 2 + r / GOLDEN );
                var y = 0;

                if (d === 0.5) {
                    d3.select(this).select('path:nth-of-type(1)')
                        .transition().duration(duration).attr('d', barFirst(x, y))
                        .each(transStart).each('end', transEnd.bind(that, next));
                    d3.select(this).select('path:nth-of-type(2)')
                        .transition().duration(duration).attr('d', barSecond(x, y))
                        .each(transStart).each('end', transEnd.bind(that, next));
                } else {
                    d3.select(this).select('path').transition().duration(duration)
                        .attr('d', barFull(x, y))
                        .each(transStart).each('end', transEnd.bind(that, next));
                }
            });

            // place circles to their final bar position
            function next() {
                d3.select(this).selectAll('.skill').each(function (d, line) {
                    d3.selectAll('text').transition().delay(duration).text(function (d) { return d.lname; });

                    d3.select(this).selectAll('.bar').each(function (d, column) {
                        var l = barLength();
                        var x = barX(column, l);
                        var y = 0;
                        if (d === 0.5) {
                            d3.select(this).select('path:nth-of-type(1)')
                                .transition().duration(duration).attr('d', barFirst(x, y, l))
                                .each(transStart).each('end', transEnd.bind(null, end));
                            d3.select(this).select('path:nth-of-type(2)')
                                .transition().duration(duration).attr('d', barSecond(x, y, l))
                                .each(transStart).each('end', transEnd.bind(null, end));
                        } else {
                            d3.select(this).select('path').transition().duration(duration)
                                .attr('d', barFull(x, y, l))
                                .each(transStart).each('end', transEnd.bind(null, end));
                        }
                    });
                });
            }

            function end() {
                dispatch.end();
            }
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
        return Math.max(100, (skills.length + 1) * COMPACT_HEIGHT);
    };

    d3.rebind(me, dispatch, 'on');

    return me;
}

window.skillGraph = skillGraph;
