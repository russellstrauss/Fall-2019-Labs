
module.exports = function() {
	
	var settings;
	
	return {
		
		settings: {
			
		},
		
		init: function() {
			
			let self = this;
			
			d3.csv('../activity_2/baseball_hr_leaders.csv').then(function(dataset) {
				
				// Add empty circle elements, one for each row of data
				let g = d3.select('body #scatterplot svg').selectAll('g').data(dataset).enter().append('g');
				
				g.attr('class', 'player');
				// g.attr('width', '50');
				// g.attr('height', '50');
				
				//console.log(dataset);
				
				// Set axes scales
				let width = window.innerWidth - 200;
				let height = window.innerHeight - 100;
				let yearScale = d3.scaleLinear().domain([1870, 2017]).range([60, width]);
				let hrScale = d3.scaleLinear().domain([0, 75]).range([height, 20]);
	
				let svg = d3.select('svg');
				
				// Add x-axis with markers in 20-year increments
				svg.append('g').attr('class', 'x axis')
				.attr('transform', 'translate(0, ' + height +')')
				.call(d3.axisBottom(yearScale).tickFormat(function(d) {
					return d;
				}));
				
				// Label x-axis
				svg.append('text')
				.attr('class', 'label')
				.attr('transform','translate(' + (width/2).toString() + ',' + (height + 75).toString() +')')
				.text('MLB Season Year');
				
				// Add y-axis markers in increments of 10
				svg.append('g').attr('class', 'y axis')
				.attr('transform', 'translate(55,0)')
				.call(d3.axisLeft(hrScale));
	
				// Add y-axis label
				svg.append('text') // TODO: measure width and subtract half
				.attr('class', 'label')
				.attr('transform','translate(-15,' + ((height-115)/2).toString() + ') rotate(90)')
				.text('Home Runs');
	
				// Add graph title
				svg.append('text') // TODO: measure width and then subtract half
				.attr('class', 'title')
				.attr('transform','translate(' + (width/2 - 200).toString() + ',30)')
				.text('Top 10 HR Leaders per MLB Season');
				
				let circle = self.setCirclePositionWithLabels(g, yearScale, hrScale);
				self.setTopRankedPlayers(circle);
			});
		},
		
		setTopRankedPlayers: function(player) {
			
			player.attr('class', function(d, i) {
				if (d.rank < 4) {
					return 'top-ranked';
				}
			});
		},
		
		setCirclePositionWithLabels: function(g, yearScale, hrScale) {
			
			let circle = g.append('circle');
			
			circle.attr('cx', function(d, i) {
				return yearScale(d.year);
			});
			
			circle.attr('cy', function(d, i) {
				return hrScale(d.homeruns);
			});
			
			circle.attr('r', '2');
			
			let label = g.append('text');
			label.text(function (d) { 
				return d.name;
			});
			
			label.attr('x', function(d, i) {
				return yearScale(d.year);
			});
			
			label.attr('y', function(d, i) {
				return hrScale(d.homeruns);
			});
			
			return circle;
		}
	}
}