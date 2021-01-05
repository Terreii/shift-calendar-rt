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
          var h5 = e2[s2].replace(/(^:|[+*?]+$)/g, ""), d2 = (e2[s2].match(/[+*?]+$/) || C)[0] || "", g2 = ~d2.indexOf("+"), y2 = ~d2.indexOf("*"), m2 = t2[s2] || "";
          if (!m2 && !y2 && (d2.indexOf("?") < 0 || g2)) {
            r2 = false;
            break;
          }
          if (a2[h5] = decodeURIComponent(m2), g2 || y2) {
            a2[h5] = t2.slice(s2).map(decodeURIComponent).join("/");
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
      return e2 === void 0 && (e2 = false), typeof t2 != "string" && t2.url && (e2 = t2.replace, t2 = t2.url), s(t2) && c(t2, e2 ? "replace" : "push"), h4(t2);
    }
    function s(t2) {
      for (var e2 = U.length; e2--; )
        if (U[e2].canRoute(t2))
          return true;
      return false;
    }
    function h4(t2) {
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
        h4(f());
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

// node_modules/querystringify/index.js
var require_querystringify = __commonJS((exports2) => {
  "use strict";
  var has = Object.prototype.hasOwnProperty;
  var undef;
  function decode(input) {
    try {
      return decodeURIComponent(input.replace(/\+/g, " "));
    } catch (e) {
      return null;
    }
  }
  function encode(input) {
    try {
      return encodeURIComponent(input);
    } catch (e) {
      return null;
    }
  }
  function querystring(query) {
    var parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
    while (part = parser.exec(query)) {
      var key = decode(part[1]), value = decode(part[2]);
      if (key === null || value === null || key in result)
        continue;
      result[key] = value;
    }
    return result;
  }
  function querystringify(obj, prefix) {
    prefix = prefix || "";
    var pairs = [], value, key;
    if (typeof prefix !== "string")
      prefix = "?";
    for (key in obj) {
      if (has.call(obj, key)) {
        value = obj[key];
        if (!value && (value === null || value === undef || isNaN(value))) {
          value = "";
        }
        key = encode(key);
        value = encode(value);
        if (key === null || value === null)
          continue;
        pairs.push(key + "=" + value);
      }
    }
    return pairs.length ? prefix + pairs.join("&") : "";
  }
  exports2.stringify = querystringify;
  exports2.parse = querystring;
});

// src/components/header.jsx
__export(exports, {
  default: () => Header
});
var import_preact3 = __toModule(require("preact"));
var import_hooks2 = __toModule(require("preact/hooks"));
var import_preact_router = __toModule(require_preact_router());

// src/components/menu.jsx
var import_preact = __toModule(require("preact"));

// src/lib/constants.js
var monthNames = [
  "Januar",
  "Februar",
  "M\xE4rz",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember"
];
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

// src/lib/utils.js
var isSSR = (() => {
  try {
    const isBrowser = "document" in window && "navigator" in window;
    return !isBrowser;
  } catch (err) {
    return true;
  }
})();
function scrollToADay(year, month, day) {
  const row = document.querySelector(`#month_${year}-${month + 1} tr:nth-child(${day})`);
  if (row != null && row.scrollIntoView != null) {
    row.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

// src/components/menu.jsx
var [supportsMonthInput, supportsDateInput] = ["month", "date"].map((type) => {
  if (isSSR)
    return false;
  const parent = document.createElement("div");
  const input = document.createElement("input");
  input.type = type;
  parent.appendChild(input);
  return parent.firstChild.type === type;
});
function Menu({
  show,
  month,
  year,
  isFullYear,
  search,
  group,
  shiftModel,
  toggleFullYear,
  gotoMonth,
  dispatch,
  onShare
}) {
  let searchValue = "";
  if (search != null) {
    const searchMonth = String(search[1] + 1).padStart(2, "0");
    const searchDay = String(search[2]).padStart(2, "0");
    searchValue = `${search[0]}-${searchMonth}-${searchDay}`;
  }
  const groupOptions = [];
  for (let gr = 1, max = shiftModelNumberOfGroups[shiftModel] || 1; gr <= max; gr += 1) {
    groupOptions.push(/* @__PURE__ */ import_preact.h("option", {
      key: "group_" + gr,
      value: gr
    }, "Nur Gruppe ", gr));
  }
  return /* @__PURE__ */ import_preact.h("div", {
    id: "hamburger_menu",
    "aria-live": "polite",
    "aria-label": "Men\xFC",
    class: (show ? "flex" : "hidden") + " absolute top-0 right-0 mt-12 p-3  flex-col justify-center items-stretch bg-green-900 shadow-lg"
  }, supportsMonthInput || isFullYear ? null : /* @__PURE__ */ import_preact.h("select", {
    class: "form-item",
    title: "Gehe zum Monat",
    value: month,
    onChange: (event) => {
      gotoMonth({type: "goto", month: +event.target.value, fullYear: false}, true);
    },
    "aria-controls": "calendar_main_out"
  }, monthNames.map((name, index) => /* @__PURE__ */ import_preact.h("option", {
    key: name,
    value: index
  }, name))), (!supportsMonthInput || isFullYear) && /* @__PURE__ */ import_preact.h("label", {
    class: "mt-5 flex flex-col items-stretch text-white text-center"
  }, "Jahr", /* @__PURE__ */ import_preact.h("input", {
    class: "flex-auto mt-1 w-full form-item",
    type: "number",
    min: "2000",
    "aria-controls": "calendar_main_out",
    value: year,
    onChange: (event) => {
      const year2 = +event.target.value;
      if (Number.isNaN(year2)) {
        event.target.value = String(event.target.value).replace(/\D/g, "");
        return;
      }
      gotoMonth({type: "goto", year: year2, fullYear: isFullYear}, false);
    }
  })), supportsMonthInput && !isFullYear && /* @__PURE__ */ import_preact.h("label", {
    class: "mt-5 flex flex-col items-stretch text-white text-center"
  }, "Gehe zum Monat", /* @__PURE__ */ import_preact.h("input", {
    class: "flex-auto mt-1 w-full form-item",
    type: "month",
    "aria-controls": "calendar_main_out",
    min: "2000-01",
    value: `${year}-${String(month + 1).padStart(2, "0")}`,
    onChange: (event) => {
      const value = event.target.value;
      if (value == null || value.length === 0) {
        gotoMonth({type: "goto", year, month});
        return;
      }
      const [nextYear, nextMonth] = value.split("-").map((s) => parseInt(s, 10));
      if (Number.isNaN(nextYear) || Number.isNaN(nextMonth)) {
        gotoMonth({type: "goto", year, month});
        return;
      }
      gotoMonth({
        type: "goto",
        year: nextYear,
        month: nextMonth - 1,
        fullYear: isFullYear
      }, false);
    }
  })), supportsDateInput && /* @__PURE__ */ import_preact.h("label", {
    class: "mt-5 flex flex-col items-stretch text-white text-center"
  }, "Suche einen Tag", /* @__PURE__ */ import_preact.h("input", {
    class: "flex-auto mt-1 w-full form-item",
    type: "date",
    "aria-controls": "calendar_main_out",
    min: "2000-01-01",
    value: searchValue,
    onChange: (event) => {
      const value = event.target.value;
      if (value == null || value.length === 0) {
        dispatch({type: "clear_search"});
      } else {
        const date = new Date(value);
        dispatch({
          type: "search",
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate()
        });
      }
    }
  })), /* @__PURE__ */ import_preact.h("button", {
    type: "button",
    class: "mt-5 form-item",
    onClick: toggleFullYear,
    "aria-controls": "calendar_main_out"
  }, "Zeige ", isFullYear ? "Monate" : "ganzes Jahr"), /* @__PURE__ */ import_preact.h("label", {
    class: "mt-5 flex flex-col items-stretch text-white text-center"
  }, "Schichtmodell", /* @__PURE__ */ import_preact.h("select", {
    class: "flex-auto mt-1 h-10 w-full text-black text-center rounded bg-gray-100 shadow hover:bg-gray-300 active:bg-gray-300 focus:ring focus:outline-none",
    "aria-controls": "calendar_main_out",
    value: shiftModel,
    onChange: (event) => {
      dispatch({
        type: "model_change",
        payload: event.target.value
      });
    }
  }, shiftModelNames.map((model) => /* @__PURE__ */ import_preact.h("option", {
    key: model,
    value: model
  }, shiftModelText[model] || model)))), /* @__PURE__ */ import_preact.h("select", {
    class: "mt-5 h-10 text-black text-center rounded bg-gray-100 shadow hover:bg-gray-300 active:bg-gray-300 focus:ring focus:outline-none",
    "aria-controls": "calendar_main_out",
    "aria-label": "Schichtgruppen",
    value: group,
    onChange: (event) => {
      const group2 = +event.target.value;
      dispatch({
        type: "group_change",
        payload: group2
      });
    }
  }, /* @__PURE__ */ import_preact.h("option", {
    value: "0"
  }, "Alle Gruppen"), groupOptions), /* @__PURE__ */ import_preact.h("button", {
    type: "button",
    class: "mt-5 mx-auto py-2 px-4 h-12 text-black text-center rounded bg-gray-100 shadow hover:bg-gray-300 active:bg-gray-300 focus:ring focus:outline-none",
    onClick: onShare,
    "aria-label": "Teile deine Schicht"
  }, /* @__PURE__ */ import_preact.h("img", {
    src: "/assets/icons/share21.svg",
    height: "32",
    width: "32",
    alt: "teilen"
  })));
}

// src/components/share-menu.jsx
var import_preact2 = __toModule(require("preact"));
var import_hooks = __toModule(require("preact/hooks"));
var import_querystringify = __toModule(require_querystringify());
function ShareMenu({group, search, shiftModel, hide}) {
  const [addGroup, setAddGroup] = import_hooks.useState(false);
  const [addSearch, setAddSearch] = import_hooks.useState(false);
  const [addShiftModel, setAddShiftModel] = import_hooks.useState(false);
  import_hooks.useEffect(() => {
    if (group === 0 && addGroup) {
      setAddGroup(false);
    }
  }, [group, addGroup]);
  import_hooks.useEffect(() => {
    if (search == null && addSearch) {
      setAddSearch(false);
    }
  }, [search, addSearch]);
  import_hooks.useEffect(() => {
    document.getElementById("share_url").focus();
    return () => {
      document.getElementById("hamburger_menu_toggle").focus();
    };
  }, []);
  const url = import_hooks.useMemo(() => {
    if (isSSR) {
      return "";
    }
    const url2 = new URL(window.location.href);
    const props = {};
    if (addGroup && group !== 0) {
      props.group = group;
    }
    if (addSearch && search != null) {
      const [year, month, date] = search;
      props.search = `${year}-${month + 1}-${date}`;
    }
    if (addShiftModel) {
      props.schichtmodell = shiftModel;
    }
    const hash = addGroup || addSearch || addShiftModel ? import_querystringify.default.stringify(props, "#") : "";
    url2.hash = hash;
    return url2;
  }, [addGroup, group, addSearch, search, addShiftModel, shiftModel]);
  return /* @__PURE__ */ import_preact2.h("div", {
    class: "flex flex-col content-center items-stretch absolute top-0 left-0 mt-12 px-5 pt-3 pb-5 text-white bg-green-900 shadow-lg"
  }, /* @__PURE__ */ import_preact2.h("label", {
    class: "flex flex-col"
  }, "Adresse zum teilen:", /* @__PURE__ */ import_preact2.h("input", {
    id: "share_url",
    class: "bg-transparent text-white pt-1 focus:ring focus:outline-none",
    type: "url",
    readonly: true,
    value: url.href,
    onFocus: (event) => {
      event.target.select();
    }
  })), /* @__PURE__ */ import_preact2.h("h6", {
    class: "mt-5 text-lg p-0 m-0 ml-4"
  }, "F\xFCge hinzu:"), /* @__PURE__ */ import_preact2.h("label", {
    class: "mt-5 ml-2"
  }, /* @__PURE__ */ import_preact2.h("input", {
    class: "h-4 w-4 mr-1 focus:ring focus:outline-none",
    type: "checkbox",
    checked: addShiftModel,
    onChange: (event) => {
      setAddShiftModel(event.target.checked);
      if (!event.target.checked && addGroup) {
        setAddGroup(false);
      }
      if (!event.target.checked && addSearch) {
        setAddSearch(false);
      }
    }
  }), "Schichtmodell"), /* @__PURE__ */ import_preact2.h("label", {
    class: "mt-5 ml-2"
  }, /* @__PURE__ */ import_preact2.h("input", {
    class: "h-4 w-4 mr-1 focus:ring focus:outline-none",
    type: "checkbox",
    checked: addGroup,
    disabled: group === 0,
    onChange: (event) => {
      if (group === 0 || group == null)
        return;
      setAddGroup(event.target.checked);
      if (event.target.checked && !addShiftModel) {
        setAddShiftModel(true);
      }
    }
  }), "Gruppe", group === 0 && /* @__PURE__ */ import_preact2.h("small", null, /* @__PURE__ */ import_preact2.h("br", null), "Momentan sind alle Gruppen ausgew\xE4hlt.")), /* @__PURE__ */ import_preact2.h("label", {
    class: "mt-5 ml-2"
  }, /* @__PURE__ */ import_preact2.h("input", {
    class: "h-4 w-4 mr-1 focus:ring focus:outline-none",
    type: "checkbox",
    checked: addSearch,
    disabled: search == null,
    onChange: (event) => {
      if (search == null)
        return;
      setAddSearch(event.target.checked);
      if (event.target.checked && !addShiftModel) {
        setAddShiftModel(true);
      }
    }
  }), "Der gesuchte Tag", search == null && /* @__PURE__ */ import_preact2.h("small", null, /* @__PURE__ */ import_preact2.h("br", null), "Momentan gibt es kein Suchergebnis.")), /* @__PURE__ */ import_preact2.h("div", {
    class: "mt-5 flex flex-row flex-wrap content-center"
  }, /* @__PURE__ */ import_preact2.h("button", {
    type: "button",
    class: "flex-auto mt-5 mx-3 w-32 form-item",
    onClick: hide
  }, "Abbrechen"), !isSSR && "share" in window.navigator ? /* @__PURE__ */ import_preact2.h("button", {
    type: "button",
    class: "flex-auto mt-5 mx-3 py-2 w-32 text-white bg-purple-700 hover:bg-purple-500 active:bg-purple-500 form-item",
    onClick: (event) => {
      event.preventDefault();
      window.navigator.share({
        url,
        title: "Schichtkalender",
        text: "Meine Schichten beim Bosch Reutlingen: " + url
      }).then(() => {
        hide();
      });
    }
  }, "Teilen") : /* @__PURE__ */ import_preact2.h("a", {
    class: "flex-auto mt-5 mx-3 py-2 w-32 text-white bg-purple-700 hover:bg-purple-500 active:bg-purple-500 form-item",
    href: `mailto:?subject=Schichtkalender&body=Meine Schichten beim Bosch Reutlingen: ${url.toString().replace(/&/g, "%26")}`,
    onClick: () => {
      setTimeout(hide, 16);
    }
  }, "Teilen")));
}

// src/components/header.jsx
function Header({
  url,
  isFullYear,
  month,
  year,
  search,
  group,
  shiftModel,
  dispatch
}) {
  const isSmallScreen = useIsSmallScreen();
  const [showMenu, setShowMenu] = useShowMenu();
  const [showShareMenu, setShowShareMenu] = useShowMenu();
  const hideMenu = () => setShowMenu(false);
  const toggleShowMenu = () => setShowMenu((old) => !old);
  return /* @__PURE__ */ import_preact3.h("header", {
    class: "fixed top-0 left-0 w-screen h-12 flex flex-row items-center justify-between bg-green-900 shadow-lg z-50"
  }, (url !== "/" || !isSmallScreen) && /* @__PURE__ */ import_preact3.h("h1", {
    class: "m-0 text-2xl font-normal align-baseline"
  }, /* @__PURE__ */ import_preact3.h(import_preact_router.Link, {
    href: "/",
    tabIndex: "0",
    class: "pl-4 text-white no-underline hover:underline focus:underline focus:ring focus:outline-none"
  }, "Kalender")), (url === "/" || !isSmallScreen) && /* @__PURE__ */ import_preact3.h("nav", {
    class: "h-full flex flex-row text-base items-stretch"
  }, /* @__PURE__ */ import_preact3.h("button", {
    type: "button",
    class: "px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none",
    title: "vorigen Monat",
    "aria-label": "vorigen Monat",
    "aria-controls": "calendar_main_out",
    onClick: () => {
      dispatch({type: "move", payload: -1});
      hideMenu();
    }
  }, "<"), /* @__PURE__ */ import_preact3.h("button", {
    type: "button",
    class: "px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none",
    title: "zeige aktuellen Monat",
    onClick: () => {
      const now = new Date();
      const year2 = now.getFullYear();
      const month2 = now.getMonth();
      dispatch({
        type: "goto",
        fullYear: false,
        year: year2,
        month: month2
      });
      hideMenu();
      setTimeout(scrollToADay, 16, year2, month2, now.getDate());
    }
  }, "Heute"), /* @__PURE__ */ import_preact3.h("button", {
    type: "button",
    class: "px-4 bg-transparent text-white hover:bg-green-600 active:bg-green-600 focus:ring focus:outline-none",
    title: "n\xE4chster Monat",
    "aria-label": "n\xE4chster Monat",
    "aria-controls": "calendar_main_out",
    onClick: () => {
      dispatch({type: "move", payload: 1});
      hideMenu();
    }
  }, ">"), /* @__PURE__ */ import_preact3.h("button", {
    id: "hamburger_menu_toggle",
    class: "flex justify-center items-center bg-transparent hover:bg-green-600 active:bg-green-600 w-16 focus:ring focus:outline-none",
    onClick: toggleShowMenu,
    "aria-controls": "hamburger_menu"
  }, /* @__PURE__ */ import_preact3.h("img", {
    src: "/assets/icons/hamburger_icon.svg",
    style: {filter: "invert(100%)"},
    height: "45",
    width: "45",
    alt: "Menu"
  })), /* @__PURE__ */ import_preact3.h(Menu, {
    show: showMenu,
    isFullYear,
    month,
    year,
    search,
    group,
    shiftModel,
    gotoMonth: (event, hide) => {
      dispatch(event);
      if (hide) {
        hideMenu();
      }
    },
    dispatch,
    onSearch: search,
    toggleFullYear: () => {
      dispatch({type: "toggle_full_year"});
      hideMenu();
    },
    onShare: () => {
      hideMenu();
      setShowShareMenu(true);
    }
  })), showShareMenu && /* @__PURE__ */ import_preact3.h(ShareMenu, {
    group,
    search,
    shiftModel,
    hide: () => {
      setShowShareMenu(false);
    }
  }));
}
function useIsSmallScreen() {
  const [isSmallScreen, setIsSmallScreen] = import_hooks2.useState(() => !isSSR && window.innerWidth < 350);
  import_hooks2.useEffect(() => {
    const onResize = () => {
      setIsSmallScreen(window.innerWidth < 350);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return isSmallScreen;
}
function useShowMenu() {
  const [show, setShow] = import_hooks2.useState(false);
  import_hooks2.useEffect(() => {
    if (show) {
      const hide = () => {
        setShow(false);
      };
      const element = document.getElementsByTagName("main")[0];
      element.addEventListener("click", hide);
      return () => {
        element.removeEventListener("click", hide);
      };
    }
  }, [show]);
  import_hooks2.useEffect(() => {
    if (show) {
      const keyEvent = (event) => {
        if (event.code === "Escape" || event.keyCode === 27) {
          setShow(false);
          const element = document.getElementById("hamburger_menu_toggle");
          if (element) {
            element.focus();
          }
        }
      };
      document.body.addEventListener("keyup", keyEvent);
      return () => {
        document.body.removeEventListener("keyup", keyEvent);
      };
    }
  }, [show]);
  return [show, setShow];
}
