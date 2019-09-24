(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = function () {
  var settings;
  var letters;
  var frequencyScale;
  var svg;
  var chartWidth;
  var chartHeight;
  var barHeight;
  var barBand;
  var padding = {
    t: 40,
    r: 40,
    b: 30,
    l: 40
  };
  return {
    settings: {},
    init: function init() {
      var self = this;
      svg = d3.select('svg'); // Get layout parameters

      var svgWidth = +svg.attr('width');
      var svgHeight = +svg.attr('height'); // Compute chart dimensions

      chartWidth = svgWidth - padding.l - padding.r;
      chartHeight = svgHeight - padding.t - padding.b; // Compute the spacing for bar bands based on all 26 letters

      barBand = chartHeight / 26;
      barHeight = barBand * 0.98; // Create a group element for appending chart elements

      var chartG = svg.append('g').attr('transform', 'translate(' + [padding.l, padding.t] + ')');
      d3.csv('../../activities/letter_freq.csv', self.dataPreprocessor).then(function (dataset) {
        letters = dataset;
        self.updateChart('all-letters');
      });
      document.getElementById('categorySelect').addEventListener('change', function () {
        var select = d3.select('#categorySelect').node();
        var category = select.options[select.selectedIndex].value;
        self.updateChart(category);
      });
    },
    updateChart: function updateChart(filterKey) {
      var lettersMap = {
        'all-letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        'only-consonants': 'BCDFGHJKLMNPQRSTVWXZ'.split(''),
        'only-vowels': 'AEIOUY'.split('')
      };
      var filteredLetters = letters.filter(function (d) {
        return lettersMap[filterKey].indexOf(d.letter) >= 0;
      });
      frequencyScale = d3.scaleLinear().domain([0, 75]).range([0, chartWidth]);
      svg.append('g').attr('class', 'x-axis').attr('transform', 'translate(' + padding.l + ',' + padding.t + ')').call(d3.axisBottom(frequencyScale).tickFormat(function (d) {
        return d;
      }));
      svg.append('g').attr('class', 'x-axis').attr('transform', 'translate(' + padding.l + ',' + (chartHeight + padding.t).toString() + ')').call(d3.axisBottom(frequencyScale).tickFormat(function (d) {
        return d;
      }));
      svg.append('text').attr('class', 'label').attr('transform', 'translate(' + (chartWidth / 2 - 40).toString() + ', 30)').text('Letter Frequency (%)');
      filteredLetters.forEach(function (letter, i) {
        svg.append('text').attr('class', 'letter-row').attr('transform', 'translate(' + (padding.l - 20).toString() + ', ' + (barHeight * (i + 1) + padding.t).toString() + ')').text(letter.letter);
      });
      var yScale = d3.scaleBand().domain(filteredLetters).rangeRound([padding.t, chartHeight]);
      var wScale = d3.scaleLinear().domain([0, 75]).range([0, chartWidth]);
      svg.selectAll('rect').data(filteredLetters).enter().append('rect').attr('y', function (d, i) {
        return yScale(i);
      }).attr('x', padding.l.toString()).attr('height', yScale).attr('width', function (d) {
        return wScale(d.frequency * 100);
      }).style('fill', '#5f3e36'); //svg.append('g').attr('class', 'y-axis').attr('transform', 'translate(55,0)').call(d3.axisLeft(hrScale));
    },
    // recall that when data is loaded into memory, numbers are loaded as strings
    // this function helps convert numbers into string during data preprocessing
    dataPreprocessor: function dataPreprocessor(row) {
      return {
        letter: row.letter,
        frequency: +row.frequency
      };
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
      this.updateCircles(['A', 'B', 'C']);
      this.updateCircles(['A', 'B']);
      this.updateCircles(['A', 'B', 'C', 'D', 'E', 'F']);
    },
    updateCircles: function updateCircles(letters) {
      var letter = d3.select('svg').selectAll('.letter').data(letters);
      var letterEnter = letter.enter().append('g').attr('class', 'letter');
      letterEnter.merge(letter).attr('transform', function (d, i) {
        return 'translate(' + [i * 60 + 50, 50] + ')';
      });
      letterEnter.append('circle').attr('r', 20);
      letterEnter.append('text').attr('y', 30).text(function (d) {
        return d;
      });
      letter.exit().remove();
    }
  };
};

},{}],3:[function(require,module,exports){
"use strict";

var Tutorials = require('./components/tutorials.js');

var Activity = require('./components/activity.js');

var Utilities = require('./utils.js');

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.activity')) Activity().init();
    if (document.querySelector('.tutorial')) Tutorials().init();
  });
})();

"";

},{"./components/activity.js":1,"./components/tutorials.js":2,"./utils.js":4}],4:[function(require,module,exports){
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