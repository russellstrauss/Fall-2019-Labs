var Activity1 = require('./components/activity-1.js');
var Scatterplot = require('./components/scatterplot.js');
var Utilities = require('./utils.js');

(function () {
	
	document.addEventListener('DOMContentLoaded', function() {
				
		let activity1 = document.getElementById('homerun-leaders');
		if (activity1) Activity1().init();
		
		let scatterplot = document.getElementById('scatterplot');
		if (scatterplot) Scatterplot().init();
	});
	
})();