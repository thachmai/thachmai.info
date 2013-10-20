angular.module('Skillset', [])
	.factory('Skill', function () {
	    return{
	        frontend: [
				{
				    value: 2.5, serieName: 'HTML5',
				    description: 'I\'m proficient with the various technologies included in HTML5 that allows us to quickly build a slick, modern web interface.',
	                subskills: { 'CSS3': 2.5, 'SVG': 3, 'Canvas': 2, 'WebSocket': 2, 'WebWorker': 2,'WebGL': 1 }
				},
				{
				    value: 3, serieName: 'Javascript',
				    description: 'Intimately familiar the language\'s design and particularities, I\'m capable of building large, complex and maintainable applications using Javascript.'
				},
				{
				    value: 2.5, serieName: 'CSS',
				    description: 'I have extensive working knowledge of CSS1, CSS2 and CSS3; which enable me to build efficient layout while maintaining backward compability with older browsers.'
				},
				{
				    value: 2.5, serieName: 'Web Frameworks',
				    description: 'I work extensively with various web frameworks including jQuery, d3.js, jasmine, three.js and the Google Maps API.'
				},
				{
				    value: 2, serieName: 'Performance',
				    description: 'Knowledge of networking and browser rendering process enable me to build speedy and efficient web applications.'
				}],
			backend: [
				{
				    value: 2.5, serieName: 'Asp.Net MVC',
				    description: 'Well versed with Asp.NET MVC 3 and 4, I can offer back end solutions that are efficient, scalable and maintainable.'
				},
				{
				    value: 3, serieName: 'C#',
				    description: 'I have extensive working knowledge with the language in different domains, from implementing machine learning algorithms to building backend web services using C#.'
				},
				{
				    value: 2.5, serieName: 'DBMS / SQL',
				    description: 'With extensive experience in using various DBMS (Oracle, SQL Server, Postgres), I\'m familiar with database design, implementation, migration, as well as performance tuning.'
				},
				{
				    value: 1.5, serieName: 'Node.js',
				    description: 'I have some working experiences using Node.js to quickly implement prototypes and proof-of-concept applications.'
				},
				{
				    value: 1.5, serieName: 'NoSQL',
				    description: 'I have theoratical understanding of NoSQL databases (Redis and CouchDB).'
				}
			],
			domains: [
				{
				    value: 2, serieName: 'Geo information system',
				    description: 'Having worked with OpenStreetMap, Google Maps API, OpenLayers and Mapnik, I\'m proficient with using and creating a geographical information system.'
				},
				{
				    value: 2.5, serieName: 'Public transport domain',
				    description: 'With four years of experience in various public transporation projects, I have a thourough understanding of the unique challenges in this domain.'
				},
				{
				    value: 2.5, serieName: 'git',
				    description: 'I\'m comfortable with various tasks related to the git source control system: server setup, access control, branching models as well as the distributed nature of git.'
				},
				{
				    value: 2, serieName: 'Agile process',
				    description: 'With over three years of experience with Agile process (mainly SCRUM), I\'m familiar with the agile methodologies, their advantages as well as limitations.'
				},
				{
				    value: 2.5, serieName: 'Engineering best practices',
				    description: 'I\'m familiar with various software engineering best practices including TDD, agile methodology as well as other popular best practices such as the SOLID concepts, DRY, YAGNI, etc.'
				}
			]
		};
	})
	.directive('chart', function () {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				scope.chart(attrs.chart, element);
			});
		};
	});

function SkillCtrl($scope, Skill) {
	var padding = 20, radius = 200, paddedRadius = padding + radius,
		svg = d3.select('#RadarSvg').attr('width', paddedRadius * 2 + 0.5).attr('height', paddedRadius * 2),
		radar = radarChart(),
		lastChart = null;

	radar.click(function (d) {
	    //d3.select('#RadarDescriptionBridge').style('opacity', 0).transition().duration(1000).style('opacity', 1);
	    d3.select('#RadarDescription').transition().delay(500).text(d.description);
	});

	$scope.chart = function (skill, element) {
		if (element === lastChart) return;

		if (lastChart !== null) lastChart.removeClass('panel');

		element.addClass('panel');
		lastChart = element;

		svg.select('.radar-chart').selectAll('*').remove();
		svg.select('.radar-chart').datum(Skill[skill]).call(radar);
	};

	svg.append('g')
		.attr('class', 'radar-chart')
		.attr('transform', 'translate(' + paddedRadius + ' ' + paddedRadius + ')');

	$scope.chart('frontend', angular.element(document.getElementById('FirstSkill')));
}

// bootstraping the Skillset app
angular.bootstrap(document.getElementById('SkillsetAppRoot'), ['Skillset']);


angular.module('ExpEdu', [])
	.factory('Experience', function () {
		function e(items, languages, technics) {
			this.items = items, this.languages = languages, this.technics = technics;
			return this;
		}

		return [
			new e(['Design and implement an HTML5 application from the research prototype',
				'Technical direction and guidance for the team'],
				['French', 'English'],
				['Asp.NET MVC', 'Javascript', 'HTML5', 'jQuery', 'D3.js', 'Ninject', 'xUnit', 'OpenLayers', 'C#', 'Oracle']),
			new e(['Conceived and implemented a Silverlight prototype for a public transportation datamining application'],
				['French', 'English'],
				['Silverlight', 'SQL Server', 'C#', 'ArcGIS', 'Entity Framework']),
			new e(['Conceived and implemented an application to calculate and display financial results for a public transportation network'],
				['French', 'English'],
				['Asp.NET', 'Javascript', 'Oracle', 'C#', 'Windows service']),
			new e(['Conceived and implemented an application to manage and analyse marketing campaigns'],
				['English'],
				['Asp.NET', 'C#', 'Javascript', 'SQL Server']),
			new e(['Implemented a machine-to-machine interface between Cristal-Net and a pharmaceutical robot'],
				['French'],
				['C#', 'Windows service', 'SQL Server']),
			new e(['Managed a team of 25 software engineers and designers', 'Provided technical mentorship and training'],
				['English', 'Vietnamese'],
				[]),
			new e(['Led a team of 5 engineers, reported to Canadian office', 'Implemented technical solutions for TRG clients'],
				['English', 'Vietnamese'],
				['C#', 'Asp.NET', 'Windows service', 'SQL Server']),
			new e(['Assisted in technical proposition for request for proposals (RFP)'],
				['English', 'Vietnamese'],
				[]),
			new e(['Studied the Japanese work culture and how to successfully bridge the cultural divide'],
				['English'],
				[]),
			new e(['Implemented the web calendar component for Critical Path suite'],
				['English', 'Vietnamese'],
				['Java', 'Struts', 'Berkeley DB']),
			new e(['Studied the fundamentals of software development', '3.7/4 GPA'],
				['English'],
				[])
		];
	})
	.directive('position', function () {
		return function (scope, element, attrs) {
			element.addClass('highlightable');

			element.bind('click', function () {
				scope.position(attrs.position, element);
			});
		};
	})
	.directive('description', function () {
		return function (scope, element, attrs) {
			element.bind('click', function () {
				scope.description(attrs.description);
			});
		};
	});

function ExperienceCtrl($scope, Experience) {
	var lastPos = null,
		expContainer = d3.select('#ExpDescription'),
		expLanguage = d3.select('#ExpLanguage'),
		experiences = Experience;

	$scope.position = function (id, element) {
		if (lastPos !== null) lastPos.removeClass('panel');

		element.addClass('panel');
		globeController.glideTo(id);
		lastPos = element;
	};

	$scope.description = function (id) {
		var text;

		expContainer.selectAll('*').remove();

		if (experiences[id].items.length === 1) {
			expContainer
				.append('div')
				.attr('class', 'exp-task')
				.text(experiences[id].items[0]);
		} else {
			expContainer
				.append('ul')
				.selectAll('li')
				.data(experiences[id].items)
				.enter()
				.append('li')
				.text(function (d) { return d; });
		}

		expLanguage.selectAll('*').remove();
		expLanguage.text(experiences[id].languages.join(', '));
	}
}

angular.bootstrap(document.getElementById('ExpEduAppRoot'), ['ExpEdu']);