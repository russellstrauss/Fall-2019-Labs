var svg = d3.select('svg');
var width = window.innerWidth;
var height = window.innerHeight;
var colorScale = d3.scaleSequential(d3.interpolateViridis);
var linkScale = d3.scaleSqrt().range([1,5]);

d3.json('les_miserables.json').then(function(dataset) {

	network = dataset;
	linkScale.domain(d3.extent(network.links, function(d){ return d.value; }));

	var linkG = svg.append('g').attr('class', 'links-group');
	var nodeG = svg.append('g').attr('class', 'nodes-group');
	
	var simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(function(d) { return d.id; }))
	.force('charge', d3.forceManyBody().strength(150))
	.force('repelForce', d3.forceManyBody().strength(-300).distanceMax(height/2).distanceMin(10))
	.force('center', d3.forceCenter(width / 2, height / 2));
	
	var linkEnter = linkG.selectAll()
    .data(network.links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .attr('stroke-width', function(d) {
        return linkScale(d.value);
	});
	
	var groupMaxValue = d3.max(network.nodes, function(d) { return d.group; });
	
	var nodeEnter = nodeG.selectAll()
    .data(network.nodes)
    .enter()
    .append('circle')
    .attr('class', 'node')
    .attr('r', 15)
    .style('fill', function(d) {
        return colorScale(d.group/groupMaxValue);
	});
	
	simulation.nodes(dataset.nodes).on('tick', tickSimulation);
	simulation.force('link').links(dataset.links);
	
	var done = false;
	function tickSimulation() {
		
		linkEnter
		.attr('x1', function(d) { 
			return d.source.x;})
		.attr('y1', function(d) { return d.source.y;})
		.attr('x2', function(d) { return d.target.x;})
		.attr('y2', function(d) { return d.target.y;});

		nodeEnter
		.attr('cx', function(d) { return d.x;})
		.attr('cy', function(d) { return d.y;});
	}
	
	var drag = d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
	.on('end', dragended);
	nodeEnter.call(drag);
	
	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.5).restart();
		d.fx = d.x;
		d.fy = d.y;
	}
	
	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}
	
	function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}
	
	var toolTip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-12, 0])
	.html(function(d) {
		
		let tooltipMarkup = '<div class="tooltip">';
		tooltipMarkup += '<h3>' + d.id + '</h3>';
		tooltipMarkup += '</div>';
		
		return tooltipMarkup;
	});
	svg.call(toolTip);
	nodeEnter.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);
});
