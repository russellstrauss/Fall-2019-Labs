var Tutorials = require('./components/tutorials.js');
var Nesting = require('./components/nesting.js');
var Utilities = require('./utils.js');

(function () {
	
	document.addEventListener('DOMContentLoaded', function() {
		
		if (document.querySelector('.activity')) Nesting().init();
		if (document.querySelector('.tutorial'))Tutorials().init();
	});
})();