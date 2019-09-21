(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = function () {
  var settings;
  return {
    settings: {},
    init: function init() {
      var self = this;
      var svg = d3.select('svg');
      var svgWidth = +svg.attr('width');
      var svgHeight = +svg.attr('height'); // Define a padding object
      // This will space out the trellis subplots

      var padding = {
        t: 20,
        r: 20,
        b: 60,
        l: 60
      }; // Compute the dimensions of the trellis plots, assuming a 2x2 layout matrix.

      var trellisWidth = svgWidth / 2 - padding.l - padding.r;
      var trellisHeight = svgHeight / 2 - padding.t - padding.b; // As an example for how to layout elements with our variables
      // Lets create .background rects for the trellis plots

      svg.selectAll('.background').data(new Array(4)) // empty array for looping
      .enter().append('rect') // Append 4 rectangles
      .attr('class', 'background').attr('width', trellisWidth) // Use our trellis dimensions
      .attr('height', trellisHeight).attr('transform', function (d, i) {
        // Position based on the matrix array indices.
        // i = 1 for column 1, row 0)
        var tx = i % 2 * (trellisWidth + padding.l + padding.r) + padding.l;
        var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
        return 'translate(' + [tx, ty] + ')';
      });
      var parseDate = d3.timeParse('%b %Y'); // To speed things up, we have already computed the domains for your scales

      var dateDomain = [new Date(2000, 0), new Date(2010, 2)];
      var priceDomain = [0, 223.02];
      d3.csv('../activities/stock_prices.csv').then(function (dataset) {
        dataset.forEach(function (price) {
          price.date = parseDate(price.date);
        });
        var nested = d3.nest().key(function (c) {
          return c.company;
        }).entries(dataset);
        var trellisG = svg.selectAll('.trellis').data(nested).enter().append('g').attr('class', 'trellis').attr('transform', function (d, i) {
          var tx = i % 2 * (trellisWidth + padding.l + padding.r) + padding.l;
          var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
          return 'translate(' + [tx, ty] + ')';
        });
        var xScale = d3.scaleTime().domain(dateDomain).range([0, trellisWidth]);
        var yScale = d3.scaleLinear().domain(priceDomain).range([trellisHeight, 0]);
        var linearInterpolation = d3.line().x(function (d) {
          return xScale(d.date);
        }).y(function (d) {
          return yScale(d.price);
        });
        var companyNames = nested.map(function (d) {
          return d.key;
        });
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(companyNames);
        trellisG.selectAll('.line-plot').data(function (d) {
          return [d.values];
        }).enter().append('path').attr('class', 'line-plot').attr('d', linearInterpolation).style('stroke', function (d) {
          return colorScale(d[0].company);
        });
        var xAxis = d3.axisBottom(xScale);
        trellisG.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + trellisHeight + ')').call(xAxis);
        var yAxis = d3.axisLeft(yScale);
        trellisG.append('g').attr('class', 'y axis').attr('transform', 'translate(0,0)').call(yAxis);
        trellisG.append('text').attr('class', 'company-label').attr('transform', 'translate(' + [trellisWidth / 2, trellisHeight / 2] + ')').attr('fill', function (d) {
          return colorScale(d.key);
        }).text(function (d) {
          return d.key;
        });
        trellisG.append('text').attr('class', 'x axis-label').attr('transform', 'translate(' + [trellisWidth / 2, trellisHeight + 34] + ')').text('Date (by Month)');
        trellisG.append('text').attr('class', 'y axis-label').attr('transform', 'translate(' + [-30, trellisHeight / 3] + ') rotate(270)').text('Stock Price (USD)');
        var xGrid = d3.axisTop(xScale).tickSize(-trellisHeight, 0, 0).tickFormat('');
        trellisG.append('g').attr('class', 'x grid').attr('style', 'opacity: .15;').call(xGrid);
        var yGrid = d3.axisLeft(yScale).tickSize(-trellisWidth, 0, 0).tickFormat('');
        trellisG.append('g').attr('class', 'y grid').attr('style', 'opacity: .15;').call(yGrid);
      }); //d3.csv('../activities/stock_prices.csv').then(function(dataset) {
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
  };
};

},{}],2:[function(require,module,exports){
"use strict";

module.exports = function () {
  var settings;
  return {
    settings: {},
    init: function init() {
      var stockData = [{
        key: 'TECHNOLOGY',
        pos: [200, 105],
        value: {
          total: 397.08,
          companies: [{
            company: "MSFT",
            price: 77.74,
            pos: [-60, 0],
            color: '#85b623'
          }, {
            company: "IBM",
            price: 159.48,
            pos: [12, -48],
            color: '#236cb0'
          }, {
            company: "AAPL",
            price: 159.86,
            pos: [15, 45],
            color: '#666666'
          }]
        }
      }, {
        key: 'FOOD & DRINK',
        pos: [85, 290],
        value: {
          total: 266.78,
          companies: [{
            company: "KO",
            price: 46.47,
            pos: [50, 0],
            color: '#e32232'
          }, {
            company: "MCD",
            price: 165.07,
            pos: [-18, -20],
            color: '#fed430'
          }, {
            company: "SBUX",
            price: 55.24,
            pos: [20, 45],
            color: '#0e7042'
          }]
        }
      }, {
        key: 'AIRLINES',
        pos: [320, 290],
        value: {
          total: 183.51,
          companies: [{
            company: "DAL",
            price: 52.88,
            pos: [0, -35],
            color: '#980732'
          }, {
            company: "AAL",
            price: 51.95,
            pos: [35, 10],
            color: '#1f98ce'
          }, {
            company: "JBLU",
            price: 20.08,
            pos: [7, 45],
            color: '#101e40'
          }, {
            company: "LUV",
            price: 58.60,
            pos: [-35, 15],
            color: '#d81f2a'
          }]
        }
      }]; // var stockData = [
      //     {company: "MSFT", price: 77.74, sector: "Technology", color: '#85b623'},
      //     {company: "IBM", price: 159.48, sector: "Technology", color: '#236cb0'},
      //     {company: "AAPL", price: 159.86, sector: "Technology", color: '#666666'},
      //     {company: "KO", price: 46.47, sector: "Food & Drink", color: '#e32232'},
      //     {company: "MCD", price: 165.07, sector: "Food & Drink", color: '#fed430'},
      //     {company: "SBUX", price: 55.24, sector: "Food & Drink", color: '#0e7042'},
      //     {company: "DAL", price: 52.88, sector: "Airlines", color: '#980732'},
      //     {company: "AAL", price: 51.95, sector: "Airlines", color: '#1f98ce'},
      //     {company: "JBLU", price: 20.08, sector: "Airlines", color: '#101e40'},
      //     {company: "LUV", price: 58.60, sector: "Airlines", color: '#d81f2a'}
      // ];

      var nested = d3.nest().key(function (c) {
        return c.sector;
      }).rollup(function (leaves) {
        var totalPrice = d3.sum(leaves, function (c) {
          return c.price;
        });
        return {
          total: totalPrice,
          companies: leaves
        };
      }).entries(stockData);
      var rSectorScale = d3.scaleSqrt().domain([0, 397.08]).range([0, 100]);
      var rScale = d3.scaleSqrt().domain([0, 165.07]).range([0, 45]);
      var svg = d3.select('svg');
      var sectorG = svg.selectAll('.sector').data(stockData).enter().append('g').attr('class', 'sector').attr('transform', function (d) {
        return 'translate(' + d.pos + ')';
      }).style('fill', '#ccc');
      sectorG.append('circle').attr('r', function (d) {
        return rSectorScale(d.value.total);
      }).style('fill', '#ccc');
      sectorG.append('text').text(function (d) {
        return d.key;
      }).attr('y', function (d) {
        return rSectorScale(d.value.total) + 16;
      }).attr('dy', '0.3em').style('text-anchor', 'middle').style('fill', '#aaa').style('font-size', 14).style('font-family', 'Open Sans');
      var companyG = sectorG.selectAll('.company').data(function (d) {
        return d.value.companies;
      }).enter().append('g').attr('class', 'company').attr('transform', function (d) {
        return 'translate(' + d.pos + ')';
      });
      companyG.append('circle').attr('r', function (d) {
        return rScale(d.price);
      }).style('fill', function (d) {
        return d.color;
      });
      companyG.append('text').text(function (d) {
        return d.company;
      }).attr('dy', '0.3em').style('text-anchor', 'middle').style('fill', '#fff').style('font-size', 12).style('font-family', 'Open Sans');
    }
  };
};

},{}],3:[function(require,module,exports){
"use strict";

var Tutorials = require('./components/tutorials.js');

var Nesting = require('./components/nesting.js');

var Utilities = require('./utils.js');

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.activity')) Nesting().init();
    if (document.querySelector('.tutorial')) Tutorials().init();
  });
})();

},{"./components/nesting.js":1,"./components/tutorials.js":2,"./utils.js":4}],4:[function(require,module,exports){
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
