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
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./styles.css");

var playerTurn = 1;
var boardWidth = 5;
var boardHeight = 5;
var expansionThreshold = 3;
var playing = true;
var progressLoopId;
var EMPTYCHAR = "";
var INFINITEBOARD = true;
var LOOPDELAY = 50; // 0.05s

var TIMER = 10000; // 10s

var USETIMER = false;

var main = function main() {
  init();
  var board = document.getElementById("board");
  board.append(createTable(boardWidth, boardHeight));
};

var init = function init() {
  playerTurn = 1;
  boardWidth = 5;
  boardHeight = 5;
  expansionThreshold = 3;
  playing = true;
  var board = document.getElementById("board");

  while (board.hasChildNodes()) {
    board.firstChild.remove();
  }

  if (progressLoopId != null) {
    clearInterval(progressLoopId);
  }

  progressLoopId = startProgressBar(LOOPDELAY);
};

var startProgressBar = function startProgressBar(delay) {
  if (!USETIMER) {
    return;
  }

  var elem = document.getElementById("progressbar-bar");
  var progress = 0;
  var id = setInterval(function () {
    if (progress >= TIMER) {
      turn();
    } else {
      progress += delay;
      elem.style.width = progress / TIMER * 100 + "%";
    }
  }, delay);
  return id;
};

var turn = function turn() {
  clearInterval(progressLoopId);
  checkForWinner(getMark());

  if (playing) {
    if (INFINITEBOARD) {
      checkForExpansion();
    }

    progressLoopId = startProgressBar(LOOPDELAY);

    if (playerTurn === 1) {
      playerTurn = 2;
    } else {
      playerTurn = 1;
    }
  }
};

var getMark = function getMark() {
  return playerTurn === 1 ? "x" : "o";
};

var checkForExpansion = function checkForExpansion() {
  var arr = createArrayFromTable();

  for (var y = 0; y < boardHeight; y++) {
    for (var x = 0; x < boardWidth; x++) {
      if (arr[y][x] !== EMPTYCHAR) {
        if (x - expansionThreshold < 0) {
          expandHorizontal(x - expansionThreshold);
          arr = createArrayFromTable();
          x = y = 0;
        } else if (x + expansionThreshold > boardWidth - 1) {
          expandHorizontal(x + expansionThreshold - boardWidth + 1);
          arr = createArrayFromTable();
          x = y = 0;
        } else if (y - expansionThreshold < 0) {
          expandVertical(y - expansionThreshold);
          arr = createArrayFromTable();
          x = y = 0;
        } else if (y + expansionThreshold > boardHeight - 1) {
          expandVertical(y + expansionThreshold - boardHeight + 1);
          arr = createArrayFromTable();
          x = y = 0;
        }
      }
    }
  }
};

var expandVertical = function expandVertical(amount) {
  var board = document.getElementById("board");
  var table = board.querySelector("table");

  for (var i = 0; i < Math.abs(amount); i++) {
    var row = document.createElement("tr");

    var _loop = function _loop(j) {
      var cell = document.createElement("td");
      var text = document.createTextNode(EMPTYCHAR);
      cell.append(text);

      cell.onclick = function () {
        handleCellClick(cell);
      };

      row.append(cell);
    };

    for (var j = 0; j < boardWidth; j++) {
      _loop(j);
    }

    if (amount > 0) {
      table.append(row);
    } else {
      table.prepend(row);
    }
  }

  boardHeight += Math.abs(amount);
};

var expandHorizontal = function expandHorizontal(amount) {
  var board = document.getElementById("board");
  var rows = board.querySelectorAll("tr");

  for (var row = 0; row < rows.length; row++) {
    var _loop2 = function _loop2(i) {
      var cell = document.createElement("td");
      var text = document.createTextNode(EMPTYCHAR);
      cell.append(text);

      cell.onclick = function () {
        handleCellClick(cell);
      };

      if (amount > 0) {
        rows[row].append(cell);
      } else {
        rows[row].prepend(cell);
      }
    };

    for (var i = 0; i < Math.abs(amount); i++) {
      _loop2(i);
    }
  }

  boardWidth += Math.abs(amount);
};

var createArrayFromTable = function createArrayFromTable() {
  var board = document.getElementById("board");
  var cells = board.querySelectorAll("td"); // Create array from table

  var arr = [];

  for (var y = 0; y < boardHeight; y++) {
    arr[y] = [];

    for (var x = 0; x < boardWidth; x++) {
      arr[y][x] = cells[x + boardWidth * y].innerHTML;
    }
  }

  return arr;
};

var checkForWinner = function checkForWinner(mark) {
  var arr = createArrayFromTable(); // Check for the winner

  for (var y = 0; y < boardHeight; y++) {
    for (var x = 0; x < boardWidth; x++) {
      if (mark !== arr[y][x]) {
        continue;
      } // Check horizontal


      if (x - 2 >= 0 && x + 2 < boardWidth) {
        if (mark === arr[y][x - 2] && mark === arr[y][x - 1] && mark === arr[y][x + 1] && mark === arr[y][x + 2]) {
          gameover();
        }
      } // Check vertical


      if (y - 2 >= 0 && y + 2 < boardHeight) {
        if (mark === arr[y - 2][x] && mark === arr[y - 1][x] && mark === arr[y + 1][x] && mark === arr[y + 2][x]) {
          gameover();
        }
      } // Angles


      if (x - 2 >= 0 && x + 2 < boardWidth && y - 2 >= 0 && y + 2 < boardHeight) {
        // Check bottom-left to top-right
        if (mark === arr[y - 2][x + 2] && mark === arr[y - 1][x + 1] && mark === arr[y + 1][x - 1] && mark === arr[y + 2][x - 2]) {
          gameover();
        } // Check bottom-right to top-left


        if (mark === arr[y - 2][x - 2] && mark === arr[y - 1][x - 1] && mark === arr[y + 1][x + 1] && mark === arr[y + 2][x + 2]) {
          gameover();
        }
      }
    }
  }
};

var gameover = function gameover() {
  alert("Player " + playerTurn + " won!");
  playing = false;
};

var createTable = function createTable(width, height) {
  var table = document.createElement("table");

  for (var y = 0; y < height; y++) {
    var row = document.createElement("tr");
    table.append(row);

    var _loop3 = function _loop3(x) {
      var cell = document.createElement("td");
      var text = document.createTextNode(EMPTYCHAR);
      cell.append(text);

      cell.onclick = function () {
        handleCellClick(cell);
      };

      row.append(cell);
    };

    for (var x = 0; x < width; x++) {
      _loop3(x);
    }
  }

  return table;
};

var handleCellClick = function handleCellClick(elem) {
  // Legal move
  if (elem.innerHTML === EMPTYCHAR && playing) {
    elem.innerHTML = getMark();
    elem.classList.add(getMark());
    turn();
  } // Illegal move
  else {
      console.log("Can't do that");
    }
};

var _default = main;
exports.default = _default;
},{"./styles.css":"src/styles.css"}],"src/main.js":[function(require,module,exports) {
"use strict";

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.default)();
},{"./index":"src/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56146" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/main.js"], null)
//# sourceMappingURL=/main.1e43358e.js.map