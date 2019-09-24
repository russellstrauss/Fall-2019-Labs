
module.exports = function() {
	
	var settings;
	
	return {
		
		settings: {
			
		},
		
		init: function() {
			
			this.updateCircles(['A', 'B', 'C']);
			this.updateCircles(['A', 'B']);
			this.updateCircles(['A', 'B', 'C', 'D', 'E', 'F']);
		},
		
		updateCircles: function(letters) {
			var letter = d3.select('svg').selectAll('.letter')
				.data(letters);
	
			var letterEnter = letter.enter()
				.append('g')
				.attr('class', 'letter');
	
			letterEnter.merge(letter)
				.attr('transform', function(d,i) {
					return 'translate('+[i * 60 + 50, 50]+')';
				});
	
			letterEnter.append('circle')
				.attr('r', 20);
	
			letterEnter.append('text')
				.attr('y', 30)
				.text(function(d) {
					return d;
				});
	
			letter.exit().remove();
		}
	}
}