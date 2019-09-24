
module.exports = function() {
	
	var settings;
	var letters;
	var frequencyScale;
	var svg;
	var chartWidth;
	var chartHeight;
	var barHeight, barBand, actualBarHeight, barOffset;
	var padding = {t: 40, r: 40, b: 30, l: 40};
		
	return {
		
		settings: {
			
		},
		
		init: function() {
						
			let self = this;
			
			this.addEvents();
			this.setUpScales();
			
		},
		
		setUpScales: function() {
			
			let self = this;
			svg = d3.select('svg');
			var svgWidth = window.innerWidth;
			var svgHeight = window.innerHeight - 75;
			chartWidth = svgWidth - padding.l - padding.r;
			chartHeight = svgHeight - padding.t - padding.b;
			svg.attr('height', svgHeight.toString());
			svg.attr('width', svgWidth.toString());

			// Compute the spacing for bar bands based on all 26 letters
			barBand = chartHeight / 26;
			barHeight = barBand * 0.98;
			barOffset = barBand * .15;
			actualBarHeight = barBand/2;

			var chartG = svg.append('g').attr('transform', 'translate('+[padding.l, padding.t]+')');

			d3.csv('../../activities/letter_freq.csv', self.dataPreprocessor).then(function(dataset) {
				
				letters = dataset;
				self.updateChart('all-letters');
			});
		},
		
		resetSVG: function() {
			
			let remove = document.querySelectorAll('svg *');
			remove.forEach(function(element) {
				element.parentNode.removeChild(element);
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
			
			this.resetSVG();
			
			frequencyScale = d3.scaleLinear().domain([0, 14]).range([0, chartWidth]);
			svg.append('g').attr('class', 'x-axis')
			.attr('transform', 'translate(' + padding.l + ',' + (padding.t - 10).toString() + ')')
			.call(d3.axisBottom(frequencyScale).tickFormat(function(d){return d;}));
			
			svg.append('g').attr('class', 'x-axis')
			.attr('transform', 'translate(' + padding.l + ',' + (chartHeight + padding.t).toString() + ')')
			.call(d3.axisBottom(frequencyScale).tickFormat(function(d) { return d;}));
			
			svg.append('text').attr('class', 'label').attr('transform','translate(' + (chartWidth/2 - 40).toString() + ', 20)').text('Letter Frequency (%)');
			
			svg.selectAll('rect')
			.data(filteredLetters)
			.enter()
			.append('rect')
			.attr('y', function(d, i) {
				return barHeight * (i + 1) + padding.t - actualBarHeight + barOffset;
			})
			.attr('x', padding.l.toString())
			.attr('height', actualBarHeight)
			.attr('width', function(d) {
				return frequencyScale(d.frequency * 100);
			})
			.style('fill', function(d, i) {
				return '#809C63';
			});
			
			filteredLetters.forEach(function(letter, i) {
				svg.append('text').attr('class', 'letter-row').attr('transform','translate(' + (padding.l - 20).toString() + ', ' + (barHeight * (i + 1) + padding.t).toString() + ')').text(letter.letter);
				
				let percentLabel = (letter.frequency * 100).toFixed(1) + '%';
				if (percentLabel.substr(percentLabel.length - 3) === '.0%') percentLabel = percentLabel.substr(0, percentLabel.length - 3) + '%'; // truncate .0% to whole number

				if (letter.frequency < .007) {// when bar is skinny
					svg.append('text').attr('class', 'low-percent-label').attr('fill', 'black').attr('transform','translate(75,' + (barHeight * (i + 1) + padding.t).toString() + ')').text(percentLabel);
				}
				else {
					svg.append('text').attr('class', 'percent-label').attr('transform','translate(45,' + (barHeight * (i + 1) + padding.t).toString() + ')').text(percentLabel);
				}
			});
		},

		// recall that when data is loaded into memory, numbers are loaded as strings
		// this function helps convert numbers into string during data preprocessing
		dataPreprocessor: function(row) {
			return {
				letter: row.letter,
				frequency: +row.frequency
			};
		},
		
		addEvents: function() {
			
			let self = this;
			
			window.addEventListener('resize', utils.debounce(function(event) {
				self.reset();
			}, 125));
			
			document.getElementById('categorySelect').addEventListener('change', function() {
				var select = d3.select('#categorySelect').node();
				var category = select.options[select.selectedIndex].value;
				self.updateChart(category);
			});
		},
		
		reset: function() {
			
			this.resetSVG();
			this.setUpScales();
			
			var select = d3.select('#categorySelect').node();
			var category = select.options[select.selectedIndex].value;
			self.updateChart(category);
		}
	}
}