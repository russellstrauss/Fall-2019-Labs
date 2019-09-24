
module.exports = function() {
	
	var settings;
	var letters;
	var frequencyScale;
	var svg;
	var chartWidth;
	var chartHeight;
	var barHeight;
	var barBand;
	var padding = {t: 40, r: 40, b: 30, l: 40};
		
	return {
		
		settings: {
			
		},
		
		init: function() {
						
			let self = this;

			svg = d3.select('svg');

			// Get layout parameters
			var svgWidth = +svg.attr('width');
			var svgHeight = +svg.attr('height');
			
			// Compute chart dimensions
			chartWidth = svgWidth - padding.l - padding.r;
			chartHeight = svgHeight - padding.t - padding.b;

			// Compute the spacing for bar bands based on all 26 letters
			barBand = chartHeight / 26;
			barHeight = barBand * 0.98;

			// Create a group element for appending chart elements
			var chartG = svg.append('g').attr('transform', 'translate('+[padding.l, padding.t]+')');

			d3.csv('../../activities/letter_freq.csv', self.dataPreprocessor).then(function(dataset) {
				
				letters = dataset;
				self.updateChart('all-letters');
			});


			document.getElementById('categorySelect').addEventListener('change', function() {
				var select = d3.select('#categorySelect').node();
				var category = select.options[select.selectedIndex].value;
				self.updateChart(category);
			});
		},
		
		updateChart: function(filterKey) {
			
			var lettersMap = {
				'all-letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
				'only-consonants': 'BCDFGHJKLMNPQRSTVWXZ'.split(''),
				'only-vowels': 'AEIOUY'.split('')
			};
			
			var filteredLetters = letters.filter(function(d) {
				return lettersMap[filterKey].indexOf(d.letter) >= 0;
			});
			
			frequencyScale = d3.scaleLinear().domain([0,75]).range([0, chartWidth]);
			svg.append('g').attr('class', 'x-axis')
			.attr('transform', 'translate(' + padding.l + ',' + padding.t + ')')
			.call(d3.axisBottom(frequencyScale).tickFormat(function(d){return d;}));
			
			svg.append('g').attr('class', 'x-axis')
			.attr('transform', 'translate(' + padding.l + ',' + (chartHeight + padding.t).toString() + ')')
			.call(d3.axisBottom(frequencyScale).tickFormat(function(d) { return d;}));
			
			svg.append('text').attr('class', 'label').attr('transform','translate(' + (chartWidth/2 - 40).toString() + ', 30)').text('Letter Frequency (%)');
			
			filteredLetters.forEach(function(letter, i) {
				svg.append('text').attr('class', 'letter-row').attr('transform','translate(' + (padding.l - 20).toString() + ', ' + (barHeight * (i + 1) + padding.t).toString() + ')').text(letter.letter);
			});
			
			var yScale = d3.scaleBand()
				.domain(filteredLetters)
				.rangeRound([padding.t, chartHeight]);
				
			var wScale = d3.scaleLinear().domain([0, 75]).range([0, chartWidth]);
			
			svg.selectAll('rect')
			.data(filteredLetters)
			.enter()
			.append('rect')
			.attr('y', function(d, i) {
				return yScale(i);
			})
			.attr('x', padding.l.toString())
			.attr('height', yScale)
			.attr('width', function(d) {
				return wScale(d.frequency*100);
			})
			.style('fill', '#5f3e36');
			//svg.append('g').attr('class', 'y-axis').attr('transform', 'translate(55,0)').call(d3.axisLeft(hrScale));
		},

		// recall that when data is loaded into memory, numbers are loaded as strings
		// this function helps convert numbers into string during data preprocessing
		dataPreprocessor: function(row) {
			return {
				letter: row.letter,
				frequency: +row.frequency
			};
		}
	}
}