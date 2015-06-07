function skillSet() {
    'use strict';

    var name = { 'front': 'Frontend', 'back': 'Backend', 'ops': 'DevOps', 'bus': 'Domain' };
    var skills = [];
    var selection = [];
    var width = 0;
    var dispatch = d3.dispatch('change');

    var groups;

    function me() {
    }

    function groupW() {
        return width / groups.length;
    }

    function groupX(d, i) {
        return i * groupW();
    }

    function click(d) {
        var i = selection.indexOf(d.id);
        var dThis = d3.select(this);
        if (i === -1) {
            selection.push(d.id);
            dThis.classed('selected', true);
        } else {
            selection.splice(i, 1);
            dThis.classed('selected', false);
        }

        dispatch.change(selection);
    }

    function render() {
        var dThis = d3.select(this);

        var binding = dThis.selectAll('.group').data(groups);
        var gEnter = binding.enter().append('g').attr('class', 'group');

        gEnter.append('text').attr('x', groupX).attr('class', 'skill-group')
            .attr('style', 'font-variant: small-caps;')
            .attr('y', 20).text(function (d) { return name[d]; });

        gEnter.each(function (group, column) {
                var gSkills = skills.filter(function (s) { return s.group === group; });
            d3.select(this).selectAll('.skill-selection').data(gSkills)
                .enter()
                .append('text').attr('class', 'skill-selection')
                .classed('selected', function (d) {
                    return selection.indexOf(d.id) > -1;
                })
                .attr('style', 'font-size: 12px; opacity: 0;')
                .text(function (d) { return d.sname; })
                .attr('x', function (d, row) { return groupX(d, column); })
                .attr('y', function (d, row) { return 20 + (row + 1) * 15; })
                .on('click', click)
                .transition().delay(function (d, i) { return 100 + 100 * i + column * 500; })
                .style('opacity', 1);
        });

        // scan through the text to make sure nothing is larger than the width limit
        binding.selectAll('text').each(function () {
            var limit = groupW() - 5;
            var rect = this.getBoundingClientRect(); 
            var w = rect.right - rect.left;
            if (w > limit) {
                d3.select(this).attr('textLength', limit).attr('lengthAdjust', 'spacingAndGlyphs');
            }
        });
    }

    me.skills = function (value) {
        if (!value) return value;

        skills = value;
        groups = skills.reduce(function (acc, s) {
            acc.add(s.group);
            return acc;
        }, d3.set()).values();

        return me;
    };

    me.selection = function (value) {
        if (!value) return selection;

        selection = value;
        return me;
    };

    me.width = function (value) {
        if (!value) return width;

        width = value;
        return me;
    };

    me.estHeight = function () {
        // seriously :)
        return 400;
    };

    me.render = function (selection) {
        selection.each(render);
    };

    d3.rebind(me, dispatch, 'on');

    return me;
}

window.skillSet = skillSet;
