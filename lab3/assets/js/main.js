var ExoPlanets = require('./components/exoplanets.js');
var Utilities = require('./utils.js');

(function () {
	
	document.addEventListener('DOMContentLoaded', function() {
				
		ExoPlanets().init();
	});
	
})();