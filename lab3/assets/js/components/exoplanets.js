module.exports = function() {
	
	let settings;
	
	return {
		
		settings: {
			
		},
		
		init: function() {
			
			
			var svgElement = d3.select('#main svg');
			
			d3.csv('exoplanets.csv').then(function(dataset) {
				
				let circle = svgElement.selectAll('circle').data(dataset).enter().append('circle');
				circle.attr('class', 'planet');
				
				// Set axes scales (reuse svgElement)
				let svg = svgElement;
				let xOffset = 100;
				let yOffset = 100;
				let width = window.innerWidth - xOffset;
				let height = window.innerHeight - yOffset;
				let maxRadius = 20;
				
				// Set SVG dimensions
				svg.attr('width', window.innerWidth).attr('height', window.innerHeight);
				
				let hzdExtent = d3.extent(dataset, function(d) {
					return +d['habital_zone_distance'];
				});
				let mass = d3.extent(dataset, function(d) {
					return +d['mass'];
				});
				let planetRadius = d3.extent(dataset, function(d) {
					return +d['radius'];
				});
				let xScale = d3.scaleLinear().domain(hzdExtent).range([xOffset, width]);
				let yScale = d3.scaleLog().domain(mass).range([height, yOffset]);
				let radiusScale = d3.scaleSqrt().domain(planetRadius).range([0, maxRadius]);
				let colorScale = d3.scaleQuantize().domain(hzdExtent).range(['#FF3300', '#29AD37', '#27EFFF']);
				
				// Set circle size
				circle.attr('cx', function(d) {
					return xScale(d.habital_zone_distance);
				});
				
				circle.attr('cy', function(d) {
					return yScale(d.mass);
				});
				
				circle.attr('r', function(d) {
					return radiusScale(d.radius);
				});
				
				circle.attr('fill', function(d) {
					return colorScale(d.habital_zone_distance);
				});
	
				// Add habitable zone x-axis
				svg.append('g').attr('class', 'x-axis')
				.attr('transform', 'translate(0, ' + (height + maxRadius) +')')
				.call(d3.axisBottom(xScale).tickFormat(function(d) {
					return d;
				}));
				svg.append('g').attr('class', 'x-axis')
				.attr('transform', 'translate(0, ' + (yOffset - maxRadius).toString() +')')
				.call(d3.axisBottom(xScale).tickFormat(function(d) {
					return d;
				}));
				
				
				// Add mass y-axis
				svg.append('g').attr('class', 'y-axis')
				.attr('transform', 'translate(90, 0)')
				.call(d3.axisLeft(yScale));
				svg.append('g').attr('class', 'y-axis')
				.attr('transform', 'translate(' + (width + maxRadius).toString() + ', 0)')
				.call(d3.axisLeft(yScale));
				
				// Label x-axis
				svg.append('text')
				.attr('class', 'label')
				.attr('transform','translate(' + (width/2 - 200).toString() + ',' + (height + 75).toString() +')')
				.text('Exoplanet Distance from Nearest Habitable Zone');
				// // Label y-axis
				svg.append('text') 
				.attr('class', 'label')
				.attr('transform','translate(35,' + ((height)/2 + 100).toString() + ') rotate(-90)')
				.text('Exoplanet Mass');
	
				// // Add graph title
				svg.append('text') 
				.attr('class', 'title')
				.attr('transform','translate(' + (width/2 - 100).toString() + ', 50)')
				.text('Exoplanet Mass Vs. Habitability');
			});
		}
	}
}