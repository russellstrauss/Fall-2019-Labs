var Tutorials = require('./components/tutorials.js');
var Activity = require('./components/activity.js');
var Utilities = require('./utils.js');

(function () {
	
	document.addEventListener('DOMContentLoaded', function() {
		
		if (document.querySelector('.activity')) Activity().init();
		if (document.querySelector('.tutorial')) Tutorials().init();
	});
})();``