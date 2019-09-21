
module.exports = function() {
	
	var settings;
	
	return {
		
		settings: {
			
		},
		
		init: function() {
			
			let self = this;
			
			var svg = d3.select('svg');

			var svgWidth = +svg.attr('width');
			var svgHeight = +svg.attr('height');

			// Define a padding object
			// This will space out the trellis subplots
			var padding = {t: 20, r: 20, b: 60, l: 60};

			// Compute the dimensions of the trellis plots, assuming a 2x2 layout matrix.
			var trellisWidth = svgWidth / 2 - padding.l - padding.r;
			var trellisHeight = svgHeight / 2 - padding.t - padding.b;

			// As an example for how to layout elements with our variables
			// Lets create .background rects for the trellis plots
			svg.selectAll('.background')
				.data(new Array(4)) // empty array for looping
				.enter()
				.append('rect') // Append 4 rectangles
				.attr('class', 'background')
				.attr('width', trellisWidth) // Use our trellis dimensions
				.attr('height', trellisHeight)
				.attr('transform', function(d, i) {
					// Position based on the matrix array indices.
					// i = 1 for column 1, row 0)
					var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
					var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
					return 'translate('+[tx, ty]+')';
				});

			var parseDate = d3.timeParse('%b %Y');
			// To speed things up, we have already computed the domains for your scales
			var dateDomain = [new Date(2000, 0), new Date(2010, 2)];
			var priceDomain = [0, 223.02];

			d3.csv('../activities/stock_prices.csv').then(function(dataset) {
				
				dataset.forEach(function(price) {
					price.date = parseDate(price.date);
				});
								
				var nested = d3.nest().key(function(c) {
					return c.company;
				})
				.entries(dataset);
				
				var trellisG = svg.selectAll('.trellis')
				.data(nested)
				.enter()
				.append('g')
				.attr('class', 'trellis').attr('transform', function(d,i) {
					var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
					var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
					return 'translate('+[tx, ty]+')';
				});
				
				var xScale = d3.scaleTime().domain(dateDomain).range([0, trellisWidth]);
				var yScale = d3.scaleLinear().domain(priceDomain).range([trellisHeight, 0]);
				var linearInterpolation = d3.line().x(function(d) { 
					return xScale(d.date);
				})
				.y(function(d) { 
					return yScale(d.price);
				});
				
				var companyNames = nested.map(function(d){
					return d.key;
				});
				var colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(companyNames);
				
				trellisG.selectAll('.line-plot').data(function(d){
					return [d.values];
				})
				.enter()
				.append('path')
				.attr('class', 'line-plot')
				.attr('d', linearInterpolation)
				.style('stroke', function(d) {
					return colorScale(d[0].company);
				});
				
				var xAxis = d3.axisBottom(xScale);
				trellisG.append('g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + trellisHeight + ')')
				.call(xAxis);

				var yAxis = d3.axisLeft(yScale);
				trellisG.append('g')
				.attr('class', 'y axis')
				.attr('transform', 'translate(0,0)')
				.call(yAxis);
				
				trellisG.append('text')
				.attr('class', 'company-label')
				.attr('transform', 'translate('+[trellisWidth / 2, trellisHeight / 2]+')')
				.attr('fill', function(d){
					return colorScale(d.key);
				})
				.text(function(d){
					return d.key;
				});
				
				trellisG.append('text')
				.attr('class', 'x axis-label')
				.attr('transform', 'translate('+[trellisWidth / 2, trellisHeight + 34]+')')
				.text('Date (by Month)');

				trellisG.append('text')
				.attr('class', 'y axis-label')
				.attr('transform', 'translate('+[-30, trellisHeight / 3]+') rotate(270)')
				.text('Stock Price (USD)');
				
				var xGrid = d3.axisTop(xScale)
				.tickSize(-trellisHeight, 0, 0)
				.tickFormat('');

				trellisG.append('g')
					.attr('class', 'x grid')
					.attr('style', 'opacity: .15;')
					.call(xGrid);

				var yGrid = d3.axisLeft(yScale)
					.tickSize(-trellisWidth, 0, 0)
					.tickFormat('')

				trellisG.append('g')
					.attr('class', 'y grid')
					.attr('style', 'opacity: .15;')
					.call(yGrid);
			});

			
			//d3.csv('../activities/stock_prices.csv').then(function(dataset) {
				
				// Add empty circle elements, one for each row of data
				//let g = d3.select('svg').selectAll('g').data(dataset).enter().append('g');
				// g.attr('class', 'player');
				
				// // Set axes scales
				// let width = window.innerWidth - 200;
				// let height = window.innerHeight - 100;
				// let yearScale = d3.scaleLinear().domain([1870, 2017]).range([60, width]);
				// let hrScale = d3.scaleLinear().domain([0, 75]).range([height, 20]);
	
				// let svg = d3.select('svg');
				
				// // Add x-axis with markers in 20-year increments
				// svg.append('g').attr('class', 'x axis')
				// .attr('transform', 'translate(0, ' + height +')')
				// .call(d3.axisBottom(yearScale).tickFormat(function(d) {
				// 	return d;
				// }));
				
				// // Label x-axis
				// svg.append('text')
				// .attr('class', 'label')
				// .attr('transform','translate(' + (width/2).toString() + ',' + (height + 75).toString() +')')
				// .text('MLB Season Year');
				
				// // Add y-axis markers in increments of 10
				// svg.append('g').attr('class', 'y axis')
				// .attr('transform', 'translate(55,0)')
				// .call(d3.axisLeft(hrScale));
	
				// // Add y-axis label
				// svg.append('text') // TODO: measure width and subtract half
				// .attr('class', 'label')
				// .attr('transform','translate(-15,' + ((height-115)/2).toString() + ') rotate(90)')
				// .text('Home Runs');
	
				// // Add graph title
				// svg.append('text') // TODO: measure width and then subtract half
				// .attr('class', 'title')
				// .attr('transform','translate(' + (width/2 - 200).toString() + ',30)')
				// .text('Top 10 HR Leaders per MLB Season');
				
				// let circle = self.setCirclePositionWithLabels(g, yearScale, hrScale);
				// self.setTopRankedPlayers(circle);
			//});
		}
	}
}