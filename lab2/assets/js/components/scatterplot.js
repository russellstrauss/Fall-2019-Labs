
module.exports = function() {
	
	var settings;
	
	return {
		
		settings: {
			
		},
		
		init: function() {
			
			let self = this;
			
			d3.csv('../activity_2/baseball_hr_leaders.csv').then(function(dataset) {
				
				// Add empty circle elements, one for each row of data
				let circle = d3.select('body #scatterplot svg').selectAll('circle').data(dataset).enter().append('circle');
				
				//console.log(dataset);
				
				// Set axes scales
				let yearScale = d3.scaleLinear().domain([1870,2017]).range([60,700]);
				let hrScale = d3.scaleLinear().domain([0,75]).range([340,20]);
	
				let svg = d3.select('svg');
				
				// Add x-axis with markers in 20-year increments
				svg.append('g').attr('class', 'x axis')
				.attr('transform', 'translate(0, 345)')
				.call(d3.axisBottom(yearScale).tickFormat(function(d) {
					return d;
				}));
				
				// Label x-axis
				svg.append('text')
				.attr('class', 'label')
				.attr('transform','translate(360,390)')
				.text('MLB Season');
				
				// Add y-axis markers in increments of 10
				svg.append('g').attr('class', 'y axis')
				.attr('transform', 'translate(55,0)')
				.call(d3.axisLeft(hrScale));
	
				// Add y-axis label
				svg.append('text')
				.attr('class', 'label')
				.attr('transform','translate(15,200) rotate(90)')
				.text('Home Runs (HR)');
	
				// Add graph title
				svg.append('text')
				.attr('class', 'title')
				.attr('transform','translate(250,30)')
				.text('Top 10 HR Leaders per MLB Season');
				
				circle.attr('cx', function(d, i) {
					return yearScale(d.year);
				});
				
				circle.attr('cy', function(d, i) {
					return hrScale(d.homeruns);
				});
				
				circle.attr('r', '2');
				self.setTopRankedPlayers(circle);
			});
		},
		
		setTopRankedPlayers: function(player) {
			
			player.attr('class', function(d, i) {
				if (d.rank < 4) {
					return 'top-ranked';
				}
			});
		}
	}
}