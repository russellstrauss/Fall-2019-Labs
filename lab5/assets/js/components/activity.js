
module.exports = function() {
	
	var settings;
	var letters;
	var frequencyScale;
	var svg;
	var chartWidth;
	var chartHeight;
	var barHeight, barBand, actualBarHeight, barOffset;
	var padding = {t: 40, r: 40, b: 30, l: 40};
	var distinctColors = ['#7BA5B2', '#536480', '#433854', '#9FD185', '#DDF663', '#7FBAB4', '#87AB8F', '#6A5D96', '#644266', '#DA253E', '#DC963D', '#D2D721', '#545B95', '#651039', '#AF2220', '#C64343', '#EBDAB8', '#073665', '#041544', '#8BBABA', '#F27442', '#7A6780', '#8F9396', '#DBE1E2', '#9C160D', '#007487'];
		
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
			var svgHeight = window.innerHeight - 50;
			chartWidth = svgWidth - padding.l - padding.r;
			chartHeight = svgHeight - padding.t - padding.b;
			svg.attr('height', svgHeight.toString());
			svg.attr('width', svgWidth.toString());

			// Compute the spacing for bar bands based on all 26 letters
			barBand = chartHeight / 26;
			barHeight = barBand * 0.98;
			barOffset = barBand * .05;
			actualBarHeight = barBand/3;

			var chartG = svg.append('g').attr('transform', 'translate('+[padding.l, padding.t]+')');

			d3.csv('../../activities/letter_freq.csv', self.dataPreprocessor).then(function(dataset) {
				
				letters = dataset;
				self.updateChart('all-letters');
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
			.attr('transform', 'translate(' + padding.l + ',' + (padding.t - 10).toString() + ')')
			.call(d3.axisBottom(frequencyScale).tickFormat(function(d){return d;}));
			
			svg.append('g').attr('class', 'x-axis')
			.attr('transform', 'translate(' + padding.l + ',' + (chartHeight + padding.t).toString() + ')')
			.call(d3.axisBottom(frequencyScale).tickFormat(function(d) { return d;}));
			
			svg.append('text').attr('class', 'label').attr('transform','translate(' + (chartWidth/2 - 40).toString() + ', 20)').text('Letter Frequency (%)');
			
			filteredLetters.forEach(function(letter, i) {
				svg.append('text').attr('class', 'letter-row').attr('transform','translate(' + (padding.l - 20).toString() + ', ' + (barHeight * (i + 1) + padding.t).toString() + ')').text(letter.letter);
			});
							
			var wScale = d3.scaleLinear().domain([0, 75]).range([0, chartWidth]);
			
			svg.selectAll('rect')
			.data(filteredLetters)
			.enter()
			.append('rect')
			.attr('y', function(d, i) {
				console.log(d);
				return barHeight * (i + 1) + padding.t - actualBarHeight + barOffset;
			})
			.attr('x', padding.l.toString())
			.attr('height', actualBarHeight)
			.attr('width', function(d) {
				return wScale(d.frequency * 100);
			})
			.style('fill', function(d, i) {
				return 'rgb(123, 165, 178)';
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
			
			document.addEventListener('keypress', function(event) {
				if (event.code === 'Space') {
					self.reset();
				}
			});
		},
		
		reset: function() {
			
			document.querySelector('svg').remove();
			
			let svgEl = document.createElement('svg');    
			svgEl.classList.add('activity');
			document.getElementById('main').prepend(svgEl); 

			this.setUpScales();
		}
	}
}