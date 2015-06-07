function skillSet() {
    'use strict';

    var skills = [];
    var selection = [];
    var width = 0;

    var groups;

    function me() {
    }

    function groupW() {
        return width / groups.length;
    }

    function groupX(d, i) {
        return i * groupW();
    }

    function render() {
        var dThis = d3.select(this);

        var binding = dThis.selectAll('.group').data(groups);
        var gEnter = binding.enter().append('g').attr('class', 'group');

        gEnter.append('text').attr('x', groupX)
            .attr('y', 20).text(function (d) { return d; });

        gEnter.each(function (group, column) {
            console.log(group, column)
                var gSkills = skills.filter(function (s) { return s.group === group; });
            d3.select(this).selectAll('.skill-selection').data(gSkills)
                .enter()
                .append('text').attr('class', 'skill-selection')
                .attr('style', 'font-size: 12px; opacity: 0;')
                .text(function (d) { return d.sname; })
                .attr('x', function (d, row) { return groupX(d, column); })
                .attr('y', function (d, row) { return 20 + (row + 1) * 15; })
                .transition().delay(function (d, i) { return 100 + 100 * i + column * 500; })
                .style('opacity', 1);
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

    return me;
}

window.skillSet = skillSet;
