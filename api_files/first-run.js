/* eslint-disable */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// node_modules/preact-router/dist/preact-router.js
var require_preact_router = __commonJS((exports2, module2) => {
  !function(t, e) {
    typeof exports2 == "object" && typeof module2 != "undefined" ? module2.exports = e(require("preact")) : typeof define == "function" && define.amd ? define(["preact"], e) : t.preactRouter = e(t.preact);
  }(exports2, function(t) {
    function e(t2, e2) {
      for (var n2 in e2)
        t2[n2] = e2[n2];
      return t2;
    }
    function n(t2, e2, n2) {
      var r2, o2 = /(?:\?([^#]*))?(#.*)?$/, u2 = t2.match(o2), a2 = {};
      if (u2 && u2[1])
        for (var p2 = u2[1].split("&"), c2 = 0; c2 < p2.length; c2++) {
          var f2 = p2[c2].split("=");
          a2[decodeURIComponent(f2[0])] = decodeURIComponent(f2.slice(1).join("="));
        }
      t2 = i(t2.replace(o2, "")), e2 = i(e2 || "");
      for (var l2 = Math.max(t2.length, e2.length), s2 = 0; s2 < l2; s2++)
        if (e2[s2] && e2[s2].charAt(0) === ":") {
          var h4 = e2[s2].replace(/(^:|[+*?]+$)/g, ""), d2 = (e2[s2].match(/[+*?]+$/) || C)[0] || "", g2 = ~d2.indexOf("+"), y2 = ~d2.indexOf("*"), m2 = t2[s2] || "";
          if (!m2 && !y2 && (d2.indexOf("?") < 0 || g2)) {
            r2 = false;
            break;
          }
          if (a2[h4] = decodeURIComponent(m2), g2 || y2) {
            a2[h4] = t2.slice(s2).map(decodeURIComponent).join("/");
            break;
          }
        } else if (e2[s2] !== t2[s2]) {
          r2 = false;
          break;
        }
      return (n2.default === true || r2 !== false) && a2;
    }
    function r(t2, e2) {
      return t2.rank < e2.rank ? 1 : t2.rank > e2.rank ? -1 : t2.index - e2.index;
    }
    function o(t2, e2) {
      return t2.index = e2, t2.rank = p(t2), t2.props;
    }
    function i(t2) {
      return t2.replace(/(^\/+|\/+$)/g, "").split("/");
    }
    function u(t2) {
      return t2.charAt(0) == ":" ? 1 + "*+?".indexOf(t2.charAt(t2.length - 1)) || 4 : 5;
    }
    function a(t2) {
      return i(t2).map(u).join("");
    }
    function p(t2) {
      return t2.props.default ? 0 : a(t2.props.path);
    }
    function c(t2, e2) {
      e2 === void 0 && (e2 = "push"), b && b[e2] ? b[e2](t2) : typeof history != "undefined" && history[e2 + "State"] && history[e2 + "State"](null, null, t2);
    }
    function f() {
      var t2;
      return t2 = b && b.location ? b.location : b && b.getCurrentLocation ? b.getCurrentLocation() : typeof location != "undefined" ? location : x, "" + (t2.pathname || "") + (t2.search || "");
    }
    function l(t2, e2) {
      return e2 === void 0 && (e2 = false), typeof t2 != "string" && t2.url && (e2 = t2.replace, t2 = t2.url), s(t2) && c(t2, e2 ? "replace" : "push"), h3(t2);
    }
    function s(t2) {
      for (var e2 = U.length; e2--; )
        if (U[e2].canRoute(t2))
          return true;
      return false;
    }
    function h3(t2) {
      for (var e2 = false, n2 = 0; n2 < U.length; n2++)
        U[n2].routeTo(t2) === true && (e2 = true);
      for (var r2 = k.length; r2--; )
        k[r2](t2);
      return e2;
    }
    function d(t2) {
      if (t2 && t2.getAttribute) {
        var e2 = t2.getAttribute("href"), n2 = t2.getAttribute("target");
        if (e2 && e2.match(/^\//g) && (!n2 || n2.match(/^_?self$/i)))
          return l(e2);
      }
    }
    function g(t2) {
      if (!(t2.ctrlKey || t2.metaKey || t2.altKey || t2.shiftKey || t2.button !== 0))
        return d(t2.currentTarget || t2.target || this), y(t2);
    }
    function y(t2) {
      return t2 && (t2.stopImmediatePropagation && t2.stopImmediatePropagation(), t2.stopPropagation && t2.stopPropagation(), t2.preventDefault()), false;
    }
    function m(t2) {
      if (!(t2.ctrlKey || t2.metaKey || t2.altKey || t2.shiftKey || t2.button !== 0)) {
        var e2 = t2.target;
        do {
          if ((e2.nodeName + "").toUpperCase() === "A" && e2.getAttribute("href")) {
            if (e2.hasAttribute("native"))
              return;
            if (d(e2))
              return y(t2);
          }
        } while (e2 = e2.parentNode);
      }
    }
    function v() {
      A || (typeof addEventListener == "function" && (b || addEventListener("popstate", function() {
        h3(f());
      }), addEventListener("click", m)), A = true);
    }
    var C = {}, b = null, U = [], k = [], x = {}, A = false, R = function(i2) {
      function u2(t2) {
        i2.call(this, t2), t2.history && (b = t2.history), this.state = {url: t2.url || f()}, v();
      }
      return i2 && (u2.__proto__ = i2), u2.prototype = Object.create(i2 && i2.prototype), u2.prototype.constructor = u2, u2.prototype.shouldComponentUpdate = function(t2) {
        return t2.static !== true || (t2.url !== this.props.url || t2.onChange !== this.props.onChange);
      }, u2.prototype.canRoute = function(e2) {
        return this.getMatchingChildren(t.toChildArray(this.props.children), e2, false).length > 0;
      }, u2.prototype.routeTo = function(t2) {
        this.setState({url: t2});
        var e2 = this.canRoute(t2);
        return this.updating || this.forceUpdate(), e2;
      }, u2.prototype.componentWillMount = function() {
        U.push(this), this.updating = true;
      }, u2.prototype.componentDidMount = function() {
        var t2 = this;
        b && (this.unlisten = b.listen(function(e2) {
          t2.routeTo("" + (e2.pathname || "") + (e2.search || ""));
        })), this.updating = false;
      }, u2.prototype.componentWillUnmount = function() {
        typeof this.unlisten == "function" && this.unlisten(), U.splice(U.indexOf(this), 1);
      }, u2.prototype.componentWillUpdate = function() {
        this.updating = true;
      }, u2.prototype.componentDidUpdate = function() {
        this.updating = false;
      }, u2.prototype.getMatchingChildren = function(i3, u3, a2) {
        return i3.filter(o).sort(r).map(function(r2) {
          var o2 = n(u3, r2.props.path, r2.props);
          if (o2) {
            if (a2 !== false) {
              var i4 = {url: u3, matches: o2};
              return e(i4, o2), delete i4.ref, delete i4.key, t.cloneElement(r2, i4);
            }
            return r2;
          }
        }).filter(Boolean);
      }, u2.prototype.render = function(e2, n2) {
        var r2 = e2.children, o2 = e2.onChange, i3 = n2.url, u3 = this.getMatchingChildren(t.toChildArray(r2), i3, true), a2 = u3[0] || null, p2 = this.previousUrl;
        return i3 !== p2 && (this.previousUrl = i3, typeof o2 == "function" && o2({router: this, url: i3, previous: p2, active: u3, current: a2})), a2;
      }, u2;
    }(t.Component), K = function(n2) {
      return t.createElement("a", e({onClick: g}, n2));
    }, E = function(e2) {
      return t.createElement(e2.component, e2);
    };
    return R.subscribers = k, R.getCurrentUrl = f, R.route = l, R.Router = R, R.Route = E, R.Link = K, R.exec = n, R;
  });
});

// src/components/first-run.jsx
__export(exports, {
  default: () => FirstRun
});
var import_preact2 = __toModule(require("preact"));

// src/components/footer.jsx
var import_preact = __toModule(require("preact"));
var import_preact_router = __toModule(require_preact_router());
function Footer() {
  return /* @__PURE__ */ import_preact.h("p", {
    class: "mt-4 mb-3 text-center text-xs"
  }, /* @__PURE__ */ import_preact.h("b", null, "Der inoffizielle Schichtkalender f\xFCr Bosch Reutlingen."), /* @__PURE__ */ import_preact.h("br", null), "Made by Christopher Astfalk.", /* @__PURE__ */ import_preact.h("br", null), "Dieser Kalender wird ", /* @__PURE__ */ import_preact.h("strong", null, /* @__PURE__ */ import_preact.h("em", null, "nicht")), " von der Robert Bosch GmbH\u2122\uFE0F bereitgestellt. Robert Bosch GmbH\u2122\uFE0F haftet nicht f\xFCr den Inhalt dieser Seite.", /* @__PURE__ */ import_preact.h("br", null), "Alle Angaben sind ohne Gew\xE4hr.", /* @__PURE__ */ import_preact.h("br", null), "Alle Daten werden nur lokal gespeichert! Und nicht an einen Server \xFCbertragen. Deswegen gibt es keine Cookie Meldung.", /* @__PURE__ */ import_preact.h("br", null), "Lizenz: ", /* @__PURE__ */ import_preact.h("a", {
    href: "https://www.mozilla.org/en-US/MPL/2.0/",
    class: "inline-block text-blue-700 underline",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Mozilla Public License 2.0"), /* @__PURE__ */ import_preact.h("br", null), /* @__PURE__ */ import_preact.h(import_preact_router.Link, {
    class: "inline-block text-blue-700 underline",
    href: "/impressum",
    tabIndex: "0",
    onClick: () => {
      window.scrollTo(0, 0);
    }
  }, "Impressum"));
}

// src/lib/constants.js
var shift66Name = "6-6";
var shift64Name = "6-4";
var shiftWfW = "wfw";
var shiftAddedNight = "added-night";
var shiftAddedNight8 = "added-night-8";
var shiftModelNames = [
  shift66Name,
  shift64Name,
  shiftWfW,
  shiftAddedNight,
  shiftAddedNight8
];
var shiftModelText = {
  [shift66Name]: "6 - 6 Kontischicht",
  [shift64Name]: "6 - 4 Kontischicht",
  [shiftWfW]: "Werkfeuerwehr",
  [shiftAddedNight]: "aufgesetzte Nachtarbeit",
  [shiftAddedNight8]: "8 Wochen Nachtarbeit"
};
var shiftModelNumberOfGroups = {
  [shift66Name]: 6,
  [shift64Name]: 5,
  [shiftWfW]: 6,
  [shiftAddedNight]: 3,
  [shiftAddedNight8]: 3
};

// src/components/first-run.jsx
function FirstRun({onClick}) {
  return /* @__PURE__ */ import_preact2.h("div", {
    class: "fixed top-0 pt-16 text-center w-screen h-screen bg-gray-100"
  }, /* @__PURE__ */ import_preact2.h("h2", null, "Willkommen zum inoffiziellen Schichtkalender f\xFCr Bosch Reutlingen!"), /* @__PURE__ */ import_preact2.h("p", null, "Welches Schichtmodell interessiert sie?", /* @__PURE__ */ import_preact2.h("br", null), "Sie k\xF6nnen das Modell sp\xE4ter jederzeit im Men\xFC", /* @__PURE__ */ import_preact2.h("img", {
    class: "inline-block ml-1 mr-2",
    src: "/assets/icons/hamburger_icon.svg",
    height: "20",
    width: "20",
    alt: "das Men\xFC ist oben rechts"
  }), "um\xE4ndern."), /* @__PURE__ */ import_preact2.h("ul", {
    class: "list-none flex flex-col justify-center w-64 mt-2 mb-16 mx-auto p-0"
  }, shiftModelNames.map((name, index) => /* @__PURE__ */ import_preact2.h("li", {
    key: name,
    class: index > 0 ? "mt-3" : ""
  }, /* @__PURE__ */ import_preact2.h("button", {
    class: "inline-block mx-3 py-1 px-4 h-10 w-full border-0 bg-indigo-700 text-white text-center rounded shadow hover:bg-indigo-800 focus:bg-indigo-800 focus:ring focus:outline-none",
    onClick: () => {
      onClick(name);
    }
  }, shiftModelText[name])))), /* @__PURE__ */ import_preact2.h(Footer, null));
}
