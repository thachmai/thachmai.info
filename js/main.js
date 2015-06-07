function paperCombine(originatorId) {
    var transCount = 0;

    function makeSingle() {
        var xOffset;
        if (--transCount) {
            return;
        }

        var front = document.getElementById('front');
        var selected = document.getElementById(originatorId);
        xOffset = selected.getBoundingClientRect().left - front.getBoundingClientRect().left;
        var duration = Math.max(100 * Math.log2(xOffset), 600);

        d3.select(selected).style('width', '100%').style('margin-left', '0%');
        d3.selectAll('.three.columns.paper:not(#' + originatorId + ')').style('display', 'none');
        d3.select('#' + originatorId + ' h6').style('margin-left', xOffset + 'px').transition().duration(duration)
            .style('margin-left', '0px').text('Expertise');

        var width = selected.clientWidth - 16;
        var graph = skillGraph().skills(skills).width(width);
        d3.select('#' + originatorId + ' svg').attr('width', width + 'px')
            .call(graph.transitionToBar, xOffset, duration);

        var groupSkills = skills.filter(function (s) { return s.group === originatorId; });
        var selection = groupSkills.map(function (s) { return s.id; });
        var barGraph = skillGraph().skills(groupSkills).width(width);
        var height = barGraph.estHeight();
        d3.select('#' + originatorId + ' svg').transition().duration(duration)
            .attr('height', height + 'px');

        var ssW = width / 2 - 200;
        var ss = skillSet().skills(skills).width(ssW).selection(selection);

        graph.on('end', function () {
            d3.select('#' + originatorId + ' svg').call(barGraph.renderBar)
                .append('g').attr('class', 'skills').call(ss.render);
        });

        ss.on('change', function (selection) {
            var svg = d3.select('#' + originatorId + ' svg');
            barGraph.skills(skills.filter(function (s) {
                return selection.indexOf(s.id) > -1;
            }));
            svg.attr('height', barGraph.estHeight() + 'px').call(barGraph.renderBar)
        });
   }

    d3.selectAll('.three.columns.paper')
        .style('cursor', 'auto')
        .transition()
        .styleTween('width', function() { return d3.interpolate('22%', '25%'); })
        .styleTween('margin-left', function() { 
            var start = this.id === 'front' ? '0%' : '4%';
            var end = this.id === 'front' ? '0%' : '0%';
            return d3.interpolate(start, end);
        }).each(function () { transCount++; })
        .each('end', makeSingle);
}

var clicked = false;

d3.selectAll('.three.columns.paper')
    .style('cursor', 'pointer')
    .on('click', function () {
        if (clicked) return;
        paperCombine(this.id);
        clicked = true;
    });

function Skill(group, id, sname, lname, level, compact, desc) {
    if (!(this instanceof Skill)) return new Skill(group, id, sname, lname, level, compact, desc);

    this.group = group;
    this.id = id;
    this.sname = sname;
    this.lname = lname;
    this.level = level;
    this.compact = compact;
    this.desc = desc;
}

var skills = [
    Skill('front', 'js', 'Javascript', 'Javascript', 4, true, ''),
    Skill('front', 'html5', 'HTML5', 'HTML5', 3.5, true, ''),
    Skill('front', 'dv', 'Data Vis.', 'Data Visualization', 3.5, true, ''),
    Skill('front', 'wp', 'Web Perf.', 'Web Performance', 3, false, ''),
    Skill('front', 'ui', 'Design', 'UI Design', 2, false, ''),

    Skill('back', 'c#', 'C#', 'C#', 3.5, true, ''),
    Skill('back', 'sql', 'SQL', 'SQL', 3.5, true, ''),
    Skill('back', 'nosql', 'NoSQL', 'NoSQL', 3, true, ''),
    Skill('back', 'algo', 'Algorithm', 'Algorithm', 3, false, ''),
    Skill('back', 'distri', 'D. System', 'Distributed System', 2.5, false, ''),

    Skill('ops', 'linux', 'Linux', 'Linux', 3, true, ''),
    Skill('ops', 'win', 'Windows', 'Windows', 3, false, ''),
    Skill('ops', 'docker', 'Docker', 'Docker', 2.5, true, ''),
    Skill('ops', 'auto', 'IT Auto.', 'IT Automation', 2.5, true, ''),
    Skill('ops', 'scripts', 'Scripting', 'Shell Scripting', 2.5, false, ''),

    Skill('bus', 'danal', 'D. Analys', 'Data Analysis', 3, true, ''),
    Skill('bus', 'geo', 'Geo Sys.' , 'Geographic System', 3, true, ''),
    Skill('bus', 'fa', 'F. Analys', 'Functional Analysis', 3, true, ''),
    Skill('bus', 'process', 'Bus. Process', 'Business Process', 2.5, false, ''),
    Skill('bus', 'math', 'Math', 'Mathematics', 3, false, ''),
];

function compactPanel(id, skills) {
    var panel = d3.select('#' + id);
    var width = panel.node().clientWidth - 16;
    var svg = panel.append('svg').attr('width', width + 'px');

    var graph = skillGraph().skills(skills).width(width);
    svg.attr('height', graph.estHeight() + 'px');
    svg.call(graph.renderCompact);
}

['front', 'back', 'ops', 'bus'].forEach(function (s, i) {
    var groupSkills = skills.filter(function (skill) { 
        return skill.group === s && skill.compact; 
    });
    compactPanel(s, groupSkills);
});
