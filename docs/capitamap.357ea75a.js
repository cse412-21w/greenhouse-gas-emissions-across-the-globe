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
})({"capitamap.json":[function(require,module,exports) {
module.exports = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A world map showing the C02 emissions per capita of each country.",
  "width": 900,
  "padding": 5,
  "data": [{
    "name": "env",
    "url": "data/climate-change3.csv",
    "format": {
      "type": "csv",
      "parse": "auto"
    },
    "transform": [{
      "type": "filter",
      "expr": "datum.Year == Year"
    }]
  }, {
    "name": "world",
    "url": "data/world-110m.json",
    "format": {
      "type": "topojson",
      "feature": "countries"
    },
    "transform": [{
      "type": "lookup",
      "from": "env",
      "key": "id",
      "fields": ["id"],
      "values": ["Year", "Country", "Population", "CO2PerCapita", "CO2Total", "CO2PerGDP", "Rank"]
    }, {
      "type": "filter",
      "expr": "datum.Year == Year"
    }, {
      "type": "filter",
      "expr": "datum.CO2PerCapita != null"
    }, {
      "type": "window",
      "sort": {
        "field": "CO2PerCapita",
        "order": "descending"
      },
      "ops": ["row_number"],
      "as": ["Rank"]
    }]
  }, {
    "name": "graticule",
    "transform": [{
      "type": "graticule",
      "step": [15, 15]
    }]
  }],
  "projections": [{
    "name": "projection",
    "type": "mercator",
    "scale": {
      "signal": "scale"
    },
    "rotate": [{
      "signal": "rotateX"
    }, 0, 0],
    "center": [0, {
      "signal": "centerY"
    }],
    "translate": [{
      "signal": "tx"
    }, {
      "signal": "ty"
    }]
  }],
  "scales": [{
    "name": "color",
    "type": "linear",
    "domain": [0, 16],
    "range": {
      "scheme": "blues",
      "count": 50
    }
  }],
  "legends": [{
    "fill": "color",
    "orient": "none",
    "title": "CO2 Emissions Per Capita",
    "format": "1",
    "legendX": 1000,
    "legendY": -150
  }],
  "marks": [{
    "type": "shape",
    "from": {
      "data": "world"
    },
    "encode": {
      "enter": {
        "tooltip": {
          "signal": "datum"
        }
      },
      "update": {
        "fill": {
          "scale": "color",
          "field": "CO2PerCapita"
        },
        "strokeWidth": {
          "signal": "0.5"
        },
        "stroke": {
          "value": "#000"
        },
        "zindex": {
          "value": 0
        }
      },
      "hover": {
        "strokeWidth": {
          "signal": "1.5"
        },
        "stroke": {
          "value": "firebrick"
        },
        "zindex": {
          "value": 1
        }
      }
    },
    "transform": [{
      "type": "geoshape",
      "projection": "projection"
    }]
  }],
  "signals": [{
    "name": "k",
    "value": 10
  }, {
    "name": "tx",
    "update": "width / 2"
  }, {
    "name": "ty",
    "update": "height / 2"
  }, {
    "name": "Year",
    "value": 1992,
    "bind": {
      "input": "range",
      "min": 1992,
      "max": 2014,
      "step": 1
    }
  }, {
    "name": "scale",
    "value": 150,
    "on": [{
      "events": {
        "type": "wheel",
        "consume": true
      },
      "update": "clamp(scale * pow(1.0005, -event.deltaY * pow(16, event.deltaMode)), 150, 3000)"
    }]
  }, {
    "name": "angles",
    "value": [0, 0],
    "on": [{
      "events": "mousedown",
      "update": "[rotateX, centerY]"
    }]
  }, {
    "name": "cloned",
    "value": null,
    "on": [{
      "events": "mousedown",
      "update": "copy('projection')"
    }]
  }, {
    "name": "start",
    "value": null,
    "on": [{
      "events": "mousedown",
      "update": "invert(cloned, xy())"
    }]
  }, {
    "name": "drag",
    "value": null,
    "on": [{
      "events": "[mousedown, window:mouseup] > window:mousemove",
      "update": "invert(cloned, xy())"
    }]
  }, {
    "name": "delta",
    "value": null,
    "on": [{
      "events": {
        "signal": "drag"
      },
      "update": "[drag[0] - start[0], start[1] - drag[1]]"
    }]
  }, {
    "name": "rotateX",
    "value": 0,
    "on": [{
      "events": {
        "signal": "delta"
      },
      "update": "angles[0] + delta[0]"
    }]
  }, {
    "name": "centerY",
    "value": 0,
    "on": [{
      "events": {
        "signal": "delta"
      },
      "update": "clamp(angles[1] + delta[1], -60, 60)"
    }]
  }]
};
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51999" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","capitamap.json"], null)
//# sourceMappingURL=/capitamap.357ea75a.js.map