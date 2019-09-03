(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = function () {
  var settings;
  return {
    settings: {},
    init: function init() {
      d3.csv('../activity_1/baseball_hr_leaders_2017.csv').then(function (dataset) {
        var tr = d3.select('body #homerun-table tbody').selectAll('tr').data(dataset).enter().append('tr');
        tr.append('td').attr('class', 'rank').text(function (d, i) {
          return d.rank;
        });
        tr.append('td').attr('class', 'player-name').text(function (d, i) {
          return d.name;
        });
        tr.append('td').attr('class', 'homerun-count').text(function (d, i) {
          return d.homeruns;
        });
      });
    }
  };
};

},{}],2:[function(require,module,exports){
"use strict";

module.exports = function () {
  var settings;
  return {
    settings: {},
    init: function init() {
      var self = this;
      d3.csv('../activity_2/baseball_hr_leaders.csv').then(function (dataset) {
        // Add empty circle elements, one for each row of data
        var g = d3.select('body #scatterplot svg').selectAll('g').data(dataset).enter().append('g');
        g.attr('class', 'player'); // g.attr('width', '50');
        // g.attr('height', '50');
        //console.log(dataset);
        // Set axes scales

        var width = window.innerWidth - 200;
        var height = window.innerHeight - 100;
        var yearScale = d3.scaleLinear().domain([1870, 2017]).range([60, width]);
        var hrScale = d3.scaleLinear().domain([0, 75]).range([height, 20]);
        var svg = d3.select('svg'); // Add x-axis with markers in 20-year increments

        svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + height + ')').call(d3.axisBottom(yearScale).tickFormat(function (d) {
          return d;
        })); // Label x-axis

        svg.append('text').attr('class', 'label').attr('transform', 'translate(' + (width / 2).toString() + ',' + (height + 75).toString() + ')').text('MLB Season Year'); // Add y-axis markers in increments of 10

        svg.append('g').attr('class', 'y axis').attr('transform', 'translate(55,0)').call(d3.axisLeft(hrScale)); // Add y-axis label

        svg.append('text') // TODO: measure width and subtract half
        .attr('class', 'label').attr('transform', 'translate(-15,' + ((height - 115) / 2).toString() + ') rotate(90)').text('Home Runs'); // Add graph title

        svg.append('text') // TODO: measure width and then subtract half
        .attr('class', 'title').attr('transform', 'translate(' + (width / 2 - 200).toString() + ',30)').text('Top 10 HR Leaders per MLB Season');
        var circle = self.setCirclePositionWithLabels(g, yearScale, hrScale);
        self.setTopRankedPlayers(circle);
      });
    },
    setTopRankedPlayers: function setTopRankedPlayers(player) {
      player.attr('class', function (d, i) {
        if (d.rank < 4) {
          return 'top-ranked';
        }
      });
    },
    setCirclePositionWithLabels: function setCirclePositionWithLabels(g, yearScale, hrScale) {
      var circle = g.append('circle');
      circle.attr('cx', function (d, i) {
        return yearScale(d.year);
      });
      circle.attr('cy', function (d, i) {
        return hrScale(d.homeruns);
      });
      circle.attr('r', '2');
      var label = g.append('text');
      label.text(function (d) {
        return d.name;
      });
      label.attr('x', function (d, i) {
        return yearScale(d.year);
      });
      label.attr('y', function (d, i) {
        return hrScale(d.homeruns);
      });
      return circle;
    }
  };
};

},{}],3:[function(require,module,exports){
"use strict";

var Activity1 = require('./components/activity-1.js');

var Scatterplot = require('./components/scatterplot.js');

var Utilities = require('./utils.js');

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var activity1 = document.getElementById('homerun-leaders');
    if (activity1) Activity1().init();
    var scatterplot = document.getElementById('scatterplot');
    if (scatterplot) Scatterplot().init();
  });
})();

},{"./components/activity-1.js":1,"./components/scatterplot.js":2,"./utils.js":4}],4:[function(require,module,exports){
"use strict";

(function () {
  var appSettings;

  window.utils = function () {
    return {
      appSettings: {
        breakpoints: {
          mobileMax: 767,
          tabletMin: 768,
          tabletMax: 991,
          desktopMin: 992,
          desktopLargeMin: 1200
        }
      },
      mobile: function mobile() {
        return window.innerWidth < this.appSettings.breakpoints.tabletMin;
      },
      tablet: function tablet() {
        return window.innerWidth > this.appSettings.breakpoints.mobileMax && window.innerWidth < this.appSettings.breakpoints.desktopMin;
      },
      desktop: function desktop() {
        return window.innerWidth > this.appSettings.breakpoints.desktopMin;
      },
      getBreakpoint: function getBreakpoint() {
        if (window.innerWidth < this.appSettings.breakpoints.tabletMin) return 'mobile';else if (window.innerWidth < this.appSettings.breakpoints.desktopMin) return 'tablet';else return 'desktop';
      },
      debounce: function debounce(func, wait, immediate) {
        var timeout;
        return function () {
          var context = this,
              args = arguments;

          var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };

          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      },

      /* Purpose: Detect if any of the element is currently within the viewport */
      anyOnScreen: function anyOnScreen(element) {
        var win = $(window);
        var viewport = {
          top: win.scrollTop(),
          left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
        var bounds = element.offset();
        bounds.right = bounds.left + element.outerWidth();
        bounds.bottom = bounds.top + element.outerHeight();
        return !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom);
      },

      /* Purpose: Detect if an element is vertically on screen; if the top and bottom of the element are both within the viewport. */
      allOnScreen: function allOnScreen(element) {
        var win = $(window);
        var viewport = {
          top: win.scrollTop(),
          left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
        var bounds = element.offset();
        bounds.right = bounds.left + element.outerWidth();
        bounds.bottom = bounds.top + element.outerHeight();
        return !(viewport.bottom < bounds.top && viewport.top > bounds.bottom);
      },
      secondsToMilliseconds: function secondsToMilliseconds(seconds) {
        return seconds * 1000;
      },

      /*
      * Purpose: This method allows you to temporarily disable an an element's transition so you can modify its proprties without having it animate those changing properties.
      * Params:
      * 	-element: The element you would like to modify.
      * 	-cssTransformation: The css transformation you would like to make, i.e. {'width': 0, 'height': 0} or 'border', '1px solid black'
      */
      getTransitionDuration: function getTransitionDuration(element) {
        var $element = $(element);
        return utils.secondsToMilliseconds(parseFloat(getComputedStyle($element[0])['transitionDuration']));
      },
      isInteger: function isInteger(number) {
        return number % 1 === 0;
      }
    };
  }();

  module.exports = window.utils;
})();

},{}]},{},[3]);
