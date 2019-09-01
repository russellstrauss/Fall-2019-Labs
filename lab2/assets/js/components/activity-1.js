module.exports = function() {
	
	var settings;
	
	return {
		
		settings: {
			
		},
		
		init: function() {
			
			
			d3.csv('../activity_1/baseball_hr_leaders_2017.csv').then(function(dataset) {
				
				let tr = d3.select('body #homerun-table tbody').selectAll('tr').data(dataset).enter().append('tr');
				
				tr.append('td')
				.attr('class', 'rank')
				.text(function(d, i) { 
					return d.rank;
				});
				
				tr.append('td')
				.attr('class', 'player-name')
				.text(function(d, i) { 
					return d.name;
				});
				
				tr.append('td')
				.attr('class', 'homerun-count')
				.text(function(d, i) { 
					return d.homeruns;
				});
			});
		}
	}
}