// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"ZBcX":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/greenhouse-gas-emissions-across-the-globe/CO2_GDPdata.9ce3547b.csv";
},{}],"yubi":[function(require,module,exports) {
"use strict";

var _CO2_GDPdata = _interopRequireDefault(require("../static/CO2_GDPdata.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import dataset
"use strict"; // the code should be executed in "strict mode".
// With strict mode, you can not, for example, use undeclared variables


var datapoints = []; // used to store data later

var filtered = [];
var SortedGDP2 = []; //var sortedGDP = CO2_GDPdata
//.filter(d => d['Country'] == 'High income' || d['Country'] == 'Low income' || d['Country'] == 'Upper middle income' || d['Country'] == 'Lower middle income')
//console.log(CO2_GDPdata)

var options = {
  config: {// Vega-Lite default configuration
  },
  init: function init(view) {
    // initialize tooltip handler
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    // view constructor options
    // remove the loader if you don't want to default to vega-datasets!
    //   loader: vega.loader({
    //     baseURL: "",
    //   }),
    renderer: "canvas"
  }
};
vl.register(vega, vegaLite, options); // Again, We use d3.csv() to process data

d3.csv(_CO2_GDPdata.default).then(function (data) {
  data.forEach(function (d) {
    datapoints.push(d);

    if (d.Country == 'High income' || d.Country == 'Low income' || d.Country == 'Lower middle income' || d.Country == 'Upper middle income') {
      filtered.push(d);
    }
  });
  SortedGDP2 = filtered.map(function (d) {
    return {
      Country: d.Country,
      Year: +d.Year,
      CO2: +d.CO2,
      GDP: +d.GDP
    };
  });
  drawPlotVegaLite();
});

function drawPlotVegaLite() {
  var selection = vl.selectSingle('Sorted Income').fields('Country', 'Year').init({
    Country: 'Low income',
    Year: '1960'
  }).bind({
    Country: vl.menu(['Low income', 'High income', 'Upper middle income', 'Lower middle income']),
    Year: vl.slider(1960, 2016, 1)
  }); // Nothing changed below

  return vl.markPoint({
    filled: true
  }).data(SortedGDP2).select(selection).encode(vl.color().if(selection, vl.value('green')).value("gray"), vl.x().fieldQ('GDP'), vl.y().fieldQ('CO2'), vl.opacity().if(selection).value(0.1), vl.tooltip().fieldQ('Year'), vl.size().value(100)).width(450).height(450).render().then(function (viewElement) {
    document.getElementById('view').appendChild(viewElement);
  });
}
},{"../static/CO2_GDPdata.csv":"ZBcX"}]},{},["yubi"], null)
//# sourceMappingURL=https://cse412-21w.github.io/greenhouse-gas-emissions-across-the-globe/vegaliteViz.a024e9f8.js.map