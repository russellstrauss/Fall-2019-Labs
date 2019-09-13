(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = function () {
  var settings;
  return {
    settings: {},
    init: function init() {
      d3.csv('../../activity_1_and_activity_2/exoplanets.csv').then(function (dataset) {
        var circle = d3.select('body svg').selectAll('circle').data(dataset).enter().append('circle');
        circle.attr('class', 'planet'); // Set axes scales

        var svg = d3.select('svg');
        var xOffset = 200;
        var yOffset = 100;
        var width = window.innerWidth - xOffset;
        var height = window.innerHeight - yOffset;
        var maxRadius = 20;
        var hzdExtent = d3.extent(dataset, function (d) {
          return +d['habital_zone_distance'];
        });
        var mass = d3.extent(dataset, function (d) {
          return +d['mass'];
        });
        var planetRadius = d3.extent(dataset, function (d) {
          return +d['radius'];
        });
        var xScale = d3.scaleLinear().domain(hzdExtent).range([100, width]);
        var yScale = d3.scaleLog().domain(mass).range([100, height]);
        var radiusScale = d3.scaleSqrt().domain(planetRadius).range([0, maxRadius]);
        var colorScale = d3.scaleQuantize().domain(hzdExtent).range(['#FF3300', '#29AD37', '#27EFFF']); // Set circle size

        circle.attr('cx', function (d) {
          return xScale(d.habital_zone_distance);
        });
        circle.attr('cy', function (d) {
          return yScale(d.mass);
        });
        circle.attr('r', function (d) {
          return radiusScale(d.radius);
        });
        circle.attr('fill', function (d) {
          return colorScale(d.habital_zone_distance);
        }); // Add habitable zone x-axis

        svg.append('g').attr('class', 'x-axis').attr('transform', 'translate(0, ' + (height + maxRadius) + ')').call(d3.axisBottom(xScale).tickFormat(function (d) {
          return d;
        }));
        svg.append('g').attr('class', 'x-axis').attr('transform', 'translate(0, ' + (yOffset - maxRadius).toString() + ')').call(d3.axisBottom(xScale).tickFormat(function (d) {
          return d;
        })); // Add mass y-axis

        svg.append('g').attr('class', 'y-axis').attr('transform', 'translate(90, 0)').call(d3.axisLeft(yScale));
        svg.append('g').attr('class', 'y-axis').attr('transform', 'translate(' + (width + maxRadius).toString() + ', 0)').call(d3.axisLeft(yScale)); // Label x-axis

        svg.append('text').attr('class', 'label').attr('transform', 'translate(' + (width / 2 - 200).toString() + ',' + (height + 75).toString() + ')').text('Exoplanet Distance from Nearest Habitable Zone'); // // Label y-axis

        svg.append('text').attr('class', 'label').attr('transform', 'translate(35,' + (height / 2 + 100).toString() + ') rotate(-90)').text('Exoplanet Mass'); // // Add graph title

        svg.append('text').attr('class', 'title').attr('transform', 'translate(' + (width / 2 - 100).toString() + ', 50)').text('Exoplanet Mass Vs. Habitability');
      });
    }
  };
};

},{}],2:[function(require,module,exports){
"use strict";

var ExoPlanets = require('./components/exoplanets.js');

var Utilities = require('./utils.js');

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    ExoPlanets().init();
  });
})();

},{"./components/exoplanets.js":1,"./utils.js":3}],3:[function(require,module,exports){
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

},{}]},{},[2]);
