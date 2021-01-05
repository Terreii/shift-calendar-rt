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

// node_modules/hammerjs/hammer.js
var require_hammer = __commonJS((exports2, module2) => {
  /*! Hammer.JS - v2.0.7 - 2016-04-22
   * http://hammerjs.github.io/
   *
   * Copyright (c) 2016 Jorik Tangelder;
   * Licensed under the MIT license */
  (function(window2, document2, exportName, undefined2) {
    "use strict";
    var VENDOR_PREFIXES = ["", "webkit", "Moz", "MS", "ms", "o"];
    var TEST_ELEMENT = document2.createElement("div");
    var TYPE_FUNCTION = "function";
    var round = Math.round;
    var abs = Math.abs;
    var now = Date.now;
    function setTimeoutContext(fn, timeout, context) {
      return setTimeout(bindFn(fn, context), timeout);
    }
    function invokeArrayArg(arg, fn, context) {
      if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
      }
      return false;
    }
    function each(obj, iterator, context) {
      var i;
      if (!obj) {
        return;
      }
      if (obj.forEach) {
        obj.forEach(iterator, context);
      } else if (obj.length !== undefined2) {
        i = 0;
        while (i < obj.length) {
          iterator.call(context, obj[i], i, obj);
          i++;
        }
      } else {
        for (i in obj) {
          obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
      }
    }
    function deprecate(method, name, message) {
      var deprecationMessage = "DEPRECATED METHOD: " + name + "\n" + message + " AT \n";
      return function() {
        var e = new Error("get-stack-trace");
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace";
        var log = window2.console && (window2.console.warn || window2.console.log);
        if (log) {
          log.call(window2.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
      };
    }
    var assign;
    if (typeof Object.assign !== "function") {
      assign = function assign2(target) {
        if (target === undefined2 || target === null) {
          throw new TypeError("Cannot convert undefined or null to object");
        }
        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source !== undefined2 && source !== null) {
            for (var nextKey in source) {
              if (source.hasOwnProperty(nextKey)) {
                output[nextKey] = source[nextKey];
              }
            }
          }
        }
        return output;
      };
    } else {
      assign = Object.assign;
    }
    var extend = deprecate(function extend2(dest, src, merge2) {
      var keys = Object.keys(src);
      var i = 0;
      while (i < keys.length) {
        if (!merge2 || merge2 && dest[keys[i]] === undefined2) {
          dest[keys[i]] = src[keys[i]];
        }
        i++;
      }
      return dest;
    }, "extend", "Use `assign`.");
    var merge = deprecate(function merge2(dest, src) {
      return extend(dest, src, true);
    }, "merge", "Use `assign`.");
    function inherit(child, base, properties) {
      var baseP = base.prototype, childP;
      childP = child.prototype = Object.create(baseP);
      childP.constructor = child;
      childP._super = baseP;
      if (properties) {
        assign(childP, properties);
      }
    }
    function bindFn(fn, context) {
      return function boundFn() {
        return fn.apply(context, arguments);
      };
    }
    function boolOrFn(val, args) {
      if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined2 : undefined2, args);
      }
      return val;
    }
    function ifUndefined(val1, val2) {
      return val1 === undefined2 ? val2 : val1;
    }
    function addEventListeners(target, types, handler) {
      each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
      });
    }
    function removeEventListeners(target, types, handler) {
      each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
      });
    }
    function hasParent(node, parent) {
      while (node) {
        if (node == parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    }
    function inStr(str, find) {
      return str.indexOf(find) > -1;
    }
    function splitStr(str) {
      return str.trim().split(/\s+/g);
    }
    function inArray(src, find, findByKey) {
      if (src.indexOf && !findByKey) {
        return src.indexOf(find);
      } else {
        var i = 0;
        while (i < src.length) {
          if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
            return i;
          }
          i++;
        }
        return -1;
      }
    }
    function toArray(obj) {
      return Array.prototype.slice.call(obj, 0);
    }
    function uniqueArray(src, key, sort) {
      var results = [];
      var values = [];
      var i = 0;
      while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
          results.push(src[i]);
        }
        values[i] = val;
        i++;
      }
      if (sort) {
        if (!key) {
          results = results.sort();
        } else {
          results = results.sort(function sortUniqueArray(a, b) {
            return a[key] > b[key];
          });
        }
      }
      return results;
    }
    function prefixed(obj, property) {
      var prefix, prop;
      var camelProp = property[0].toUpperCase() + property.slice(1);
      var i = 0;
      while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = prefix ? prefix + camelProp : property;
        if (prop in obj) {
          return prop;
        }
        i++;
      }
      return undefined2;
    }
    var _uniqueId = 1;
    function uniqueId() {
      return _uniqueId++;
    }
    function getWindowForElement(element) {
      var doc = element.ownerDocument || element;
      return doc.defaultView || doc.parentWindow || window2;
    }
    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
    var SUPPORT_TOUCH = "ontouchstart" in window2;
    var SUPPORT_POINTER_EVENTS = prefixed(window2, "PointerEvent") !== undefined2;
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
    var INPUT_TYPE_TOUCH = "touch";
    var INPUT_TYPE_PEN = "pen";
    var INPUT_TYPE_MOUSE = "mouse";
    var INPUT_TYPE_KINECT = "kinect";
    var COMPUTE_INTERVAL = 25;
    var INPUT_START = 1;
    var INPUT_MOVE = 2;
    var INPUT_END = 4;
    var INPUT_CANCEL = 8;
    var DIRECTION_NONE = 1;
    var DIRECTION_LEFT = 2;
    var DIRECTION_RIGHT = 4;
    var DIRECTION_UP = 8;
    var DIRECTION_DOWN = 16;
    var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
    var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
    var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
    var PROPS_XY = ["x", "y"];
    var PROPS_CLIENT_XY = ["clientX", "clientY"];
    function Input(manager, callback) {
      var self2 = this;
      this.manager = manager;
      this.callback = callback;
      this.element = manager.element;
      this.target = manager.options.inputTarget;
      this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
          self2.handler(ev);
        }
      };
      this.init();
    }
    Input.prototype = {
      handler: function() {
      },
      init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
      },
      destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
      }
    };
    function createInputInstance(manager) {
      var Type;
      var inputClass = manager.options.inputClass;
      if (inputClass) {
        Type = inputClass;
      } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
      } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
      } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
      } else {
        Type = TouchMouseInput;
      }
      return new Type(manager, inputHandler);
    }
    function inputHandler(manager, eventType, input) {
      var pointersLen = input.pointers.length;
      var changedPointersLen = input.changedPointers.length;
      var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
      var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;
      input.isFirst = !!isFirst;
      input.isFinal = !!isFinal;
      if (isFirst) {
        manager.session = {};
      }
      input.eventType = eventType;
      computeInputData(manager, input);
      manager.emit("hammer.input", input);
      manager.recognize(input);
      manager.session.prevInput = input;
    }
    function computeInputData(manager, input) {
      var session = manager.session;
      var pointers = input.pointers;
      var pointersLength = pointers.length;
      if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
      }
      if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
      } else if (pointersLength === 1) {
        session.firstMultiple = false;
      }
      var firstInput = session.firstInput;
      var firstMultiple = session.firstMultiple;
      var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
      var center = input.center = getCenter(pointers);
      input.timeStamp = now();
      input.deltaTime = input.timeStamp - firstInput.timeStamp;
      input.angle = getAngle(offsetCenter, center);
      input.distance = getDistance(offsetCenter, center);
      computeDeltaXY(session, input);
      input.offsetDirection = getDirection(input.deltaX, input.deltaY);
      var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
      input.overallVelocityX = overallVelocity.x;
      input.overallVelocityY = overallVelocity.y;
      input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;
      input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
      input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
      input.maxPointers = !session.prevInput ? input.pointers.length : input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers;
      computeIntervalInputData(session, input);
      var target = manager.element;
      if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
      }
      input.target = target;
    }
    function computeDeltaXY(session, input) {
      var center = input.center;
      var offset = session.offsetDelta || {};
      var prevDelta = session.prevDelta || {};
      var prevInput = session.prevInput || {};
      if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
          x: prevInput.deltaX || 0,
          y: prevInput.deltaY || 0
        };
        offset = session.offsetDelta = {
          x: center.x,
          y: center.y
        };
      }
      input.deltaX = prevDelta.x + (center.x - offset.x);
      input.deltaY = prevDelta.y + (center.y - offset.y);
    }
    function computeIntervalInputData(session, input) {
      var last = session.lastInterval || input, deltaTime = input.timeStamp - last.timeStamp, velocity, velocityX, velocityY, direction;
      if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined2)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;
        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);
        session.lastInterval = input;
      } else {
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
      }
      input.velocity = velocity;
      input.velocityX = velocityX;
      input.velocityY = velocityY;
      input.direction = direction;
    }
    function simpleCloneInputData(input) {
      var pointers = [];
      var i = 0;
      while (i < input.pointers.length) {
        pointers[i] = {
          clientX: round(input.pointers[i].clientX),
          clientY: round(input.pointers[i].clientY)
        };
        i++;
      }
      return {
        timeStamp: now(),
        pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
      };
    }
    function getCenter(pointers) {
      var pointersLength = pointers.length;
      if (pointersLength === 1) {
        return {
          x: round(pointers[0].clientX),
          y: round(pointers[0].clientY)
        };
      }
      var x = 0, y = 0, i = 0;
      while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
      }
      return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
      };
    }
    function getVelocity(deltaTime, x, y) {
      return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
      };
    }
    function getDirection(x, y) {
      if (x === y) {
        return DIRECTION_NONE;
      }
      if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
      }
      return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
    }
    function getDistance(p1, p2, props) {
      if (!props) {
        props = PROPS_XY;
      }
      var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
      return Math.sqrt(x * x + y * y);
    }
    function getAngle(p1, p2, props) {
      if (!props) {
        props = PROPS_XY;
      }
      var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
      return Math.atan2(y, x) * 180 / Math.PI;
    }
    function getRotation(start, end) {
      return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
    }
    function getScale(start, end) {
      return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
    }
    var MOUSE_INPUT_MAP = {
      mousedown: INPUT_START,
      mousemove: INPUT_MOVE,
      mouseup: INPUT_END
    };
    var MOUSE_ELEMENT_EVENTS = "mousedown";
    var MOUSE_WINDOW_EVENTS = "mousemove mouseup";
    function MouseInput() {
      this.evEl = MOUSE_ELEMENT_EVENTS;
      this.evWin = MOUSE_WINDOW_EVENTS;
      this.pressed = false;
      Input.apply(this, arguments);
    }
    inherit(MouseInput, Input, {
      handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];
        if (eventType & INPUT_START && ev.button === 0) {
          this.pressed = true;
        }
        if (eventType & INPUT_MOVE && ev.which !== 1) {
          eventType = INPUT_END;
        }
        if (!this.pressed) {
          return;
        }
        if (eventType & INPUT_END) {
          this.pressed = false;
        }
        this.callback(this.manager, eventType, {
          pointers: [ev],
          changedPointers: [ev],
          pointerType: INPUT_TYPE_MOUSE,
          srcEvent: ev
        });
      }
    });
    var POINTER_INPUT_MAP = {
      pointerdown: INPUT_START,
      pointermove: INPUT_MOVE,
      pointerup: INPUT_END,
      pointercancel: INPUT_CANCEL,
      pointerout: INPUT_CANCEL
    };
    var IE10_POINTER_TYPE_ENUM = {
      2: INPUT_TYPE_TOUCH,
      3: INPUT_TYPE_PEN,
      4: INPUT_TYPE_MOUSE,
      5: INPUT_TYPE_KINECT
    };
    var POINTER_ELEMENT_EVENTS = "pointerdown";
    var POINTER_WINDOW_EVENTS = "pointermove pointerup pointercancel";
    if (window2.MSPointerEvent && !window2.PointerEvent) {
      POINTER_ELEMENT_EVENTS = "MSPointerDown";
      POINTER_WINDOW_EVENTS = "MSPointerMove MSPointerUp MSPointerCancel";
    }
    function PointerEventInput() {
      this.evEl = POINTER_ELEMENT_EVENTS;
      this.evWin = POINTER_WINDOW_EVENTS;
      Input.apply(this, arguments);
      this.store = this.manager.session.pointerEvents = [];
    }
    inherit(PointerEventInput, Input, {
      handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;
        var eventTypeNormalized = ev.type.toLowerCase().replace("ms", "");
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
        var isTouch = pointerType == INPUT_TYPE_TOUCH;
        var storeIndex = inArray(store, ev.pointerId, "pointerId");
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
          if (storeIndex < 0) {
            store.push(ev);
            storeIndex = store.length - 1;
          }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
          removePointer = true;
        }
        if (storeIndex < 0) {
          return;
        }
        store[storeIndex] = ev;
        this.callback(this.manager, eventType, {
          pointers: store,
          changedPointers: [ev],
          pointerType,
          srcEvent: ev
        });
        if (removePointer) {
          store.splice(storeIndex, 1);
        }
      }
    });
    var SINGLE_TOUCH_INPUT_MAP = {
      touchstart: INPUT_START,
      touchmove: INPUT_MOVE,
      touchend: INPUT_END,
      touchcancel: INPUT_CANCEL
    };
    var SINGLE_TOUCH_TARGET_EVENTS = "touchstart";
    var SINGLE_TOUCH_WINDOW_EVENTS = "touchstart touchmove touchend touchcancel";
    function SingleTouchInput() {
      this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
      this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
      this.started = false;
      Input.apply(this, arguments);
    }
    inherit(SingleTouchInput, Input, {
      handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];
        if (type === INPUT_START) {
          this.started = true;
        }
        if (!this.started) {
          return;
        }
        var touches = normalizeSingleTouches.call(this, ev, type);
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
          this.started = false;
        }
        this.callback(this.manager, type, {
          pointers: touches[0],
          changedPointers: touches[1],
          pointerType: INPUT_TYPE_TOUCH,
          srcEvent: ev
        });
      }
    });
    function normalizeSingleTouches(ev, type) {
      var all = toArray(ev.touches);
      var changed = toArray(ev.changedTouches);
      if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), "identifier", true);
      }
      return [all, changed];
    }
    var TOUCH_INPUT_MAP = {
      touchstart: INPUT_START,
      touchmove: INPUT_MOVE,
      touchend: INPUT_END,
      touchcancel: INPUT_CANCEL
    };
    var TOUCH_TARGET_EVENTS = "touchstart touchmove touchend touchcancel";
    function TouchInput() {
      this.evTarget = TOUCH_TARGET_EVENTS;
      this.targetIds = {};
      Input.apply(this, arguments);
    }
    inherit(TouchInput, Input, {
      handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
          return;
        }
        this.callback(this.manager, type, {
          pointers: touches[0],
          changedPointers: touches[1],
          pointerType: INPUT_TYPE_TOUCH,
          srcEvent: ev
        });
      }
    });
    function getTouches(ev, type) {
      var allTouches = toArray(ev.touches);
      var targetIds = this.targetIds;
      if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
      }
      var i, targetTouches, changedTouches = toArray(ev.changedTouches), changedTargetTouches = [], target = this.target;
      targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
      });
      if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
          targetIds[targetTouches[i].identifier] = true;
          i++;
        }
      }
      i = 0;
      while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
          changedTargetTouches.push(changedTouches[i]);
        }
        if (type & (INPUT_END | INPUT_CANCEL)) {
          delete targetIds[changedTouches[i].identifier];
        }
        i++;
      }
      if (!changedTargetTouches.length) {
        return;
      }
      return [
        uniqueArray(targetTouches.concat(changedTargetTouches), "identifier", true),
        changedTargetTouches
      ];
    }
    var DEDUP_TIMEOUT = 2500;
    var DEDUP_DISTANCE = 25;
    function TouchMouseInput() {
      Input.apply(this, arguments);
      var handler = bindFn(this.handler, this);
      this.touch = new TouchInput(this.manager, handler);
      this.mouse = new MouseInput(this.manager, handler);
      this.primaryTouch = null;
      this.lastTouches = [];
    }
    inherit(TouchMouseInput, Input, {
      handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH, isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;
        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
          return;
        }
        if (isTouch) {
          recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
          return;
        }
        this.callback(manager, inputEvent, inputData);
      },
      destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
      }
    });
    function recordTouches(eventType, eventData) {
      if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
      } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
      }
    }
    function setLastTouch(eventData) {
      var touch = eventData.changedPointers[0];
      if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
          var i = lts.indexOf(lastTouch);
          if (i > -1) {
            lts.splice(i, 1);
          }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
      }
    }
    function isSyntheticEvent(eventData) {
      var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
      for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
          return true;
        }
      }
      return false;
    }
    var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, "touchAction");
    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined2;
    var TOUCH_ACTION_COMPUTE = "compute";
    var TOUCH_ACTION_AUTO = "auto";
    var TOUCH_ACTION_MANIPULATION = "manipulation";
    var TOUCH_ACTION_NONE = "none";
    var TOUCH_ACTION_PAN_X = "pan-x";
    var TOUCH_ACTION_PAN_Y = "pan-y";
    var TOUCH_ACTION_MAP = getTouchActionProps();
    function TouchAction(manager, value) {
      this.manager = manager;
      this.set(value);
    }
    TouchAction.prototype = {
      set: function(value) {
        if (value == TOUCH_ACTION_COMPUTE) {
          value = this.compute();
        }
        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
          this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
      },
      update: function() {
        this.set(this.manager.options.touchAction);
      },
      compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
          if (boolOrFn(recognizer.options.enable, [recognizer])) {
            actions = actions.concat(recognizer.getTouchAction());
          }
        });
        return cleanTouchActions(actions.join(" "));
      },
      preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;
        if (this.manager.session.prevented) {
          srcEvent.preventDefault();
          return;
        }
        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];
        if (hasNone) {
          var isTapPointer = input.pointers.length === 1;
          var isTapMovement = input.distance < 2;
          var isTapTouchTime = input.deltaTime < 250;
          if (isTapPointer && isTapMovement && isTapTouchTime) {
            return;
          }
        }
        if (hasPanX && hasPanY) {
          return;
        }
        if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
          return this.preventSrc(srcEvent);
        }
      },
      preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
      }
    };
    function cleanTouchActions(actions) {
      if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
      }
      var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
      var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
      if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
      }
      if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
      }
      if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
      }
      return TOUCH_ACTION_AUTO;
    }
    function getTouchActionProps() {
      if (!NATIVE_TOUCH_ACTION) {
        return false;
      }
      var touchMap = {};
      var cssSupports = window2.CSS && window2.CSS.supports;
      ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function(val) {
        touchMap[val] = cssSupports ? window2.CSS.supports("touch-action", val) : true;
      });
      return touchMap;
    }
    var STATE_POSSIBLE = 1;
    var STATE_BEGAN = 2;
    var STATE_CHANGED = 4;
    var STATE_ENDED = 8;
    var STATE_RECOGNIZED = STATE_ENDED;
    var STATE_CANCELLED = 16;
    var STATE_FAILED = 32;
    function Recognizer(options) {
      this.options = assign({}, this.defaults, options || {});
      this.id = uniqueId();
      this.manager = null;
      this.options.enable = ifUndefined(this.options.enable, true);
      this.state = STATE_POSSIBLE;
      this.simultaneous = {};
      this.requireFail = [];
    }
    Recognizer.prototype = {
      defaults: {},
      set: function(options) {
        assign(this.options, options);
        this.manager && this.manager.touchAction.update();
        return this;
      },
      recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, "recognizeWith", this)) {
          return this;
        }
        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
          simultaneous[otherRecognizer.id] = otherRecognizer;
          otherRecognizer.recognizeWith(this);
        }
        return this;
      },
      dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, "dropRecognizeWith", this)) {
          return this;
        }
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
      },
      requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, "requireFailure", this)) {
          return this;
        }
        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
          requireFail.push(otherRecognizer);
          otherRecognizer.requireFailure(this);
        }
        return this;
      },
      dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, "dropRequireFailure", this)) {
          return this;
        }
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
          this.requireFail.splice(index, 1);
        }
        return this;
      },
      hasRequireFailures: function() {
        return this.requireFail.length > 0;
      },
      canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
      },
      emit: function(input) {
        var self2 = this;
        var state = this.state;
        function emit(event) {
          self2.manager.emit(event, input);
        }
        if (state < STATE_ENDED) {
          emit(self2.options.event + stateStr(state));
        }
        emit(self2.options.event);
        if (input.additionalEvent) {
          emit(input.additionalEvent);
        }
        if (state >= STATE_ENDED) {
          emit(self2.options.event + stateStr(state));
        }
      },
      tryEmit: function(input) {
        if (this.canEmit()) {
          return this.emit(input);
        }
        this.state = STATE_FAILED;
      },
      canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
          if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
            return false;
          }
          i++;
        }
        return true;
      },
      recognize: function(inputData) {
        var inputDataClone = assign({}, inputData);
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
          this.reset();
          this.state = STATE_FAILED;
          return;
        }
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
          this.state = STATE_POSSIBLE;
        }
        this.state = this.process(inputDataClone);
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
          this.tryEmit(inputDataClone);
        }
      },
      process: function(inputData) {
      },
      getTouchAction: function() {
      },
      reset: function() {
      }
    };
    function stateStr(state) {
      if (state & STATE_CANCELLED) {
        return "cancel";
      } else if (state & STATE_ENDED) {
        return "end";
      } else if (state & STATE_CHANGED) {
        return "move";
      } else if (state & STATE_BEGAN) {
        return "start";
      }
      return "";
    }
    function directionStr(direction) {
      if (direction == DIRECTION_DOWN) {
        return "down";
      } else if (direction == DIRECTION_UP) {
        return "up";
      } else if (direction == DIRECTION_LEFT) {
        return "left";
      } else if (direction == DIRECTION_RIGHT) {
        return "right";
      }
      return "";
    }
    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
      var manager = recognizer.manager;
      if (manager) {
        return manager.get(otherRecognizer);
      }
      return otherRecognizer;
    }
    function AttrRecognizer() {
      Recognizer.apply(this, arguments);
    }
    inherit(AttrRecognizer, Recognizer, {
      defaults: {
        pointers: 1
      },
      attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
      },
      process: function(input) {
        var state = this.state;
        var eventType = input.eventType;
        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
          return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
          if (eventType & INPUT_END) {
            return state | STATE_ENDED;
          } else if (!(state & STATE_BEGAN)) {
            return STATE_BEGAN;
          }
          return state | STATE_CHANGED;
        }
        return STATE_FAILED;
      }
    });
    function PanRecognizer() {
      AttrRecognizer.apply(this, arguments);
      this.pX = null;
      this.pY = null;
    }
    inherit(PanRecognizer, AttrRecognizer, {
      defaults: {
        event: "pan",
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
      },
      getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
          actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
          actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
      },
      directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;
        if (!(direction & options.direction)) {
          if (options.direction & DIRECTION_HORIZONTAL) {
            direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
            hasMoved = x != this.pX;
            distance = Math.abs(input.deltaX);
          } else {
            direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
            hasMoved = y != this.pY;
            distance = Math.abs(input.deltaY);
          }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
      },
      attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
      },
      emit: function(input) {
        this.pX = input.deltaX;
        this.pY = input.deltaY;
        var direction = directionStr(input.direction);
        if (direction) {
          input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
      }
    });
    function PinchRecognizer() {
      AttrRecognizer.apply(this, arguments);
    }
    inherit(PinchRecognizer, AttrRecognizer, {
      defaults: {
        event: "pinch",
        threshold: 0,
        pointers: 2
      },
      getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
      },
      attrTest: function(input) {
        return this._super.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
      },
      emit: function(input) {
        if (input.scale !== 1) {
          var inOut = input.scale < 1 ? "in" : "out";
          input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
      }
    });
    function PressRecognizer() {
      Recognizer.apply(this, arguments);
      this._timer = null;
      this._input = null;
    }
    inherit(PressRecognizer, Recognizer, {
      defaults: {
        event: "press",
        pointers: 1,
        time: 251,
        threshold: 9
      },
      getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
      },
      process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;
        this._input = input;
        if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) {
          this.reset();
        } else if (input.eventType & INPUT_START) {
          this.reset();
          this._timer = setTimeoutContext(function() {
            this.state = STATE_RECOGNIZED;
            this.tryEmit();
          }, options.time, this);
        } else if (input.eventType & INPUT_END) {
          return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
      },
      reset: function() {
        clearTimeout(this._timer);
      },
      emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
          return;
        }
        if (input && input.eventType & INPUT_END) {
          this.manager.emit(this.options.event + "up", input);
        } else {
          this._input.timeStamp = now();
          this.manager.emit(this.options.event, this._input);
        }
      }
    });
    function RotateRecognizer() {
      AttrRecognizer.apply(this, arguments);
    }
    inherit(RotateRecognizer, AttrRecognizer, {
      defaults: {
        event: "rotate",
        threshold: 0,
        pointers: 2
      },
      getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
      },
      attrTest: function(input) {
        return this._super.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
      }
    });
    function SwipeRecognizer() {
      AttrRecognizer.apply(this, arguments);
    }
    inherit(SwipeRecognizer, AttrRecognizer, {
      defaults: {
        event: "swipe",
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
      },
      getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
      },
      attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;
        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
          velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
          velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
          velocity = input.overallVelocityY;
        }
        return this._super.attrTest.call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers == this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
      },
      emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
          this.manager.emit(this.options.event + direction, input);
        }
        this.manager.emit(this.options.event, input);
      }
    });
    function TapRecognizer() {
      Recognizer.apply(this, arguments);
      this.pTime = false;
      this.pCenter = false;
      this._timer = null;
      this._input = null;
      this.count = 0;
    }
    inherit(TapRecognizer, Recognizer, {
      defaults: {
        event: "tap",
        pointers: 1,
        taps: 1,
        interval: 300,
        time: 250,
        threshold: 9,
        posThreshold: 10
      },
      getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
      },
      process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;
        this.reset();
        if (input.eventType & INPUT_START && this.count === 0) {
          return this.failTimeout();
        }
        if (validMovement && validTouchTime && validPointers) {
          if (input.eventType != INPUT_END) {
            return this.failTimeout();
          }
          var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
          var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
          this.pTime = input.timeStamp;
          this.pCenter = input.center;
          if (!validMultiTap || !validInterval) {
            this.count = 1;
          } else {
            this.count += 1;
          }
          this._input = input;
          var tapCount = this.count % options.taps;
          if (tapCount === 0) {
            if (!this.hasRequireFailures()) {
              return STATE_RECOGNIZED;
            } else {
              this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
              }, options.interval, this);
              return STATE_BEGAN;
            }
          }
        }
        return STATE_FAILED;
      },
      failTimeout: function() {
        this._timer = setTimeoutContext(function() {
          this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
      },
      reset: function() {
        clearTimeout(this._timer);
      },
      emit: function() {
        if (this.state == STATE_RECOGNIZED) {
          this._input.tapCount = this.count;
          this.manager.emit(this.options.event, this._input);
        }
      }
    });
    function Hammer2(element, options) {
      options = options || {};
      options.recognizers = ifUndefined(options.recognizers, Hammer2.defaults.preset);
      return new Manager(element, options);
    }
    Hammer2.VERSION = "2.0.7";
    Hammer2.defaults = {
      domEvents: false,
      touchAction: TOUCH_ACTION_COMPUTE,
      enable: true,
      inputTarget: null,
      inputClass: null,
      preset: [
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ["rotate"]],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ["swipe"]],
        [TapRecognizer],
        [TapRecognizer, {event: "doubletap", taps: 2}, ["tap"]],
        [PressRecognizer]
      ],
      cssProps: {
        userSelect: "none",
        touchSelect: "none",
        touchCallout: "none",
        contentZooming: "none",
        userDrag: "none",
        tapHighlightColor: "rgba(0,0,0,0)"
      }
    };
    var STOP = 1;
    var FORCED_STOP = 2;
    function Manager(element, options) {
      this.options = assign({}, Hammer2.defaults, options || {});
      this.options.inputTarget = this.options.inputTarget || element;
      this.handlers = {};
      this.session = {};
      this.recognizers = [];
      this.oldCssProps = {};
      this.element = element;
      this.input = createInputInstance(this);
      this.touchAction = new TouchAction(this, this.options.touchAction);
      toggleCssProps(this, true);
      each(this.options.recognizers, function(item) {
        var recognizer = this.add(new item[0](item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
      }, this);
    }
    Manager.prototype = {
      set: function(options) {
        assign(this.options, options);
        if (options.touchAction) {
          this.touchAction.update();
        }
        if (options.inputTarget) {
          this.input.destroy();
          this.input.target = options.inputTarget;
          this.input.init();
        }
        return this;
      },
      stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
      },
      recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
          return;
        }
        this.touchAction.preventDefaults(inputData);
        var recognizer;
        var recognizers = this.recognizers;
        var curRecognizer = session.curRecognizer;
        if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
          curRecognizer = session.curRecognizer = null;
        }
        var i = 0;
        while (i < recognizers.length) {
          recognizer = recognizers[i];
          if (session.stopped !== FORCED_STOP && (!curRecognizer || recognizer == curRecognizer || recognizer.canRecognizeWith(curRecognizer))) {
            recognizer.recognize(inputData);
          } else {
            recognizer.reset();
          }
          if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
            curRecognizer = session.curRecognizer = recognizer;
          }
          i++;
        }
      },
      get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
          return recognizer;
        }
        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
          if (recognizers[i].options.event == recognizer) {
            return recognizers[i];
          }
        }
        return null;
      },
      add: function(recognizer) {
        if (invokeArrayArg(recognizer, "add", this)) {
          return this;
        }
        var existing = this.get(recognizer.options.event);
        if (existing) {
          this.remove(existing);
        }
        this.recognizers.push(recognizer);
        recognizer.manager = this;
        this.touchAction.update();
        return recognizer;
      },
      remove: function(recognizer) {
        if (invokeArrayArg(recognizer, "remove", this)) {
          return this;
        }
        recognizer = this.get(recognizer);
        if (recognizer) {
          var recognizers = this.recognizers;
          var index = inArray(recognizers, recognizer);
          if (index !== -1) {
            recognizers.splice(index, 1);
            this.touchAction.update();
          }
        }
        return this;
      },
      on: function(events, handler) {
        if (events === undefined2) {
          return;
        }
        if (handler === undefined2) {
          return;
        }
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
          handlers[event] = handlers[event] || [];
          handlers[event].push(handler);
        });
        return this;
      },
      off: function(events, handler) {
        if (events === undefined2) {
          return;
        }
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
          if (!handler) {
            delete handlers[event];
          } else {
            handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
          }
        });
        return this;
      },
      emit: function(event, data) {
        if (this.options.domEvents) {
          triggerDomEvent(event, data);
        }
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
          return;
        }
        data.type = event;
        data.preventDefault = function() {
          data.srcEvent.preventDefault();
        };
        var i = 0;
        while (i < handlers.length) {
          handlers[i](data);
          i++;
        }
      },
      destroy: function() {
        this.element && toggleCssProps(this, false);
        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
      }
    };
    function toggleCssProps(manager, add) {
      var element = manager.element;
      if (!element.style) {
        return;
      }
      var prop;
      each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
          manager.oldCssProps[prop] = element.style[prop];
          element.style[prop] = value;
        } else {
          element.style[prop] = manager.oldCssProps[prop] || "";
        }
      });
      if (!add) {
        manager.oldCssProps = {};
      }
    }
    function triggerDomEvent(event, data) {
      var gestureEvent = document2.createEvent("Event");
      gestureEvent.initEvent(event, true, true);
      gestureEvent.gesture = data;
      data.target.dispatchEvent(gestureEvent);
    }
    assign(Hammer2, {
      INPUT_START,
      INPUT_MOVE,
      INPUT_END,
      INPUT_CANCEL,
      STATE_POSSIBLE,
      STATE_BEGAN,
      STATE_CHANGED,
      STATE_ENDED,
      STATE_RECOGNIZED,
      STATE_CANCELLED,
      STATE_FAILED,
      DIRECTION_NONE,
      DIRECTION_LEFT,
      DIRECTION_RIGHT,
      DIRECTION_UP,
      DIRECTION_DOWN,
      DIRECTION_HORIZONTAL,
      DIRECTION_VERTICAL,
      DIRECTION_ALL,
      Manager,
      Input,
      TouchAction,
      TouchInput,
      MouseInput,
      PointerEventInput,
      TouchMouseInput,
      SingleTouchInput,
      Recognizer,
      AttrRecognizer,
      Tap: TapRecognizer,
      Pan: PanRecognizer,
      Swipe: SwipeRecognizer,
      Pinch: PinchRecognizer,
      Rotate: RotateRecognizer,
      Press: PressRecognizer,
      on: addEventListeners,
      off: removeEventListeners,
      each,
      merge,
      extend,
      assign,
      inherit,
      bindFn,
      prefixed
    });
    var freeGlobal = typeof window2 !== "undefined" ? window2 : typeof self !== "undefined" ? self : {};
    freeGlobal.Hammer = Hammer2;
    if (typeof define === "function" && define.amd) {
      define(function() {
        return Hammer2;
      });
    } else if (typeof module2 != "undefined" && module2.exports) {
      module2.exports = Hammer2;
    } else {
      window2[exportName] = Hammer2;
    }
  })(window, document, "Hammer");
});

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
          var h11 = e2[s2].replace(/(^:|[+*?]+$)/g, ""), d2 = (e2[s2].match(/[+*?]+$/) || C)[0] || "", g2 = ~d2.indexOf("+"), y2 = ~d2.indexOf("*"), m2 = t2[s2] || "";
          if (!m2 && !y2 && (d2.indexOf("?") < 0 || g2)) {
            r2 = false;
            break;
          }
          if (a2[h11] = decodeURIComponent(m2), g2 || y2) {
            a2[h11] = t2.slice(s2).map(decodeURIComponent).join("/");
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
      return e2 === void 0 && (e2 = false), typeof t2 != "string" && t2.url && (e2 = t2.replace, t2 = t2.url), s(t2) && c(t2, e2 ? "replace" : "push"), h10(t2);
    }
    function s(t2) {
      for (var e2 = U.length; e2--; )
        if (U[e2].canRoute(t2))
          return true;
      return false;
    }
    function h10(t2) {
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
        h10(f());
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

// node_modules/luxon/build/node/luxon.js
var require_luxon = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  var LuxonError = class extends Error {
  };
  var InvalidDateTimeError = class extends LuxonError {
    constructor(reason) {
      super(`Invalid DateTime: ${reason.toMessage()}`);
    }
  };
  var InvalidIntervalError = class extends LuxonError {
    constructor(reason) {
      super(`Invalid Interval: ${reason.toMessage()}`);
    }
  };
  var InvalidDurationError = class extends LuxonError {
    constructor(reason) {
      super(`Invalid Duration: ${reason.toMessage()}`);
    }
  };
  var ConflictingSpecificationError = class extends LuxonError {
  };
  var InvalidUnitError = class extends LuxonError {
    constructor(unit) {
      super(`Invalid unit ${unit}`);
    }
  };
  var InvalidArgumentError = class extends LuxonError {
  };
  var ZoneIsAbstractError = class extends LuxonError {
    constructor() {
      super("Zone is an abstract class");
    }
  };
  var n = "numeric";
  var s = "short";
  var l = "long";
  var DATE_SHORT = {
    year: n,
    month: n,
    day: n
  };
  var DATE_MED = {
    year: n,
    month: s,
    day: n
  };
  var DATE_MED_WITH_WEEKDAY = {
    year: n,
    month: s,
    day: n,
    weekday: s
  };
  var DATE_FULL = {
    year: n,
    month: l,
    day: n
  };
  var DATE_HUGE = {
    year: n,
    month: l,
    day: n,
    weekday: l
  };
  var TIME_SIMPLE = {
    hour: n,
    minute: n
  };
  var TIME_WITH_SECONDS = {
    hour: n,
    minute: n,
    second: n
  };
  var TIME_WITH_SHORT_OFFSET = {
    hour: n,
    minute: n,
    second: n,
    timeZoneName: s
  };
  var TIME_WITH_LONG_OFFSET = {
    hour: n,
    minute: n,
    second: n,
    timeZoneName: l
  };
  var TIME_24_SIMPLE = {
    hour: n,
    minute: n,
    hour12: false
  };
  var TIME_24_WITH_SECONDS = {
    hour: n,
    minute: n,
    second: n,
    hour12: false
  };
  var TIME_24_WITH_SHORT_OFFSET = {
    hour: n,
    minute: n,
    second: n,
    hour12: false,
    timeZoneName: s
  };
  var TIME_24_WITH_LONG_OFFSET = {
    hour: n,
    minute: n,
    second: n,
    hour12: false,
    timeZoneName: l
  };
  var DATETIME_SHORT = {
    year: n,
    month: n,
    day: n,
    hour: n,
    minute: n
  };
  var DATETIME_SHORT_WITH_SECONDS = {
    year: n,
    month: n,
    day: n,
    hour: n,
    minute: n,
    second: n
  };
  var DATETIME_MED = {
    year: n,
    month: s,
    day: n,
    hour: n,
    minute: n
  };
  var DATETIME_MED_WITH_SECONDS = {
    year: n,
    month: s,
    day: n,
    hour: n,
    minute: n,
    second: n
  };
  var DATETIME_MED_WITH_WEEKDAY = {
    year: n,
    month: s,
    day: n,
    weekday: s,
    hour: n,
    minute: n
  };
  var DATETIME_FULL = {
    year: n,
    month: l,
    day: n,
    hour: n,
    minute: n,
    timeZoneName: s
  };
  var DATETIME_FULL_WITH_SECONDS = {
    year: n,
    month: l,
    day: n,
    hour: n,
    minute: n,
    second: n,
    timeZoneName: s
  };
  var DATETIME_HUGE = {
    year: n,
    month: l,
    day: n,
    weekday: l,
    hour: n,
    minute: n,
    timeZoneName: l
  };
  var DATETIME_HUGE_WITH_SECONDS = {
    year: n,
    month: l,
    day: n,
    weekday: l,
    hour: n,
    minute: n,
    second: n,
    timeZoneName: l
  };
  function isUndefined(o) {
    return typeof o === "undefined";
  }
  function isNumber(o) {
    return typeof o === "number";
  }
  function isInteger(o) {
    return typeof o === "number" && o % 1 === 0;
  }
  function isString(o) {
    return typeof o === "string";
  }
  function isDate(o) {
    return Object.prototype.toString.call(o) === "[object Date]";
  }
  function hasIntl() {
    try {
      return typeof Intl !== "undefined" && Intl.DateTimeFormat;
    } catch (e) {
      return false;
    }
  }
  function hasFormatToParts() {
    return !isUndefined(Intl.DateTimeFormat.prototype.formatToParts);
  }
  function hasRelative() {
    try {
      return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
    } catch (e) {
      return false;
    }
  }
  function maybeArray(thing) {
    return Array.isArray(thing) ? thing : [thing];
  }
  function bestBy(arr, by, compare) {
    if (arr.length === 0) {
      return void 0;
    }
    return arr.reduce((best, next) => {
      const pair = [by(next), next];
      if (!best) {
        return pair;
      } else if (compare(best[0], pair[0]) === best[0]) {
        return best;
      } else {
        return pair;
      }
    }, null)[1];
  }
  function pick(obj, keys) {
    return keys.reduce((a, k) => {
      a[k] = obj[k];
      return a;
    }, {});
  }
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  function integerBetween(thing, bottom, top) {
    return isInteger(thing) && thing >= bottom && thing <= top;
  }
  function floorMod(x, n2) {
    return x - n2 * Math.floor(x / n2);
  }
  function padStart(input, n2 = 2) {
    if (input.toString().length < n2) {
      return ("0".repeat(n2) + input).slice(-n2);
    } else {
      return input.toString();
    }
  }
  function parseInteger(string) {
    if (isUndefined(string) || string === null || string === "") {
      return void 0;
    } else {
      return parseInt(string, 10);
    }
  }
  function parseMillis(fraction) {
    if (isUndefined(fraction) || fraction === null || fraction === "") {
      return void 0;
    } else {
      const f = parseFloat("0." + fraction) * 1e3;
      return Math.floor(f);
    }
  }
  function roundTo(number, digits, towardZero = false) {
    const factor = Math.pow(10, digits), rounder = towardZero ? Math.trunc : Math.round;
    return rounder(number * factor) / factor;
  }
  function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }
  function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
  }
  function daysInMonth(year, month) {
    const modMonth = floorMod(month - 1, 12) + 1, modYear = year + (month - modMonth) / 12;
    if (modMonth === 2) {
      return isLeapYear(modYear) ? 29 : 28;
    } else {
      return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
    }
  }
  function objToLocalTS(obj) {
    let d = Date.UTC(obj.year, obj.month - 1, obj.day, obj.hour, obj.minute, obj.second, obj.millisecond);
    if (obj.year < 100 && obj.year >= 0) {
      d = new Date(d);
      d.setUTCFullYear(d.getUTCFullYear() - 1900);
    }
    return +d;
  }
  function weeksInWeekYear(weekYear) {
    const p1 = (weekYear + Math.floor(weekYear / 4) - Math.floor(weekYear / 100) + Math.floor(weekYear / 400)) % 7, last = weekYear - 1, p2 = (last + Math.floor(last / 4) - Math.floor(last / 100) + Math.floor(last / 400)) % 7;
    return p1 === 4 || p2 === 3 ? 53 : 52;
  }
  function untruncateYear(year) {
    if (year > 99) {
      return year;
    } else
      return year > 60 ? 1900 + year : 2e3 + year;
  }
  function parseZoneInfo(ts, offsetFormat, locale, timeZone = null) {
    const date = new Date(ts), intlOpts = {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    };
    if (timeZone) {
      intlOpts.timeZone = timeZone;
    }
    const modified = Object.assign({
      timeZoneName: offsetFormat
    }, intlOpts), intl = hasIntl();
    if (intl && hasFormatToParts()) {
      const parsed = new Intl.DateTimeFormat(locale, modified).formatToParts(date).find((m) => m.type.toLowerCase() === "timezonename");
      return parsed ? parsed.value : null;
    } else if (intl) {
      const without = new Intl.DateTimeFormat(locale, intlOpts).format(date), included = new Intl.DateTimeFormat(locale, modified).format(date), diffed = included.substring(without.length), trimmed = diffed.replace(/^[, \u200e]+/, "");
      return trimmed;
    } else {
      return null;
    }
  }
  function signedOffset(offHourStr, offMinuteStr) {
    let offHour = parseInt(offHourStr, 10);
    if (Number.isNaN(offHour)) {
      offHour = 0;
    }
    const offMin = parseInt(offMinuteStr, 10) || 0, offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
    return offHour * 60 + offMinSigned;
  }
  function asNumber(value) {
    const numericValue = Number(value);
    if (typeof value === "boolean" || value === "" || Number.isNaN(numericValue))
      throw new InvalidArgumentError(`Invalid unit value ${value}`);
    return numericValue;
  }
  function normalizeObject(obj, normalizer, nonUnitKeys) {
    const normalized = {};
    for (const u in obj) {
      if (hasOwnProperty(obj, u)) {
        if (nonUnitKeys.indexOf(u) >= 0)
          continue;
        const v = obj[u];
        if (v === void 0 || v === null)
          continue;
        normalized[normalizer(u)] = asNumber(v);
      }
    }
    return normalized;
  }
  function formatOffset(offset2, format) {
    const hours = Math.trunc(Math.abs(offset2 / 60)), minutes = Math.trunc(Math.abs(offset2 % 60)), sign = offset2 >= 0 ? "+" : "-";
    switch (format) {
      case "short":
        return `${sign}${padStart(hours, 2)}:${padStart(minutes, 2)}`;
      case "narrow":
        return `${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
      case "techie":
        return `${sign}${padStart(hours, 2)}${padStart(minutes, 2)}`;
      default:
        throw new RangeError(`Value format ${format} is out of range for property format`);
    }
  }
  function timeObject(obj) {
    return pick(obj, ["hour", "minute", "second", "millisecond"]);
  }
  var ianaRegex = /[A-Za-z_+-]{1,256}(:?\/[A-Za-z_+-]{1,256}(\/[A-Za-z_+-]{1,256})?)?/;
  function stringify(obj) {
    return JSON.stringify(obj, Object.keys(obj).sort());
  }
  var monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var monthsNarrow = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  function months(length) {
    switch (length) {
      case "narrow":
        return monthsNarrow;
      case "short":
        return monthsShort;
      case "long":
        return monthsLong;
      case "numeric":
        return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
      case "2-digit":
        return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      default:
        return null;
    }
  }
  var weekdaysLong = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var weekdaysNarrow = ["M", "T", "W", "T", "F", "S", "S"];
  function weekdays(length) {
    switch (length) {
      case "narrow":
        return weekdaysNarrow;
      case "short":
        return weekdaysShort;
      case "long":
        return weekdaysLong;
      case "numeric":
        return ["1", "2", "3", "4", "5", "6", "7"];
      default:
        return null;
    }
  }
  var meridiems = ["AM", "PM"];
  var erasLong = ["Before Christ", "Anno Domini"];
  var erasShort = ["BC", "AD"];
  var erasNarrow = ["B", "A"];
  function eras(length) {
    switch (length) {
      case "narrow":
        return erasNarrow;
      case "short":
        return erasShort;
      case "long":
        return erasLong;
      default:
        return null;
    }
  }
  function meridiemForDateTime(dt) {
    return meridiems[dt.hour < 12 ? 0 : 1];
  }
  function weekdayForDateTime(dt, length) {
    return weekdays(length)[dt.weekday - 1];
  }
  function monthForDateTime(dt, length) {
    return months(length)[dt.month - 1];
  }
  function eraForDateTime(dt, length) {
    return eras(length)[dt.year < 0 ? 0 : 1];
  }
  function formatRelativeTime(unit, count, numeric = "always", narrow = false) {
    const units = {
      years: ["year", "yr."],
      quarters: ["quarter", "qtr."],
      months: ["month", "mo."],
      weeks: ["week", "wk."],
      days: ["day", "day", "days"],
      hours: ["hour", "hr."],
      minutes: ["minute", "min."],
      seconds: ["second", "sec."]
    };
    const lastable = ["hours", "minutes", "seconds"].indexOf(unit) === -1;
    if (numeric === "auto" && lastable) {
      const isDay = unit === "days";
      switch (count) {
        case 1:
          return isDay ? "tomorrow" : `next ${units[unit][0]}`;
        case -1:
          return isDay ? "yesterday" : `last ${units[unit][0]}`;
        case 0:
          return isDay ? "today" : `this ${units[unit][0]}`;
      }
    }
    const isInPast = Object.is(count, -0) || count < 0, fmtValue = Math.abs(count), singular = fmtValue === 1, lilUnits = units[unit], fmtUnit = narrow ? singular ? lilUnits[1] : lilUnits[2] || lilUnits[1] : singular ? units[unit][0] : unit;
    return isInPast ? `${fmtValue} ${fmtUnit} ago` : `in ${fmtValue} ${fmtUnit}`;
  }
  function formatString(knownFormat) {
    const filtered = pick(knownFormat, ["weekday", "era", "year", "month", "day", "hour", "minute", "second", "timeZoneName", "hour12"]), key = stringify(filtered), dateTimeHuge = "EEEE, LLLL d, yyyy, h:mm a";
    switch (key) {
      case stringify(DATE_SHORT):
        return "M/d/yyyy";
      case stringify(DATE_MED):
        return "LLL d, yyyy";
      case stringify(DATE_MED_WITH_WEEKDAY):
        return "EEE, LLL d, yyyy";
      case stringify(DATE_FULL):
        return "LLLL d, yyyy";
      case stringify(DATE_HUGE):
        return "EEEE, LLLL d, yyyy";
      case stringify(TIME_SIMPLE):
        return "h:mm a";
      case stringify(TIME_WITH_SECONDS):
        return "h:mm:ss a";
      case stringify(TIME_WITH_SHORT_OFFSET):
        return "h:mm a";
      case stringify(TIME_WITH_LONG_OFFSET):
        return "h:mm a";
      case stringify(TIME_24_SIMPLE):
        return "HH:mm";
      case stringify(TIME_24_WITH_SECONDS):
        return "HH:mm:ss";
      case stringify(TIME_24_WITH_SHORT_OFFSET):
        return "HH:mm";
      case stringify(TIME_24_WITH_LONG_OFFSET):
        return "HH:mm";
      case stringify(DATETIME_SHORT):
        return "M/d/yyyy, h:mm a";
      case stringify(DATETIME_MED):
        return "LLL d, yyyy, h:mm a";
      case stringify(DATETIME_FULL):
        return "LLLL d, yyyy, h:mm a";
      case stringify(DATETIME_HUGE):
        return dateTimeHuge;
      case stringify(DATETIME_SHORT_WITH_SECONDS):
        return "M/d/yyyy, h:mm:ss a";
      case stringify(DATETIME_MED_WITH_SECONDS):
        return "LLL d, yyyy, h:mm:ss a";
      case stringify(DATETIME_MED_WITH_WEEKDAY):
        return "EEE, d LLL yyyy, h:mm a";
      case stringify(DATETIME_FULL_WITH_SECONDS):
        return "LLLL d, yyyy, h:mm:ss a";
      case stringify(DATETIME_HUGE_WITH_SECONDS):
        return "EEEE, LLLL d, yyyy, h:mm:ss a";
      default:
        return dateTimeHuge;
    }
  }
  function stringifyTokens(splits, tokenToString) {
    let s2 = "";
    for (const token of splits) {
      if (token.literal) {
        s2 += token.val;
      } else {
        s2 += tokenToString(token.val);
      }
    }
    return s2;
  }
  var macroTokenToFormatOpts = {
    D: DATE_SHORT,
    DD: DATE_MED,
    DDD: DATE_FULL,
    DDDD: DATE_HUGE,
    t: TIME_SIMPLE,
    tt: TIME_WITH_SECONDS,
    ttt: TIME_WITH_SHORT_OFFSET,
    tttt: TIME_WITH_LONG_OFFSET,
    T: TIME_24_SIMPLE,
    TT: TIME_24_WITH_SECONDS,
    TTT: TIME_24_WITH_SHORT_OFFSET,
    TTTT: TIME_24_WITH_LONG_OFFSET,
    f: DATETIME_SHORT,
    ff: DATETIME_MED,
    fff: DATETIME_FULL,
    ffff: DATETIME_HUGE,
    F: DATETIME_SHORT_WITH_SECONDS,
    FF: DATETIME_MED_WITH_SECONDS,
    FFF: DATETIME_FULL_WITH_SECONDS,
    FFFF: DATETIME_HUGE_WITH_SECONDS
  };
  var Formatter = class {
    static create(locale, opts = {}) {
      return new Formatter(locale, opts);
    }
    static parseFormat(fmt) {
      let current = null, currentFull = "", bracketed = false;
      const splits = [];
      for (let i = 0; i < fmt.length; i++) {
        const c = fmt.charAt(i);
        if (c === "'") {
          if (currentFull.length > 0) {
            splits.push({
              literal: bracketed,
              val: currentFull
            });
          }
          current = null;
          currentFull = "";
          bracketed = !bracketed;
        } else if (bracketed) {
          currentFull += c;
        } else if (c === current) {
          currentFull += c;
        } else {
          if (currentFull.length > 0) {
            splits.push({
              literal: false,
              val: currentFull
            });
          }
          currentFull = c;
          current = c;
        }
      }
      if (currentFull.length > 0) {
        splits.push({
          literal: bracketed,
          val: currentFull
        });
      }
      return splits;
    }
    static macroTokenToFormatOpts(token) {
      return macroTokenToFormatOpts[token];
    }
    constructor(locale, formatOpts) {
      this.opts = formatOpts;
      this.loc = locale;
      this.systemLoc = null;
    }
    formatWithSystemDefault(dt, opts) {
      if (this.systemLoc === null) {
        this.systemLoc = this.loc.redefaultToSystem();
      }
      const df = this.systemLoc.dtFormatter(dt, Object.assign({}, this.opts, opts));
      return df.format();
    }
    formatDateTime(dt, opts = {}) {
      const df = this.loc.dtFormatter(dt, Object.assign({}, this.opts, opts));
      return df.format();
    }
    formatDateTimeParts(dt, opts = {}) {
      const df = this.loc.dtFormatter(dt, Object.assign({}, this.opts, opts));
      return df.formatToParts();
    }
    resolvedOptions(dt, opts = {}) {
      const df = this.loc.dtFormatter(dt, Object.assign({}, this.opts, opts));
      return df.resolvedOptions();
    }
    num(n2, p = 0) {
      if (this.opts.forceSimple) {
        return padStart(n2, p);
      }
      const opts = Object.assign({}, this.opts);
      if (p > 0) {
        opts.padTo = p;
      }
      return this.loc.numberFormatter(opts).format(n2);
    }
    formatDateTimeFromString(dt, fmt) {
      const knownEnglish = this.loc.listingMode() === "en", useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory" && hasFormatToParts(), string = (opts, extract) => this.loc.extract(dt, opts, extract), formatOffset2 = (opts) => {
        if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
          return "Z";
        }
        return dt.isValid ? dt.zone.formatOffset(dt.ts, opts.format) : "";
      }, meridiem = () => knownEnglish ? meridiemForDateTime(dt) : string({
        hour: "numeric",
        hour12: true
      }, "dayperiod"), month = (length, standalone) => knownEnglish ? monthForDateTime(dt, length) : string(standalone ? {
        month: length
      } : {
        month: length,
        day: "numeric"
      }, "month"), weekday = (length, standalone) => knownEnglish ? weekdayForDateTime(dt, length) : string(standalone ? {
        weekday: length
      } : {
        weekday: length,
        month: "long",
        day: "numeric"
      }, "weekday"), maybeMacro = (token) => {
        const formatOpts = Formatter.macroTokenToFormatOpts(token);
        if (formatOpts) {
          return this.formatWithSystemDefault(dt, formatOpts);
        } else {
          return token;
        }
      }, era = (length) => knownEnglish ? eraForDateTime(dt, length) : string({
        era: length
      }, "era"), tokenToString = (token) => {
        switch (token) {
          case "S":
            return this.num(dt.millisecond);
          case "u":
          case "SSS":
            return this.num(dt.millisecond, 3);
          case "s":
            return this.num(dt.second);
          case "ss":
            return this.num(dt.second, 2);
          case "m":
            return this.num(dt.minute);
          case "mm":
            return this.num(dt.minute, 2);
          case "h":
            return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);
          case "hh":
            return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);
          case "H":
            return this.num(dt.hour);
          case "HH":
            return this.num(dt.hour, 2);
          case "Z":
            return formatOffset2({
              format: "narrow",
              allowZ: this.opts.allowZ
            });
          case "ZZ":
            return formatOffset2({
              format: "short",
              allowZ: this.opts.allowZ
            });
          case "ZZZ":
            return formatOffset2({
              format: "techie",
              allowZ: this.opts.allowZ
            });
          case "ZZZZ":
            return dt.zone.offsetName(dt.ts, {
              format: "short",
              locale: this.loc.locale
            });
          case "ZZZZZ":
            return dt.zone.offsetName(dt.ts, {
              format: "long",
              locale: this.loc.locale
            });
          case "z":
            return dt.zoneName;
          case "a":
            return meridiem();
          case "d":
            return useDateTimeFormatter ? string({
              day: "numeric"
            }, "day") : this.num(dt.day);
          case "dd":
            return useDateTimeFormatter ? string({
              day: "2-digit"
            }, "day") : this.num(dt.day, 2);
          case "c":
            return this.num(dt.weekday);
          case "ccc":
            return weekday("short", true);
          case "cccc":
            return weekday("long", true);
          case "ccccc":
            return weekday("narrow", true);
          case "E":
            return this.num(dt.weekday);
          case "EEE":
            return weekday("short", false);
          case "EEEE":
            return weekday("long", false);
          case "EEEEE":
            return weekday("narrow", false);
          case "L":
            return useDateTimeFormatter ? string({
              month: "numeric",
              day: "numeric"
            }, "month") : this.num(dt.month);
          case "LL":
            return useDateTimeFormatter ? string({
              month: "2-digit",
              day: "numeric"
            }, "month") : this.num(dt.month, 2);
          case "LLL":
            return month("short", true);
          case "LLLL":
            return month("long", true);
          case "LLLLL":
            return month("narrow", true);
          case "M":
            return useDateTimeFormatter ? string({
              month: "numeric"
            }, "month") : this.num(dt.month);
          case "MM":
            return useDateTimeFormatter ? string({
              month: "2-digit"
            }, "month") : this.num(dt.month, 2);
          case "MMM":
            return month("short", false);
          case "MMMM":
            return month("long", false);
          case "MMMMM":
            return month("narrow", false);
          case "y":
            return useDateTimeFormatter ? string({
              year: "numeric"
            }, "year") : this.num(dt.year);
          case "yy":
            return useDateTimeFormatter ? string({
              year: "2-digit"
            }, "year") : this.num(dt.year.toString().slice(-2), 2);
          case "yyyy":
            return useDateTimeFormatter ? string({
              year: "numeric"
            }, "year") : this.num(dt.year, 4);
          case "yyyyyy":
            return useDateTimeFormatter ? string({
              year: "numeric"
            }, "year") : this.num(dt.year, 6);
          case "G":
            return era("short");
          case "GG":
            return era("long");
          case "GGGGG":
            return era("narrow");
          case "kk":
            return this.num(dt.weekYear.toString().slice(-2), 2);
          case "kkkk":
            return this.num(dt.weekYear, 4);
          case "W":
            return this.num(dt.weekNumber);
          case "WW":
            return this.num(dt.weekNumber, 2);
          case "o":
            return this.num(dt.ordinal);
          case "ooo":
            return this.num(dt.ordinal, 3);
          case "q":
            return this.num(dt.quarter);
          case "qq":
            return this.num(dt.quarter, 2);
          case "X":
            return this.num(Math.floor(dt.ts / 1e3));
          case "x":
            return this.num(dt.ts);
          default:
            return maybeMacro(token);
        }
      };
      return stringifyTokens(Formatter.parseFormat(fmt), tokenToString);
    }
    formatDurationFromString(dur, fmt) {
      const tokenToField = (token) => {
        switch (token[0]) {
          case "S":
            return "millisecond";
          case "s":
            return "second";
          case "m":
            return "minute";
          case "h":
            return "hour";
          case "d":
            return "day";
          case "M":
            return "month";
          case "y":
            return "year";
          default:
            return null;
        }
      }, tokenToString = (lildur) => (token) => {
        const mapped = tokenToField(token);
        if (mapped) {
          return this.num(lildur.get(mapped), token.length);
        } else {
          return token;
        }
      }, tokens = Formatter.parseFormat(fmt), realTokens = tokens.reduce((found, {
        literal,
        val
      }) => literal ? found : found.concat(val), []), collapsed = dur.shiftTo(...realTokens.map(tokenToField).filter((t) => t));
      return stringifyTokens(tokens, tokenToString(collapsed));
    }
  };
  var Invalid = class {
    constructor(reason, explanation) {
      this.reason = reason;
      this.explanation = explanation;
    }
    toMessage() {
      if (this.explanation) {
        return `${this.reason}: ${this.explanation}`;
      } else {
        return this.reason;
      }
    }
  };
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  var Zone = class {
    get type() {
      throw new ZoneIsAbstractError();
    }
    get name() {
      throw new ZoneIsAbstractError();
    }
    get universal() {
      throw new ZoneIsAbstractError();
    }
    offsetName(ts, opts) {
      throw new ZoneIsAbstractError();
    }
    formatOffset(ts, format) {
      throw new ZoneIsAbstractError();
    }
    offset(ts) {
      throw new ZoneIsAbstractError();
    }
    equals(otherZone) {
      throw new ZoneIsAbstractError();
    }
    get isValid() {
      throw new ZoneIsAbstractError();
    }
  };
  var singleton = null;
  var LocalZone = class extends Zone {
    static get instance() {
      if (singleton === null) {
        singleton = new LocalZone();
      }
      return singleton;
    }
    get type() {
      return "local";
    }
    get name() {
      if (hasIntl()) {
        return new Intl.DateTimeFormat().resolvedOptions().timeZone;
      } else
        return "local";
    }
    get universal() {
      return false;
    }
    offsetName(ts, {
      format,
      locale
    }) {
      return parseZoneInfo(ts, format, locale);
    }
    formatOffset(ts, format) {
      return formatOffset(this.offset(ts), format);
    }
    offset(ts) {
      return -new Date(ts).getTimezoneOffset();
    }
    equals(otherZone) {
      return otherZone.type === "local";
    }
    get isValid() {
      return true;
    }
  };
  var matchingRegex = RegExp(`^${ianaRegex.source}$`);
  var dtfCache = {};
  function makeDTF(zone) {
    if (!dtfCache[zone]) {
      dtfCache[zone] = new Intl.DateTimeFormat("en-US", {
        hour12: false,
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }
    return dtfCache[zone];
  }
  var typeToPos = {
    year: 0,
    month: 1,
    day: 2,
    hour: 3,
    minute: 4,
    second: 5
  };
  function hackyOffset(dtf, date) {
    const formatted = dtf.format(date).replace(/\u200E/g, ""), parsed = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted), [, fMonth, fDay, fYear, fHour, fMinute, fSecond] = parsed;
    return [fYear, fMonth, fDay, fHour, fMinute, fSecond];
  }
  function partsOffset(dtf, date) {
    const formatted = dtf.formatToParts(date), filled = [];
    for (let i = 0; i < formatted.length; i++) {
      const {
        type,
        value
      } = formatted[i], pos = typeToPos[type];
      if (!isUndefined(pos)) {
        filled[pos] = parseInt(value, 10);
      }
    }
    return filled;
  }
  var ianaZoneCache = {};
  var IANAZone = class extends Zone {
    static create(name) {
      if (!ianaZoneCache[name]) {
        ianaZoneCache[name] = new IANAZone(name);
      }
      return ianaZoneCache[name];
    }
    static resetCache() {
      ianaZoneCache = {};
      dtfCache = {};
    }
    static isValidSpecifier(s2) {
      return !!(s2 && s2.match(matchingRegex));
    }
    static isValidZone(zone) {
      try {
        new Intl.DateTimeFormat("en-US", {
          timeZone: zone
        }).format();
        return true;
      } catch (e) {
        return false;
      }
    }
    static parseGMTOffset(specifier) {
      if (specifier) {
        const match2 = specifier.match(/^Etc\/GMT([+-]\d{1,2})$/i);
        if (match2) {
          return -60 * parseInt(match2[1]);
        }
      }
      return null;
    }
    constructor(name) {
      super();
      this.zoneName = name;
      this.valid = IANAZone.isValidZone(name);
    }
    get type() {
      return "iana";
    }
    get name() {
      return this.zoneName;
    }
    get universal() {
      return false;
    }
    offsetName(ts, {
      format,
      locale
    }) {
      return parseZoneInfo(ts, format, locale, this.name);
    }
    formatOffset(ts, format) {
      return formatOffset(this.offset(ts), format);
    }
    offset(ts) {
      const date = new Date(ts), dtf = makeDTF(this.name), [year, month, day, hour, minute, second] = dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date), adjustedHour = hour === 24 ? 0 : hour;
      const asUTC = objToLocalTS({
        year,
        month,
        day,
        hour: adjustedHour,
        minute,
        second,
        millisecond: 0
      });
      let asTS = +date;
      const over = asTS % 1e3;
      asTS -= over >= 0 ? over : 1e3 + over;
      return (asUTC - asTS) / (60 * 1e3);
    }
    equals(otherZone) {
      return otherZone.type === "iana" && otherZone.name === this.name;
    }
    get isValid() {
      return this.valid;
    }
  };
  var singleton$1 = null;
  var FixedOffsetZone = class extends Zone {
    static get utcInstance() {
      if (singleton$1 === null) {
        singleton$1 = new FixedOffsetZone(0);
      }
      return singleton$1;
    }
    static instance(offset2) {
      return offset2 === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset2);
    }
    static parseSpecifier(s2) {
      if (s2) {
        const r = s2.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
        if (r) {
          return new FixedOffsetZone(signedOffset(r[1], r[2]));
        }
      }
      return null;
    }
    constructor(offset2) {
      super();
      this.fixed = offset2;
    }
    get type() {
      return "fixed";
    }
    get name() {
      return this.fixed === 0 ? "UTC" : `UTC${formatOffset(this.fixed, "narrow")}`;
    }
    offsetName() {
      return this.name;
    }
    formatOffset(ts, format) {
      return formatOffset(this.fixed, format);
    }
    get universal() {
      return true;
    }
    offset() {
      return this.fixed;
    }
    equals(otherZone) {
      return otherZone.type === "fixed" && otherZone.fixed === this.fixed;
    }
    get isValid() {
      return true;
    }
  };
  var InvalidZone = class extends Zone {
    constructor(zoneName) {
      super();
      this.zoneName = zoneName;
    }
    get type() {
      return "invalid";
    }
    get name() {
      return this.zoneName;
    }
    get universal() {
      return false;
    }
    offsetName() {
      return null;
    }
    formatOffset() {
      return "";
    }
    offset() {
      return NaN;
    }
    equals() {
      return false;
    }
    get isValid() {
      return false;
    }
  };
  function normalizeZone(input, defaultZone2) {
    let offset2;
    if (isUndefined(input) || input === null) {
      return defaultZone2;
    } else if (input instanceof Zone) {
      return input;
    } else if (isString(input)) {
      const lowered = input.toLowerCase();
      if (lowered === "local")
        return defaultZone2;
      else if (lowered === "utc" || lowered === "gmt")
        return FixedOffsetZone.utcInstance;
      else if ((offset2 = IANAZone.parseGMTOffset(input)) != null) {
        return FixedOffsetZone.instance(offset2);
      } else if (IANAZone.isValidSpecifier(lowered))
        return IANAZone.create(input);
      else
        return FixedOffsetZone.parseSpecifier(lowered) || new InvalidZone(input);
    } else if (isNumber(input)) {
      return FixedOffsetZone.instance(input);
    } else if (typeof input === "object" && input.offset && typeof input.offset === "number") {
      return input;
    } else {
      return new InvalidZone(input);
    }
  }
  var now = () => Date.now();
  var defaultZone = null;
  var defaultLocale = null;
  var defaultNumberingSystem = null;
  var defaultOutputCalendar = null;
  var throwOnInvalid = false;
  var Settings = class {
    static get now() {
      return now;
    }
    static set now(n2) {
      now = n2;
    }
    static get defaultZoneName() {
      return Settings.defaultZone.name;
    }
    static set defaultZoneName(z) {
      if (!z) {
        defaultZone = null;
      } else {
        defaultZone = normalizeZone(z);
      }
    }
    static get defaultZone() {
      return defaultZone || LocalZone.instance;
    }
    static get defaultLocale() {
      return defaultLocale;
    }
    static set defaultLocale(locale) {
      defaultLocale = locale;
    }
    static get defaultNumberingSystem() {
      return defaultNumberingSystem;
    }
    static set defaultNumberingSystem(numberingSystem) {
      defaultNumberingSystem = numberingSystem;
    }
    static get defaultOutputCalendar() {
      return defaultOutputCalendar;
    }
    static set defaultOutputCalendar(outputCalendar) {
      defaultOutputCalendar = outputCalendar;
    }
    static get throwOnInvalid() {
      return throwOnInvalid;
    }
    static set throwOnInvalid(t) {
      throwOnInvalid = t;
    }
    static resetCaches() {
      Locale.resetCache();
      IANAZone.resetCache();
    }
  };
  var intlDTCache = {};
  function getCachedDTF(locString, opts = {}) {
    const key = JSON.stringify([locString, opts]);
    let dtf = intlDTCache[key];
    if (!dtf) {
      dtf = new Intl.DateTimeFormat(locString, opts);
      intlDTCache[key] = dtf;
    }
    return dtf;
  }
  var intlNumCache = {};
  function getCachedINF(locString, opts = {}) {
    const key = JSON.stringify([locString, opts]);
    let inf = intlNumCache[key];
    if (!inf) {
      inf = new Intl.NumberFormat(locString, opts);
      intlNumCache[key] = inf;
    }
    return inf;
  }
  var intlRelCache = {};
  function getCachedRTF(locString, opts = {}) {
    const cacheKeyOpts = _objectWithoutPropertiesLoose(opts, ["base"]);
    const key = JSON.stringify([locString, cacheKeyOpts]);
    let inf = intlRelCache[key];
    if (!inf) {
      inf = new Intl.RelativeTimeFormat(locString, opts);
      intlRelCache[key] = inf;
    }
    return inf;
  }
  var sysLocaleCache = null;
  function systemLocale() {
    if (sysLocaleCache) {
      return sysLocaleCache;
    } else if (hasIntl()) {
      const computedSys = new Intl.DateTimeFormat().resolvedOptions().locale;
      sysLocaleCache = !computedSys || computedSys === "und" ? "en-US" : computedSys;
      return sysLocaleCache;
    } else {
      sysLocaleCache = "en-US";
      return sysLocaleCache;
    }
  }
  function parseLocaleString(localeStr) {
    const uIndex = localeStr.indexOf("-u-");
    if (uIndex === -1) {
      return [localeStr];
    } else {
      let options;
      const smaller = localeStr.substring(0, uIndex);
      try {
        options = getCachedDTF(localeStr).resolvedOptions();
      } catch (e) {
        options = getCachedDTF(smaller).resolvedOptions();
      }
      const {
        numberingSystem,
        calendar
      } = options;
      return [smaller, numberingSystem, calendar];
    }
  }
  function intlConfigString(localeStr, numberingSystem, outputCalendar) {
    if (hasIntl()) {
      if (outputCalendar || numberingSystem) {
        localeStr += "-u";
        if (outputCalendar) {
          localeStr += `-ca-${outputCalendar}`;
        }
        if (numberingSystem) {
          localeStr += `-nu-${numberingSystem}`;
        }
        return localeStr;
      } else {
        return localeStr;
      }
    } else {
      return [];
    }
  }
  function mapMonths(f) {
    const ms = [];
    for (let i = 1; i <= 12; i++) {
      const dt = DateTime2.utc(2016, i, 1);
      ms.push(f(dt));
    }
    return ms;
  }
  function mapWeekdays(f) {
    const ms = [];
    for (let i = 1; i <= 7; i++) {
      const dt = DateTime2.utc(2016, 11, 13 + i);
      ms.push(f(dt));
    }
    return ms;
  }
  function listStuff(loc, length, defaultOK, englishFn, intlFn) {
    const mode = loc.listingMode(defaultOK);
    if (mode === "error") {
      return null;
    } else if (mode === "en") {
      return englishFn(length);
    } else {
      return intlFn(length);
    }
  }
  function supportsFastNumbers(loc) {
    if (loc.numberingSystem && loc.numberingSystem !== "latn") {
      return false;
    } else {
      return loc.numberingSystem === "latn" || !loc.locale || loc.locale.startsWith("en") || hasIntl() && new Intl.DateTimeFormat(loc.intl).resolvedOptions().numberingSystem === "latn";
    }
  }
  var PolyNumberFormatter = class {
    constructor(intl, forceSimple, opts) {
      this.padTo = opts.padTo || 0;
      this.floor = opts.floor || false;
      if (!forceSimple && hasIntl()) {
        const intlOpts = {
          useGrouping: false
        };
        if (opts.padTo > 0)
          intlOpts.minimumIntegerDigits = opts.padTo;
        this.inf = getCachedINF(intl, intlOpts);
      }
    }
    format(i) {
      if (this.inf) {
        const fixed = this.floor ? Math.floor(i) : i;
        return this.inf.format(fixed);
      } else {
        const fixed = this.floor ? Math.floor(i) : roundTo(i, 3);
        return padStart(fixed, this.padTo);
      }
    }
  };
  var PolyDateFormatter = class {
    constructor(dt, intl, opts) {
      this.opts = opts;
      this.hasIntl = hasIntl();
      let z;
      if (dt.zone.universal && this.hasIntl) {
        z = "UTC";
        if (opts.timeZoneName) {
          this.dt = dt;
        } else {
          this.dt = dt.offset === 0 ? dt : DateTime2.fromMillis(dt.ts + dt.offset * 60 * 1e3);
        }
      } else if (dt.zone.type === "local") {
        this.dt = dt;
      } else {
        this.dt = dt;
        z = dt.zone.name;
      }
      if (this.hasIntl) {
        const intlOpts = Object.assign({}, this.opts);
        if (z) {
          intlOpts.timeZone = z;
        }
        this.dtf = getCachedDTF(intl, intlOpts);
      }
    }
    format() {
      if (this.hasIntl) {
        return this.dtf.format(this.dt.toJSDate());
      } else {
        const tokenFormat = formatString(this.opts), loc = Locale.create("en-US");
        return Formatter.create(loc).formatDateTimeFromString(this.dt, tokenFormat);
      }
    }
    formatToParts() {
      if (this.hasIntl && hasFormatToParts()) {
        return this.dtf.formatToParts(this.dt.toJSDate());
      } else {
        return [];
      }
    }
    resolvedOptions() {
      if (this.hasIntl) {
        return this.dtf.resolvedOptions();
      } else {
        return {
          locale: "en-US",
          numberingSystem: "latn",
          outputCalendar: "gregory"
        };
      }
    }
  };
  var PolyRelFormatter = class {
    constructor(intl, isEnglish, opts) {
      this.opts = Object.assign({
        style: "long"
      }, opts);
      if (!isEnglish && hasRelative()) {
        this.rtf = getCachedRTF(intl, opts);
      }
    }
    format(count, unit) {
      if (this.rtf) {
        return this.rtf.format(count, unit);
      } else {
        return formatRelativeTime(unit, count, this.opts.numeric, this.opts.style !== "long");
      }
    }
    formatToParts(count, unit) {
      if (this.rtf) {
        return this.rtf.formatToParts(count, unit);
      } else {
        return [];
      }
    }
  };
  var Locale = class {
    static fromOpts(opts) {
      return Locale.create(opts.locale, opts.numberingSystem, opts.outputCalendar, opts.defaultToEN);
    }
    static create(locale, numberingSystem, outputCalendar, defaultToEN = false) {
      const specifiedLocale = locale || Settings.defaultLocale, localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale()), numberingSystemR = numberingSystem || Settings.defaultNumberingSystem, outputCalendarR = outputCalendar || Settings.defaultOutputCalendar;
      return new Locale(localeR, numberingSystemR, outputCalendarR, specifiedLocale);
    }
    static resetCache() {
      sysLocaleCache = null;
      intlDTCache = {};
      intlNumCache = {};
      intlRelCache = {};
    }
    static fromObject({
      locale,
      numberingSystem,
      outputCalendar
    } = {}) {
      return Locale.create(locale, numberingSystem, outputCalendar);
    }
    constructor(locale, numbering, outputCalendar, specifiedLocale) {
      const [parsedLocale, parsedNumberingSystem, parsedOutputCalendar] = parseLocaleString(locale);
      this.locale = parsedLocale;
      this.numberingSystem = numbering || parsedNumberingSystem || null;
      this.outputCalendar = outputCalendar || parsedOutputCalendar || null;
      this.intl = intlConfigString(this.locale, this.numberingSystem, this.outputCalendar);
      this.weekdaysCache = {
        format: {},
        standalone: {}
      };
      this.monthsCache = {
        format: {},
        standalone: {}
      };
      this.meridiemCache = null;
      this.eraCache = {};
      this.specifiedLocale = specifiedLocale;
      this.fastNumbersCached = null;
    }
    get fastNumbers() {
      if (this.fastNumbersCached == null) {
        this.fastNumbersCached = supportsFastNumbers(this);
      }
      return this.fastNumbersCached;
    }
    listingMode(defaultOK = true) {
      const intl = hasIntl(), hasFTP = intl && hasFormatToParts(), isActuallyEn = this.isEnglish(), hasNoWeirdness = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
      if (!hasFTP && !(isActuallyEn && hasNoWeirdness) && !defaultOK) {
        return "error";
      } else if (!hasFTP || isActuallyEn && hasNoWeirdness) {
        return "en";
      } else {
        return "intl";
      }
    }
    clone(alts) {
      if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
        return this;
      } else {
        return Locale.create(alts.locale || this.specifiedLocale, alts.numberingSystem || this.numberingSystem, alts.outputCalendar || this.outputCalendar, alts.defaultToEN || false);
      }
    }
    redefaultToEN(alts = {}) {
      return this.clone(Object.assign({}, alts, {
        defaultToEN: true
      }));
    }
    redefaultToSystem(alts = {}) {
      return this.clone(Object.assign({}, alts, {
        defaultToEN: false
      }));
    }
    months(length, format = false, defaultOK = true) {
      return listStuff(this, length, defaultOK, months, () => {
        const intl = format ? {
          month: length,
          day: "numeric"
        } : {
          month: length
        }, formatStr = format ? "format" : "standalone";
        if (!this.monthsCache[formatStr][length]) {
          this.monthsCache[formatStr][length] = mapMonths((dt) => this.extract(dt, intl, "month"));
        }
        return this.monthsCache[formatStr][length];
      });
    }
    weekdays(length, format = false, defaultOK = true) {
      return listStuff(this, length, defaultOK, weekdays, () => {
        const intl = format ? {
          weekday: length,
          year: "numeric",
          month: "long",
          day: "numeric"
        } : {
          weekday: length
        }, formatStr = format ? "format" : "standalone";
        if (!this.weekdaysCache[formatStr][length]) {
          this.weekdaysCache[formatStr][length] = mapWeekdays((dt) => this.extract(dt, intl, "weekday"));
        }
        return this.weekdaysCache[formatStr][length];
      });
    }
    meridiems(defaultOK = true) {
      return listStuff(this, void 0, defaultOK, () => meridiems, () => {
        if (!this.meridiemCache) {
          const intl = {
            hour: "numeric",
            hour12: true
          };
          this.meridiemCache = [DateTime2.utc(2016, 11, 13, 9), DateTime2.utc(2016, 11, 13, 19)].map((dt) => this.extract(dt, intl, "dayperiod"));
        }
        return this.meridiemCache;
      });
    }
    eras(length, defaultOK = true) {
      return listStuff(this, length, defaultOK, eras, () => {
        const intl = {
          era: length
        };
        if (!this.eraCache[length]) {
          this.eraCache[length] = [DateTime2.utc(-40, 1, 1), DateTime2.utc(2017, 1, 1)].map((dt) => this.extract(dt, intl, "era"));
        }
        return this.eraCache[length];
      });
    }
    extract(dt, intlOpts, field) {
      const df = this.dtFormatter(dt, intlOpts), results = df.formatToParts(), matching = results.find((m) => m.type.toLowerCase() === field);
      return matching ? matching.value : null;
    }
    numberFormatter(opts = {}) {
      return new PolyNumberFormatter(this.intl, opts.forceSimple || this.fastNumbers, opts);
    }
    dtFormatter(dt, intlOpts = {}) {
      return new PolyDateFormatter(dt, this.intl, intlOpts);
    }
    relFormatter(opts = {}) {
      return new PolyRelFormatter(this.intl, this.isEnglish(), opts);
    }
    isEnglish() {
      return this.locale === "en" || this.locale.toLowerCase() === "en-us" || hasIntl() && new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
    }
    equals(other) {
      return this.locale === other.locale && this.numberingSystem === other.numberingSystem && this.outputCalendar === other.outputCalendar;
    }
  };
  function combineRegexes(...regexes) {
    const full = regexes.reduce((f, r) => f + r.source, "");
    return RegExp(`^${full}$`);
  }
  function combineExtractors(...extractors) {
    return (m) => extractors.reduce(([mergedVals, mergedZone, cursor], ex) => {
      const [val, zone, next] = ex(m, cursor);
      return [Object.assign(mergedVals, val), mergedZone || zone, next];
    }, [{}, null, 1]).slice(0, 2);
  }
  function parse(s2, ...patterns) {
    if (s2 == null) {
      return [null, null];
    }
    for (const [regex, extractor] of patterns) {
      const m = regex.exec(s2);
      if (m) {
        return extractor(m);
      }
    }
    return [null, null];
  }
  function simpleParse(...keys) {
    return (match2, cursor) => {
      const ret = {};
      let i;
      for (i = 0; i < keys.length; i++) {
        ret[keys[i]] = parseInteger(match2[cursor + i]);
      }
      return [ret, null, cursor + i];
    };
  }
  var offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/;
  var isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/;
  var isoTimeRegex = RegExp(`${isoTimeBaseRegex.source}${offsetRegex.source}?`);
  var isoTimeExtensionRegex = RegExp(`(?:T${isoTimeRegex.source})?`);
  var isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/;
  var isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/;
  var isoOrdinalRegex = /(\d{4})-?(\d{3})/;
  var extractISOWeekData = simpleParse("weekYear", "weekNumber", "weekDay");
  var extractISOOrdinalData = simpleParse("year", "ordinal");
  var sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/;
  var sqlTimeRegex = RegExp(`${isoTimeBaseRegex.source} ?(?:${offsetRegex.source}|(${ianaRegex.source}))?`);
  var sqlTimeExtensionRegex = RegExp(`(?: ${sqlTimeRegex.source})?`);
  function int(match2, pos, fallback) {
    const m = match2[pos];
    return isUndefined(m) ? fallback : parseInteger(m);
  }
  function extractISOYmd(match2, cursor) {
    const item = {
      year: int(match2, cursor),
      month: int(match2, cursor + 1, 1),
      day: int(match2, cursor + 2, 1)
    };
    return [item, null, cursor + 3];
  }
  function extractISOTime(match2, cursor) {
    const item = {
      hour: int(match2, cursor, 0),
      minute: int(match2, cursor + 1, 0),
      second: int(match2, cursor + 2, 0),
      millisecond: parseMillis(match2[cursor + 3])
    };
    return [item, null, cursor + 4];
  }
  function extractISOOffset(match2, cursor) {
    const local = !match2[cursor] && !match2[cursor + 1], fullOffset = signedOffset(match2[cursor + 1], match2[cursor + 2]), zone = local ? null : FixedOffsetZone.instance(fullOffset);
    return [{}, zone, cursor + 3];
  }
  function extractIANAZone(match2, cursor) {
    const zone = match2[cursor] ? IANAZone.create(match2[cursor]) : null;
    return [{}, zone, cursor + 1];
  }
  var isoDuration = /^-?P(?:(?:(-?\d{1,9})Y)?(?:(-?\d{1,9})M)?(?:(-?\d{1,9})W)?(?:(-?\d{1,9})D)?(?:T(?:(-?\d{1,9})H)?(?:(-?\d{1,9})M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,9}))?S)?)?)$/;
  function extractISODuration(match2) {
    const [s2, yearStr, monthStr, weekStr, dayStr, hourStr, minuteStr, secondStr, millisecondsStr] = match2;
    const hasNegativePrefix = s2[0] === "-";
    const maybeNegate = (num) => num && hasNegativePrefix ? -num : num;
    return [{
      years: maybeNegate(parseInteger(yearStr)),
      months: maybeNegate(parseInteger(monthStr)),
      weeks: maybeNegate(parseInteger(weekStr)),
      days: maybeNegate(parseInteger(dayStr)),
      hours: maybeNegate(parseInteger(hourStr)),
      minutes: maybeNegate(parseInteger(minuteStr)),
      seconds: maybeNegate(parseInteger(secondStr)),
      milliseconds: maybeNegate(parseMillis(millisecondsStr))
    }];
  }
  var obsOffsets = {
    GMT: 0,
    EDT: -4 * 60,
    EST: -5 * 60,
    CDT: -5 * 60,
    CST: -6 * 60,
    MDT: -6 * 60,
    MST: -7 * 60,
    PDT: -7 * 60,
    PST: -8 * 60
  };
  function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
    const result = {
      year: yearStr.length === 2 ? untruncateYear(parseInteger(yearStr)) : parseInteger(yearStr),
      month: monthsShort.indexOf(monthStr) + 1,
      day: parseInteger(dayStr),
      hour: parseInteger(hourStr),
      minute: parseInteger(minuteStr)
    };
    if (secondStr)
      result.second = parseInteger(secondStr);
    if (weekdayStr) {
      result.weekday = weekdayStr.length > 3 ? weekdaysLong.indexOf(weekdayStr) + 1 : weekdaysShort.indexOf(weekdayStr) + 1;
    }
    return result;
  }
  var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
  function extractRFC2822(match2) {
    const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr, obsOffset, milOffset, offHourStr, offMinuteStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
    let offset2;
    if (obsOffset) {
      offset2 = obsOffsets[obsOffset];
    } else if (milOffset) {
      offset2 = 0;
    } else {
      offset2 = signedOffset(offHourStr, offMinuteStr);
    }
    return [result, new FixedOffsetZone(offset2)];
  }
  function preprocessRFC2822(s2) {
    return s2.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
  }
  var rfc1123 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/;
  var rfc850 = /^(Monday|Tuesday|Wedsday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/;
  var ascii = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
  function extractRFC1123Or850(match2) {
    const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
    return [result, FixedOffsetZone.utcInstance];
  }
  function extractASCII(match2) {
    const [, weekdayStr, monthStr, dayStr, hourStr, minuteStr, secondStr, yearStr] = match2, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
    return [result, FixedOffsetZone.utcInstance];
  }
  var isoYmdWithTimeExtensionRegex = combineRegexes(isoYmdRegex, isoTimeExtensionRegex);
  var isoWeekWithTimeExtensionRegex = combineRegexes(isoWeekRegex, isoTimeExtensionRegex);
  var isoOrdinalWithTimeExtensionRegex = combineRegexes(isoOrdinalRegex, isoTimeExtensionRegex);
  var isoTimeCombinedRegex = combineRegexes(isoTimeRegex);
  var extractISOYmdTimeAndOffset = combineExtractors(extractISOYmd, extractISOTime, extractISOOffset);
  var extractISOWeekTimeAndOffset = combineExtractors(extractISOWeekData, extractISOTime, extractISOOffset);
  var extractISOOrdinalDataAndTime = combineExtractors(extractISOOrdinalData, extractISOTime);
  var extractISOTimeAndOffset = combineExtractors(extractISOTime, extractISOOffset);
  function parseISODate(s2) {
    return parse(s2, [isoYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset], [isoWeekWithTimeExtensionRegex, extractISOWeekTimeAndOffset], [isoOrdinalWithTimeExtensionRegex, extractISOOrdinalDataAndTime], [isoTimeCombinedRegex, extractISOTimeAndOffset]);
  }
  function parseRFC2822Date(s2) {
    return parse(preprocessRFC2822(s2), [rfc2822, extractRFC2822]);
  }
  function parseHTTPDate(s2) {
    return parse(s2, [rfc1123, extractRFC1123Or850], [rfc850, extractRFC1123Or850], [ascii, extractASCII]);
  }
  function parseISODuration(s2) {
    return parse(s2, [isoDuration, extractISODuration]);
  }
  var sqlYmdWithTimeExtensionRegex = combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex);
  var sqlTimeCombinedRegex = combineRegexes(sqlTimeRegex);
  var extractISOYmdTimeOffsetAndIANAZone = combineExtractors(extractISOYmd, extractISOTime, extractISOOffset, extractIANAZone);
  var extractISOTimeOffsetAndIANAZone = combineExtractors(extractISOTime, extractISOOffset, extractIANAZone);
  function parseSQL(s2) {
    return parse(s2, [sqlYmdWithTimeExtensionRegex, extractISOYmdTimeOffsetAndIANAZone], [sqlTimeCombinedRegex, extractISOTimeOffsetAndIANAZone]);
  }
  var INVALID = "Invalid Duration";
  var lowOrderMatrix = {
    weeks: {
      days: 7,
      hours: 7 * 24,
      minutes: 7 * 24 * 60,
      seconds: 7 * 24 * 60 * 60,
      milliseconds: 7 * 24 * 60 * 60 * 1e3
    },
    days: {
      hours: 24,
      minutes: 24 * 60,
      seconds: 24 * 60 * 60,
      milliseconds: 24 * 60 * 60 * 1e3
    },
    hours: {
      minutes: 60,
      seconds: 60 * 60,
      milliseconds: 60 * 60 * 1e3
    },
    minutes: {
      seconds: 60,
      milliseconds: 60 * 1e3
    },
    seconds: {
      milliseconds: 1e3
    }
  };
  var casualMatrix = Object.assign({
    years: {
      quarters: 4,
      months: 12,
      weeks: 52,
      days: 365,
      hours: 365 * 24,
      minutes: 365 * 24 * 60,
      seconds: 365 * 24 * 60 * 60,
      milliseconds: 365 * 24 * 60 * 60 * 1e3
    },
    quarters: {
      months: 3,
      weeks: 13,
      days: 91,
      hours: 91 * 24,
      minutes: 91 * 24 * 60,
      seconds: 91 * 24 * 60 * 60,
      milliseconds: 91 * 24 * 60 * 60 * 1e3
    },
    months: {
      weeks: 4,
      days: 30,
      hours: 30 * 24,
      minutes: 30 * 24 * 60,
      seconds: 30 * 24 * 60 * 60,
      milliseconds: 30 * 24 * 60 * 60 * 1e3
    }
  }, lowOrderMatrix);
  var daysInYearAccurate = 146097 / 400;
  var daysInMonthAccurate = 146097 / 4800;
  var accurateMatrix = Object.assign({
    years: {
      quarters: 4,
      months: 12,
      weeks: daysInYearAccurate / 7,
      days: daysInYearAccurate,
      hours: daysInYearAccurate * 24,
      minutes: daysInYearAccurate * 24 * 60,
      seconds: daysInYearAccurate * 24 * 60 * 60,
      milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1e3
    },
    quarters: {
      months: 3,
      weeks: daysInYearAccurate / 28,
      days: daysInYearAccurate / 4,
      hours: daysInYearAccurate * 24 / 4,
      minutes: daysInYearAccurate * 24 * 60 / 4,
      seconds: daysInYearAccurate * 24 * 60 * 60 / 4,
      milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1e3 / 4
    },
    months: {
      weeks: daysInMonthAccurate / 7,
      days: daysInMonthAccurate,
      hours: daysInMonthAccurate * 24,
      minutes: daysInMonthAccurate * 24 * 60,
      seconds: daysInMonthAccurate * 24 * 60 * 60,
      milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1e3
    }
  }, lowOrderMatrix);
  var orderedUnits = ["years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];
  var reverseUnits = orderedUnits.slice(0).reverse();
  function clone(dur, alts, clear = false) {
    const conf = {
      values: clear ? alts.values : Object.assign({}, dur.values, alts.values || {}),
      loc: dur.loc.clone(alts.loc),
      conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy
    };
    return new Duration(conf);
  }
  function antiTrunc(n2) {
    return n2 < 0 ? Math.floor(n2) : Math.ceil(n2);
  }
  function convert(matrix, fromMap, fromUnit, toMap, toUnit) {
    const conv = matrix[toUnit][fromUnit], raw = fromMap[fromUnit] / conv, sameSign = Math.sign(raw) === Math.sign(toMap[toUnit]), added = !sameSign && toMap[toUnit] !== 0 && Math.abs(raw) <= 1 ? antiTrunc(raw) : Math.trunc(raw);
    toMap[toUnit] += added;
    fromMap[fromUnit] -= added * conv;
  }
  function normalizeValues(matrix, vals) {
    reverseUnits.reduce((previous, current) => {
      if (!isUndefined(vals[current])) {
        if (previous) {
          convert(matrix, vals, previous, vals, current);
        }
        return current;
      } else {
        return previous;
      }
    }, null);
  }
  var Duration = class {
    constructor(config) {
      const accurate = config.conversionAccuracy === "longterm" || false;
      this.values = config.values;
      this.loc = config.loc || Locale.create();
      this.conversionAccuracy = accurate ? "longterm" : "casual";
      this.invalid = config.invalid || null;
      this.matrix = accurate ? accurateMatrix : casualMatrix;
      this.isLuxonDuration = true;
    }
    static fromMillis(count, opts) {
      return Duration.fromObject(Object.assign({
        milliseconds: count
      }, opts));
    }
    static fromObject(obj) {
      if (obj == null || typeof obj !== "object") {
        throw new InvalidArgumentError(`Duration.fromObject: argument expected to be an object, got ${obj === null ? "null" : typeof obj}`);
      }
      return new Duration({
        values: normalizeObject(obj, Duration.normalizeUnit, [
          "locale",
          "numberingSystem",
          "conversionAccuracy",
          "zone"
        ]),
        loc: Locale.fromObject(obj),
        conversionAccuracy: obj.conversionAccuracy
      });
    }
    static fromISO(text, opts) {
      const [parsed] = parseISODuration(text);
      if (parsed) {
        const obj = Object.assign(parsed, opts);
        return Duration.fromObject(obj);
      } else {
        return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
      }
    }
    static invalid(reason, explanation = null) {
      if (!reason) {
        throw new InvalidArgumentError("need to specify a reason the Duration is invalid");
      }
      const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
      if (Settings.throwOnInvalid) {
        throw new InvalidDurationError(invalid);
      } else {
        return new Duration({
          invalid
        });
      }
    }
    static normalizeUnit(unit) {
      const normalized = {
        year: "years",
        years: "years",
        quarter: "quarters",
        quarters: "quarters",
        month: "months",
        months: "months",
        week: "weeks",
        weeks: "weeks",
        day: "days",
        days: "days",
        hour: "hours",
        hours: "hours",
        minute: "minutes",
        minutes: "minutes",
        second: "seconds",
        seconds: "seconds",
        millisecond: "milliseconds",
        milliseconds: "milliseconds"
      }[unit ? unit.toLowerCase() : unit];
      if (!normalized)
        throw new InvalidUnitError(unit);
      return normalized;
    }
    static isDuration(o) {
      return o && o.isLuxonDuration || false;
    }
    get locale() {
      return this.isValid ? this.loc.locale : null;
    }
    get numberingSystem() {
      return this.isValid ? this.loc.numberingSystem : null;
    }
    toFormat(fmt, opts = {}) {
      const fmtOpts = Object.assign({}, opts, {
        floor: opts.round !== false && opts.floor !== false
      });
      return this.isValid ? Formatter.create(this.loc, fmtOpts).formatDurationFromString(this, fmt) : INVALID;
    }
    toObject(opts = {}) {
      if (!this.isValid)
        return {};
      const base = Object.assign({}, this.values);
      if (opts.includeConfig) {
        base.conversionAccuracy = this.conversionAccuracy;
        base.numberingSystem = this.loc.numberingSystem;
        base.locale = this.loc.locale;
      }
      return base;
    }
    toISO() {
      if (!this.isValid)
        return null;
      let s2 = "P";
      if (this.years !== 0)
        s2 += this.years + "Y";
      if (this.months !== 0 || this.quarters !== 0)
        s2 += this.months + this.quarters * 3 + "M";
      if (this.weeks !== 0)
        s2 += this.weeks + "W";
      if (this.days !== 0)
        s2 += this.days + "D";
      if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0)
        s2 += "T";
      if (this.hours !== 0)
        s2 += this.hours + "H";
      if (this.minutes !== 0)
        s2 += this.minutes + "M";
      if (this.seconds !== 0 || this.milliseconds !== 0)
        s2 += roundTo(this.seconds + this.milliseconds / 1e3, 3) + "S";
      if (s2 === "P")
        s2 += "T0S";
      return s2;
    }
    toJSON() {
      return this.toISO();
    }
    toString() {
      return this.toISO();
    }
    valueOf() {
      return this.as("milliseconds");
    }
    plus(duration) {
      if (!this.isValid)
        return this;
      const dur = friendlyDuration(duration), result = {};
      for (const k of orderedUnits) {
        if (hasOwnProperty(dur.values, k) || hasOwnProperty(this.values, k)) {
          result[k] = dur.get(k) + this.get(k);
        }
      }
      return clone(this, {
        values: result
      }, true);
    }
    minus(duration) {
      if (!this.isValid)
        return this;
      const dur = friendlyDuration(duration);
      return this.plus(dur.negate());
    }
    mapUnits(fn) {
      if (!this.isValid)
        return this;
      const result = {};
      for (const k of Object.keys(this.values)) {
        result[k] = asNumber(fn(this.values[k], k));
      }
      return clone(this, {
        values: result
      }, true);
    }
    get(unit) {
      return this[Duration.normalizeUnit(unit)];
    }
    set(values) {
      if (!this.isValid)
        return this;
      const mixed = Object.assign(this.values, normalizeObject(values, Duration.normalizeUnit, []));
      return clone(this, {
        values: mixed
      });
    }
    reconfigure({
      locale,
      numberingSystem,
      conversionAccuracy
    } = {}) {
      const loc = this.loc.clone({
        locale,
        numberingSystem
      }), opts = {
        loc
      };
      if (conversionAccuracy) {
        opts.conversionAccuracy = conversionAccuracy;
      }
      return clone(this, opts);
    }
    as(unit) {
      return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
    }
    normalize() {
      if (!this.isValid)
        return this;
      const vals = this.toObject();
      normalizeValues(this.matrix, vals);
      return clone(this, {
        values: vals
      }, true);
    }
    shiftTo(...units) {
      if (!this.isValid)
        return this;
      if (units.length === 0) {
        return this;
      }
      units = units.map((u) => Duration.normalizeUnit(u));
      const built = {}, accumulated = {}, vals = this.toObject();
      let lastUnit;
      for (const k of orderedUnits) {
        if (units.indexOf(k) >= 0) {
          lastUnit = k;
          let own = 0;
          for (const ak in accumulated) {
            own += this.matrix[ak][k] * accumulated[ak];
            accumulated[ak] = 0;
          }
          if (isNumber(vals[k])) {
            own += vals[k];
          }
          const i = Math.trunc(own);
          built[k] = i;
          accumulated[k] = own - i;
          for (const down in vals) {
            if (orderedUnits.indexOf(down) > orderedUnits.indexOf(k)) {
              convert(this.matrix, vals, down, built, k);
            }
          }
        } else if (isNumber(vals[k])) {
          accumulated[k] = vals[k];
        }
      }
      for (const key in accumulated) {
        if (accumulated[key] !== 0) {
          built[lastUnit] += key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
        }
      }
      return clone(this, {
        values: built
      }, true).normalize();
    }
    negate() {
      if (!this.isValid)
        return this;
      const negated = {};
      for (const k of Object.keys(this.values)) {
        negated[k] = -this.values[k];
      }
      return clone(this, {
        values: negated
      }, true);
    }
    get years() {
      return this.isValid ? this.values.years || 0 : NaN;
    }
    get quarters() {
      return this.isValid ? this.values.quarters || 0 : NaN;
    }
    get months() {
      return this.isValid ? this.values.months || 0 : NaN;
    }
    get weeks() {
      return this.isValid ? this.values.weeks || 0 : NaN;
    }
    get days() {
      return this.isValid ? this.values.days || 0 : NaN;
    }
    get hours() {
      return this.isValid ? this.values.hours || 0 : NaN;
    }
    get minutes() {
      return this.isValid ? this.values.minutes || 0 : NaN;
    }
    get seconds() {
      return this.isValid ? this.values.seconds || 0 : NaN;
    }
    get milliseconds() {
      return this.isValid ? this.values.milliseconds || 0 : NaN;
    }
    get isValid() {
      return this.invalid === null;
    }
    get invalidReason() {
      return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
      return this.invalid ? this.invalid.explanation : null;
    }
    equals(other) {
      if (!this.isValid || !other.isValid) {
        return false;
      }
      if (!this.loc.equals(other.loc)) {
        return false;
      }
      for (const u of orderedUnits) {
        if (this.values[u] !== other.values[u]) {
          return false;
        }
      }
      return true;
    }
  };
  function friendlyDuration(durationish) {
    if (isNumber(durationish)) {
      return Duration.fromMillis(durationish);
    } else if (Duration.isDuration(durationish)) {
      return durationish;
    } else if (typeof durationish === "object") {
      return Duration.fromObject(durationish);
    } else {
      throw new InvalidArgumentError(`Unknown duration argument ${durationish} of type ${typeof durationish}`);
    }
  }
  var INVALID$1 = "Invalid Interval";
  function validateStartEnd(start, end) {
    if (!start || !start.isValid) {
      return Interval.invalid("missing or invalid start");
    } else if (!end || !end.isValid) {
      return Interval.invalid("missing or invalid end");
    } else if (end < start) {
      return Interval.invalid("end before start", `The end of an interval must be after its start, but you had start=${start.toISO()} and end=${end.toISO()}`);
    } else {
      return null;
    }
  }
  var Interval = class {
    constructor(config) {
      this.s = config.start;
      this.e = config.end;
      this.invalid = config.invalid || null;
      this.isLuxonInterval = true;
    }
    static invalid(reason, explanation = null) {
      if (!reason) {
        throw new InvalidArgumentError("need to specify a reason the Interval is invalid");
      }
      const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
      if (Settings.throwOnInvalid) {
        throw new InvalidIntervalError(invalid);
      } else {
        return new Interval({
          invalid
        });
      }
    }
    static fromDateTimes(start, end) {
      const builtStart = friendlyDateTime(start), builtEnd = friendlyDateTime(end);
      const validateError = validateStartEnd(builtStart, builtEnd);
      if (validateError == null) {
        return new Interval({
          start: builtStart,
          end: builtEnd
        });
      } else {
        return validateError;
      }
    }
    static after(start, duration) {
      const dur = friendlyDuration(duration), dt = friendlyDateTime(start);
      return Interval.fromDateTimes(dt, dt.plus(dur));
    }
    static before(end, duration) {
      const dur = friendlyDuration(duration), dt = friendlyDateTime(end);
      return Interval.fromDateTimes(dt.minus(dur), dt);
    }
    static fromISO(text, opts) {
      const [s2, e] = (text || "").split("/", 2);
      if (s2 && e) {
        let start, startIsValid;
        try {
          start = DateTime2.fromISO(s2, opts);
          startIsValid = start.isValid;
        } catch (e2) {
          startIsValid = false;
        }
        let end, endIsValid;
        try {
          end = DateTime2.fromISO(e, opts);
          endIsValid = end.isValid;
        } catch (e2) {
          endIsValid = false;
        }
        if (startIsValid && endIsValid) {
          return Interval.fromDateTimes(start, end);
        }
        if (startIsValid) {
          const dur = Duration.fromISO(e, opts);
          if (dur.isValid) {
            return Interval.after(start, dur);
          }
        } else if (endIsValid) {
          const dur = Duration.fromISO(s2, opts);
          if (dur.isValid) {
            return Interval.before(end, dur);
          }
        }
      }
      return Interval.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
    }
    static isInterval(o) {
      return o && o.isLuxonInterval || false;
    }
    get start() {
      return this.isValid ? this.s : null;
    }
    get end() {
      return this.isValid ? this.e : null;
    }
    get isValid() {
      return this.invalidReason === null;
    }
    get invalidReason() {
      return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
      return this.invalid ? this.invalid.explanation : null;
    }
    length(unit = "milliseconds") {
      return this.isValid ? this.toDuration(...[unit]).get(unit) : NaN;
    }
    count(unit = "milliseconds") {
      if (!this.isValid)
        return NaN;
      const start = this.start.startOf(unit), end = this.end.startOf(unit);
      return Math.floor(end.diff(start, unit).get(unit)) + 1;
    }
    hasSame(unit) {
      return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, unit) : false;
    }
    isEmpty() {
      return this.s.valueOf() === this.e.valueOf();
    }
    isAfter(dateTime) {
      if (!this.isValid)
        return false;
      return this.s > dateTime;
    }
    isBefore(dateTime) {
      if (!this.isValid)
        return false;
      return this.e <= dateTime;
    }
    contains(dateTime) {
      if (!this.isValid)
        return false;
      return this.s <= dateTime && this.e > dateTime;
    }
    set({
      start,
      end
    } = {}) {
      if (!this.isValid)
        return this;
      return Interval.fromDateTimes(start || this.s, end || this.e);
    }
    splitAt(...dateTimes) {
      if (!this.isValid)
        return [];
      const sorted = dateTimes.map(friendlyDateTime).filter((d) => this.contains(d)).sort(), results = [];
      let {
        s: s2
      } = this, i = 0;
      while (s2 < this.e) {
        const added = sorted[i] || this.e, next = +added > +this.e ? this.e : added;
        results.push(Interval.fromDateTimes(s2, next));
        s2 = next;
        i += 1;
      }
      return results;
    }
    splitBy(duration) {
      const dur = friendlyDuration(duration);
      if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
        return [];
      }
      let {
        s: s2
      } = this, added, next;
      const results = [];
      while (s2 < this.e) {
        added = s2.plus(dur);
        next = +added > +this.e ? this.e : added;
        results.push(Interval.fromDateTimes(s2, next));
        s2 = next;
      }
      return results;
    }
    divideEqually(numberOfParts) {
      if (!this.isValid)
        return [];
      return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
    }
    overlaps(other) {
      return this.e > other.s && this.s < other.e;
    }
    abutsStart(other) {
      if (!this.isValid)
        return false;
      return +this.e === +other.s;
    }
    abutsEnd(other) {
      if (!this.isValid)
        return false;
      return +other.e === +this.s;
    }
    engulfs(other) {
      if (!this.isValid)
        return false;
      return this.s <= other.s && this.e >= other.e;
    }
    equals(other) {
      if (!this.isValid || !other.isValid) {
        return false;
      }
      return this.s.equals(other.s) && this.e.equals(other.e);
    }
    intersection(other) {
      if (!this.isValid)
        return this;
      const s2 = this.s > other.s ? this.s : other.s, e = this.e < other.e ? this.e : other.e;
      if (s2 > e) {
        return null;
      } else {
        return Interval.fromDateTimes(s2, e);
      }
    }
    union(other) {
      if (!this.isValid)
        return this;
      const s2 = this.s < other.s ? this.s : other.s, e = this.e > other.e ? this.e : other.e;
      return Interval.fromDateTimes(s2, e);
    }
    static merge(intervals) {
      const [found, final] = intervals.sort((a, b) => a.s - b.s).reduce(([sofar, current], item) => {
        if (!current) {
          return [sofar, item];
        } else if (current.overlaps(item) || current.abutsStart(item)) {
          return [sofar, current.union(item)];
        } else {
          return [sofar.concat([current]), item];
        }
      }, [[], null]);
      if (final) {
        found.push(final);
      }
      return found;
    }
    static xor(intervals) {
      let start = null, currentCount = 0;
      const results = [], ends = intervals.map((i) => [{
        time: i.s,
        type: "s"
      }, {
        time: i.e,
        type: "e"
      }]), flattened = Array.prototype.concat(...ends), arr = flattened.sort((a, b) => a.time - b.time);
      for (const i of arr) {
        currentCount += i.type === "s" ? 1 : -1;
        if (currentCount === 1) {
          start = i.time;
        } else {
          if (start && +start !== +i.time) {
            results.push(Interval.fromDateTimes(start, i.time));
          }
          start = null;
        }
      }
      return Interval.merge(results);
    }
    difference(...intervals) {
      return Interval.xor([this].concat(intervals)).map((i) => this.intersection(i)).filter((i) => i && !i.isEmpty());
    }
    toString() {
      if (!this.isValid)
        return INVALID$1;
      return `[${this.s.toISO()} \u2013 ${this.e.toISO()})`;
    }
    toISO(opts) {
      if (!this.isValid)
        return INVALID$1;
      return `${this.s.toISO(opts)}/${this.e.toISO(opts)}`;
    }
    toISODate() {
      if (!this.isValid)
        return INVALID$1;
      return `${this.s.toISODate()}/${this.e.toISODate()}`;
    }
    toISOTime(opts) {
      if (!this.isValid)
        return INVALID$1;
      return `${this.s.toISOTime(opts)}/${this.e.toISOTime(opts)}`;
    }
    toFormat(dateFormat, {
      separator = " \u2013 "
    } = {}) {
      if (!this.isValid)
        return INVALID$1;
      return `${this.s.toFormat(dateFormat)}${separator}${this.e.toFormat(dateFormat)}`;
    }
    toDuration(unit, opts) {
      if (!this.isValid) {
        return Duration.invalid(this.invalidReason);
      }
      return this.e.diff(this.s, unit, opts);
    }
    mapEndpoints(mapFn) {
      return Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
    }
  };
  var Info = class {
    static hasDST(zone = Settings.defaultZone) {
      const proto = DateTime2.local().setZone(zone).set({
        month: 12
      });
      return !zone.universal && proto.offset !== proto.set({
        month: 6
      }).offset;
    }
    static isValidIANAZone(zone) {
      return IANAZone.isValidSpecifier(zone) && IANAZone.isValidZone(zone);
    }
    static normalizeZone(input) {
      return normalizeZone(input, Settings.defaultZone);
    }
    static months(length = "long", {
      locale = null,
      numberingSystem = null,
      outputCalendar = "gregory"
    } = {}) {
      return Locale.create(locale, numberingSystem, outputCalendar).months(length);
    }
    static monthsFormat(length = "long", {
      locale = null,
      numberingSystem = null,
      outputCalendar = "gregory"
    } = {}) {
      return Locale.create(locale, numberingSystem, outputCalendar).months(length, true);
    }
    static weekdays(length = "long", {
      locale = null,
      numberingSystem = null
    } = {}) {
      return Locale.create(locale, numberingSystem, null).weekdays(length);
    }
    static weekdaysFormat(length = "long", {
      locale = null,
      numberingSystem = null
    } = {}) {
      return Locale.create(locale, numberingSystem, null).weekdays(length, true);
    }
    static meridiems({
      locale = null
    } = {}) {
      return Locale.create(locale).meridiems();
    }
    static eras(length = "short", {
      locale = null
    } = {}) {
      return Locale.create(locale, null, "gregory").eras(length);
    }
    static features() {
      let intl = false, intlTokens = false, zones = false, relative = false;
      if (hasIntl()) {
        intl = true;
        intlTokens = hasFormatToParts();
        relative = hasRelative();
        try {
          zones = new Intl.DateTimeFormat("en", {
            timeZone: "America/New_York"
          }).resolvedOptions().timeZone === "America/New_York";
        } catch (e) {
          zones = false;
        }
      }
      return {
        intl,
        intlTokens,
        zones,
        relative
      };
    }
  };
  function dayDiff(earlier, later) {
    const utcDayStart = (dt) => dt.toUTC(0, {
      keepLocalTime: true
    }).startOf("day").valueOf(), ms = utcDayStart(later) - utcDayStart(earlier);
    return Math.floor(Duration.fromMillis(ms).as("days"));
  }
  function highOrderDiffs(cursor, later, units) {
    const differs = [["years", (a, b) => b.year - a.year], ["months", (a, b) => b.month - a.month + (b.year - a.year) * 12], ["weeks", (a, b) => {
      const days = dayDiff(a, b);
      return (days - days % 7) / 7;
    }], ["days", dayDiff]];
    const results = {};
    let lowestOrder, highWater;
    for (const [unit, differ] of differs) {
      if (units.indexOf(unit) >= 0) {
        lowestOrder = unit;
        let delta = differ(cursor, later);
        highWater = cursor.plus({
          [unit]: delta
        });
        if (highWater > later) {
          cursor = cursor.plus({
            [unit]: delta - 1
          });
          delta -= 1;
        } else {
          cursor = highWater;
        }
        results[unit] = delta;
      }
    }
    return [cursor, results, highWater, lowestOrder];
  }
  function diff(earlier, later, units, opts) {
    let [cursor, results, highWater, lowestOrder] = highOrderDiffs(earlier, later, units);
    const remainingMillis = later - cursor;
    const lowerOrderUnits = units.filter((u) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(u) >= 0);
    if (lowerOrderUnits.length === 0) {
      if (highWater < later) {
        highWater = cursor.plus({
          [lowestOrder]: 1
        });
      }
      if (highWater !== cursor) {
        results[lowestOrder] = (results[lowestOrder] || 0) + remainingMillis / (highWater - cursor);
      }
    }
    const duration = Duration.fromObject(Object.assign(results, opts));
    if (lowerOrderUnits.length > 0) {
      return Duration.fromMillis(remainingMillis, opts).shiftTo(...lowerOrderUnits).plus(duration);
    } else {
      return duration;
    }
  }
  var numberingSystems = {
    arab: "[\u0660-\u0669]",
    arabext: "[\u06F0-\u06F9]",
    bali: "[\u1B50-\u1B59]",
    beng: "[\u09E6-\u09EF]",
    deva: "[\u0966-\u096F]",
    fullwide: "[\uFF10-\uFF19]",
    gujr: "[\u0AE6-\u0AEF]",
    hanidec: "[\u3007|\u4E00|\u4E8C|\u4E09|\u56DB|\u4E94|\u516D|\u4E03|\u516B|\u4E5D]",
    khmr: "[\u17E0-\u17E9]",
    knda: "[\u0CE6-\u0CEF]",
    laoo: "[\u0ED0-\u0ED9]",
    limb: "[\u1946-\u194F]",
    mlym: "[\u0D66-\u0D6F]",
    mong: "[\u1810-\u1819]",
    mymr: "[\u1040-\u1049]",
    orya: "[\u0B66-\u0B6F]",
    tamldec: "[\u0BE6-\u0BEF]",
    telu: "[\u0C66-\u0C6F]",
    thai: "[\u0E50-\u0E59]",
    tibt: "[\u0F20-\u0F29]",
    latn: "\\d"
  };
  var numberingSystemsUTF16 = {
    arab: [1632, 1641],
    arabext: [1776, 1785],
    bali: [6992, 7001],
    beng: [2534, 2543],
    deva: [2406, 2415],
    fullwide: [65296, 65303],
    gujr: [2790, 2799],
    khmr: [6112, 6121],
    knda: [3302, 3311],
    laoo: [3792, 3801],
    limb: [6470, 6479],
    mlym: [3430, 3439],
    mong: [6160, 6169],
    mymr: [4160, 4169],
    orya: [2918, 2927],
    tamldec: [3046, 3055],
    telu: [3174, 3183],
    thai: [3664, 3673],
    tibt: [3872, 3881]
  };
  var hanidecChars = numberingSystems.hanidec.replace(/[\[|\]]/g, "").split("");
  function parseDigits(str) {
    let value = parseInt(str, 10);
    if (isNaN(value)) {
      value = "";
      for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (str[i].search(numberingSystems.hanidec) !== -1) {
          value += hanidecChars.indexOf(str[i]);
        } else {
          for (const key in numberingSystemsUTF16) {
            const [min, max] = numberingSystemsUTF16[key];
            if (code >= min && code <= max) {
              value += code - min;
            }
          }
        }
      }
      return parseInt(value, 10);
    } else {
      return value;
    }
  }
  function digitRegex({
    numberingSystem
  }, append = "") {
    return new RegExp(`${numberingSystems[numberingSystem || "latn"]}${append}`);
  }
  var MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";
  function intUnit(regex, post = (i) => i) {
    return {
      regex,
      deser: ([s2]) => post(parseDigits(s2))
    };
  }
  var NBSP = String.fromCharCode(160);
  var spaceOrNBSP = `( |${NBSP})`;
  var spaceOrNBSPRegExp = new RegExp(spaceOrNBSP, "g");
  function fixListRegex(s2) {
    return s2.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp, spaceOrNBSP);
  }
  function stripInsensitivities(s2) {
    return s2.replace(/\./g, "").replace(spaceOrNBSPRegExp, " ").toLowerCase();
  }
  function oneOf(strings, startIndex) {
    if (strings === null) {
      return null;
    } else {
      return {
        regex: RegExp(strings.map(fixListRegex).join("|")),
        deser: ([s2]) => strings.findIndex((i) => stripInsensitivities(s2) === stripInsensitivities(i)) + startIndex
      };
    }
  }
  function offset(regex, groups) {
    return {
      regex,
      deser: ([, h10, m]) => signedOffset(h10, m),
      groups
    };
  }
  function simple(regex) {
    return {
      regex,
      deser: ([s2]) => s2
    };
  }
  function escapeToken(value) {
    return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }
  function unitForToken(token, loc) {
    const one = digitRegex(loc), two = digitRegex(loc, "{2}"), three = digitRegex(loc, "{3}"), four = digitRegex(loc, "{4}"), six = digitRegex(loc, "{6}"), oneOrTwo = digitRegex(loc, "{1,2}"), oneToThree = digitRegex(loc, "{1,3}"), oneToSix = digitRegex(loc, "{1,6}"), oneToNine = digitRegex(loc, "{1,9}"), twoToFour = digitRegex(loc, "{2,4}"), fourToSix = digitRegex(loc, "{4,6}"), literal = (t) => ({
      regex: RegExp(escapeToken(t.val)),
      deser: ([s2]) => s2,
      literal: true
    }), unitate = (t) => {
      if (token.literal) {
        return literal(t);
      }
      switch (t.val) {
        case "G":
          return oneOf(loc.eras("short", false), 0);
        case "GG":
          return oneOf(loc.eras("long", false), 0);
        case "y":
          return intUnit(oneToSix);
        case "yy":
          return intUnit(twoToFour, untruncateYear);
        case "yyyy":
          return intUnit(four);
        case "yyyyy":
          return intUnit(fourToSix);
        case "yyyyyy":
          return intUnit(six);
        case "M":
          return intUnit(oneOrTwo);
        case "MM":
          return intUnit(two);
        case "MMM":
          return oneOf(loc.months("short", true, false), 1);
        case "MMMM":
          return oneOf(loc.months("long", true, false), 1);
        case "L":
          return intUnit(oneOrTwo);
        case "LL":
          return intUnit(two);
        case "LLL":
          return oneOf(loc.months("short", false, false), 1);
        case "LLLL":
          return oneOf(loc.months("long", false, false), 1);
        case "d":
          return intUnit(oneOrTwo);
        case "dd":
          return intUnit(two);
        case "o":
          return intUnit(oneToThree);
        case "ooo":
          return intUnit(three);
        case "HH":
          return intUnit(two);
        case "H":
          return intUnit(oneOrTwo);
        case "hh":
          return intUnit(two);
        case "h":
          return intUnit(oneOrTwo);
        case "mm":
          return intUnit(two);
        case "m":
          return intUnit(oneOrTwo);
        case "q":
          return intUnit(oneOrTwo);
        case "qq":
          return intUnit(two);
        case "s":
          return intUnit(oneOrTwo);
        case "ss":
          return intUnit(two);
        case "S":
          return intUnit(oneToThree);
        case "SSS":
          return intUnit(three);
        case "u":
          return simple(oneToNine);
        case "a":
          return oneOf(loc.meridiems(), 0);
        case "kkkk":
          return intUnit(four);
        case "kk":
          return intUnit(twoToFour, untruncateYear);
        case "W":
          return intUnit(oneOrTwo);
        case "WW":
          return intUnit(two);
        case "E":
        case "c":
          return intUnit(one);
        case "EEE":
          return oneOf(loc.weekdays("short", false, false), 1);
        case "EEEE":
          return oneOf(loc.weekdays("long", false, false), 1);
        case "ccc":
          return oneOf(loc.weekdays("short", true, false), 1);
        case "cccc":
          return oneOf(loc.weekdays("long", true, false), 1);
        case "Z":
        case "ZZ":
          return offset(new RegExp(`([+-]${oneOrTwo.source})(?::(${two.source}))?`), 2);
        case "ZZZ":
          return offset(new RegExp(`([+-]${oneOrTwo.source})(${two.source})?`), 2);
        case "z":
          return simple(/[a-z_+-/]{1,256}?/i);
        default:
          return literal(t);
      }
    };
    const unit = unitate(token) || {
      invalidReason: MISSING_FTP
    };
    unit.token = token;
    return unit;
  }
  var partTypeStyleToTokenVal = {
    year: {
      "2-digit": "yy",
      numeric: "yyyyy"
    },
    month: {
      numeric: "M",
      "2-digit": "MM",
      short: "MMM",
      long: "MMMM"
    },
    day: {
      numeric: "d",
      "2-digit": "dd"
    },
    weekday: {
      short: "EEE",
      long: "EEEE"
    },
    dayperiod: "a",
    dayPeriod: "a",
    hour: {
      numeric: "h",
      "2-digit": "hh"
    },
    minute: {
      numeric: "m",
      "2-digit": "mm"
    },
    second: {
      numeric: "s",
      "2-digit": "ss"
    }
  };
  function tokenForPart(part, locale, formatOpts) {
    const {
      type,
      value
    } = part;
    if (type === "literal") {
      return {
        literal: true,
        val: value
      };
    }
    const style = formatOpts[type];
    let val = partTypeStyleToTokenVal[type];
    if (typeof val === "object") {
      val = val[style];
    }
    if (val) {
      return {
        literal: false,
        val
      };
    }
    return void 0;
  }
  function buildRegex(units) {
    const re = units.map((u) => u.regex).reduce((f, r) => `${f}(${r.source})`, "");
    return [`^${re}$`, units];
  }
  function match(input, regex, handlers) {
    const matches = input.match(regex);
    if (matches) {
      const all = {};
      let matchIndex = 1;
      for (const i in handlers) {
        if (hasOwnProperty(handlers, i)) {
          const h10 = handlers[i], groups = h10.groups ? h10.groups + 1 : 1;
          if (!h10.literal && h10.token) {
            all[h10.token.val[0]] = h10.deser(matches.slice(matchIndex, matchIndex + groups));
          }
          matchIndex += groups;
        }
      }
      return [matches, all];
    } else {
      return [matches, {}];
    }
  }
  function dateTimeFromMatches(matches) {
    const toField = (token) => {
      switch (token) {
        case "S":
          return "millisecond";
        case "s":
          return "second";
        case "m":
          return "minute";
        case "h":
        case "H":
          return "hour";
        case "d":
          return "day";
        case "o":
          return "ordinal";
        case "L":
        case "M":
          return "month";
        case "y":
          return "year";
        case "E":
        case "c":
          return "weekday";
        case "W":
          return "weekNumber";
        case "k":
          return "weekYear";
        case "q":
          return "quarter";
        default:
          return null;
      }
    };
    let zone;
    if (!isUndefined(matches.Z)) {
      zone = new FixedOffsetZone(matches.Z);
    } else if (!isUndefined(matches.z)) {
      zone = IANAZone.create(matches.z);
    } else {
      zone = null;
    }
    if (!isUndefined(matches.q)) {
      matches.M = (matches.q - 1) * 3 + 1;
    }
    if (!isUndefined(matches.h)) {
      if (matches.h < 12 && matches.a === 1) {
        matches.h += 12;
      } else if (matches.h === 12 && matches.a === 0) {
        matches.h = 0;
      }
    }
    if (matches.G === 0 && matches.y) {
      matches.y = -matches.y;
    }
    if (!isUndefined(matches.u)) {
      matches.S = parseMillis(matches.u);
    }
    const vals = Object.keys(matches).reduce((r, k) => {
      const f = toField(k);
      if (f) {
        r[f] = matches[k];
      }
      return r;
    }, {});
    return [vals, zone];
  }
  var dummyDateTimeCache = null;
  function getDummyDateTime() {
    if (!dummyDateTimeCache) {
      dummyDateTimeCache = DateTime2.fromMillis(1555555555555);
    }
    return dummyDateTimeCache;
  }
  function maybeExpandMacroToken(token, locale) {
    if (token.literal) {
      return token;
    }
    const formatOpts = Formatter.macroTokenToFormatOpts(token.val);
    if (!formatOpts) {
      return token;
    }
    const formatter = Formatter.create(locale, formatOpts);
    const parts = formatter.formatDateTimeParts(getDummyDateTime());
    const tokens = parts.map((p) => tokenForPart(p, locale, formatOpts));
    if (tokens.includes(void 0)) {
      return token;
    }
    return tokens;
  }
  function expandMacroTokens(tokens, locale) {
    return Array.prototype.concat(...tokens.map((t) => maybeExpandMacroToken(t, locale)));
  }
  function explainFromTokens(locale, input, format) {
    const tokens = expandMacroTokens(Formatter.parseFormat(format), locale), units = tokens.map((t) => unitForToken(t, locale)), disqualifyingUnit = units.find((t) => t.invalidReason);
    if (disqualifyingUnit) {
      return {
        input,
        tokens,
        invalidReason: disqualifyingUnit.invalidReason
      };
    } else {
      const [regexString, handlers] = buildRegex(units), regex = RegExp(regexString, "i"), [rawMatches, matches] = match(input, regex, handlers), [result, zone] = matches ? dateTimeFromMatches(matches) : [null, null];
      if (hasOwnProperty(matches, "a") && hasOwnProperty(matches, "H")) {
        throw new ConflictingSpecificationError("Can't include meridiem when specifying 24-hour format");
      }
      return {
        input,
        tokens,
        regex,
        rawMatches,
        matches,
        result,
        zone
      };
    }
  }
  function parseFromTokens(locale, input, format) {
    const {
      result,
      zone,
      invalidReason
    } = explainFromTokens(locale, input, format);
    return [result, zone, invalidReason];
  }
  var nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
  function unitOutOfRange(unit, value) {
    return new Invalid("unit out of range", `you specified ${value} (of type ${typeof value}) as a ${unit}, which is invalid`);
  }
  function dayOfWeek(year, month, day) {
    const js = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    return js === 0 ? 7 : js;
  }
  function computeOrdinal(year, month, day) {
    return day + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
  }
  function uncomputeOrdinal(year, ordinal) {
    const table = isLeapYear(year) ? leapLadder : nonLeapLadder, month0 = table.findIndex((i) => i < ordinal), day = ordinal - table[month0];
    return {
      month: month0 + 1,
      day
    };
  }
  function gregorianToWeek(gregObj) {
    const {
      year,
      month,
      day
    } = gregObj, ordinal = computeOrdinal(year, month, day), weekday = dayOfWeek(year, month, day);
    let weekNumber = Math.floor((ordinal - weekday + 10) / 7), weekYear;
    if (weekNumber < 1) {
      weekYear = year - 1;
      weekNumber = weeksInWeekYear(weekYear);
    } else if (weekNumber > weeksInWeekYear(year)) {
      weekYear = year + 1;
      weekNumber = 1;
    } else {
      weekYear = year;
    }
    return Object.assign({
      weekYear,
      weekNumber,
      weekday
    }, timeObject(gregObj));
  }
  function weekToGregorian(weekData) {
    const {
      weekYear,
      weekNumber,
      weekday
    } = weekData, weekdayOfJan4 = dayOfWeek(weekYear, 1, 4), yearInDays = daysInYear(weekYear);
    let ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 3, year;
    if (ordinal < 1) {
      year = weekYear - 1;
      ordinal += daysInYear(year);
    } else if (ordinal > yearInDays) {
      year = weekYear + 1;
      ordinal -= daysInYear(weekYear);
    } else {
      year = weekYear;
    }
    const {
      month,
      day
    } = uncomputeOrdinal(year, ordinal);
    return Object.assign({
      year,
      month,
      day
    }, timeObject(weekData));
  }
  function gregorianToOrdinal(gregData) {
    const {
      year,
      month,
      day
    } = gregData, ordinal = computeOrdinal(year, month, day);
    return Object.assign({
      year,
      ordinal
    }, timeObject(gregData));
  }
  function ordinalToGregorian(ordinalData) {
    const {
      year,
      ordinal
    } = ordinalData, {
      month,
      day
    } = uncomputeOrdinal(year, ordinal);
    return Object.assign({
      year,
      month,
      day
    }, timeObject(ordinalData));
  }
  function hasInvalidWeekData(obj) {
    const validYear = isInteger(obj.weekYear), validWeek = integerBetween(obj.weekNumber, 1, weeksInWeekYear(obj.weekYear)), validWeekday = integerBetween(obj.weekday, 1, 7);
    if (!validYear) {
      return unitOutOfRange("weekYear", obj.weekYear);
    } else if (!validWeek) {
      return unitOutOfRange("week", obj.week);
    } else if (!validWeekday) {
      return unitOutOfRange("weekday", obj.weekday);
    } else
      return false;
  }
  function hasInvalidOrdinalData(obj) {
    const validYear = isInteger(obj.year), validOrdinal = integerBetween(obj.ordinal, 1, daysInYear(obj.year));
    if (!validYear) {
      return unitOutOfRange("year", obj.year);
    } else if (!validOrdinal) {
      return unitOutOfRange("ordinal", obj.ordinal);
    } else
      return false;
  }
  function hasInvalidGregorianData(obj) {
    const validYear = isInteger(obj.year), validMonth = integerBetween(obj.month, 1, 12), validDay = integerBetween(obj.day, 1, daysInMonth(obj.year, obj.month));
    if (!validYear) {
      return unitOutOfRange("year", obj.year);
    } else if (!validMonth) {
      return unitOutOfRange("month", obj.month);
    } else if (!validDay) {
      return unitOutOfRange("day", obj.day);
    } else
      return false;
  }
  function hasInvalidTimeData(obj) {
    const {
      hour,
      minute,
      second,
      millisecond
    } = obj;
    const validHour = integerBetween(hour, 0, 23) || hour === 24 && minute === 0 && second === 0 && millisecond === 0, validMinute = integerBetween(minute, 0, 59), validSecond = integerBetween(second, 0, 59), validMillisecond = integerBetween(millisecond, 0, 999);
    if (!validHour) {
      return unitOutOfRange("hour", hour);
    } else if (!validMinute) {
      return unitOutOfRange("minute", minute);
    } else if (!validSecond) {
      return unitOutOfRange("second", second);
    } else if (!validMillisecond) {
      return unitOutOfRange("millisecond", millisecond);
    } else
      return false;
  }
  var INVALID$2 = "Invalid DateTime";
  var MAX_DATE = 864e13;
  function unsupportedZone(zone) {
    return new Invalid("unsupported zone", `the zone "${zone.name}" is not supported`);
  }
  function possiblyCachedWeekData(dt) {
    if (dt.weekData === null) {
      dt.weekData = gregorianToWeek(dt.c);
    }
    return dt.weekData;
  }
  function clone$1(inst, alts) {
    const current = {
      ts: inst.ts,
      zone: inst.zone,
      c: inst.c,
      o: inst.o,
      loc: inst.loc,
      invalid: inst.invalid
    };
    return new DateTime2(Object.assign({}, current, alts, {
      old: current
    }));
  }
  function fixOffset(localTS, o, tz) {
    let utcGuess = localTS - o * 60 * 1e3;
    const o2 = tz.offset(utcGuess);
    if (o === o2) {
      return [utcGuess, o];
    }
    utcGuess -= (o2 - o) * 60 * 1e3;
    const o3 = tz.offset(utcGuess);
    if (o2 === o3) {
      return [utcGuess, o2];
    }
    return [localTS - Math.min(o2, o3) * 60 * 1e3, Math.max(o2, o3)];
  }
  function tsToObj(ts, offset2) {
    ts += offset2 * 60 * 1e3;
    const d = new Date(ts);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      day: d.getUTCDate(),
      hour: d.getUTCHours(),
      minute: d.getUTCMinutes(),
      second: d.getUTCSeconds(),
      millisecond: d.getUTCMilliseconds()
    };
  }
  function objToTS(obj, offset2, zone) {
    return fixOffset(objToLocalTS(obj), offset2, zone);
  }
  function adjustTime(inst, dur) {
    const oPre = inst.o, year = inst.c.year + Math.trunc(dur.years), month = inst.c.month + Math.trunc(dur.months) + Math.trunc(dur.quarters) * 3, c = Object.assign({}, inst.c, {
      year,
      month,
      day: Math.min(inst.c.day, daysInMonth(year, month)) + Math.trunc(dur.days) + Math.trunc(dur.weeks) * 7
    }), millisToAdd = Duration.fromObject({
      years: dur.years - Math.trunc(dur.years),
      quarters: dur.quarters - Math.trunc(dur.quarters),
      months: dur.months - Math.trunc(dur.months),
      weeks: dur.weeks - Math.trunc(dur.weeks),
      days: dur.days - Math.trunc(dur.days),
      hours: dur.hours,
      minutes: dur.minutes,
      seconds: dur.seconds,
      milliseconds: dur.milliseconds
    }).as("milliseconds"), localTS = objToLocalTS(c);
    let [ts, o] = fixOffset(localTS, oPre, inst.zone);
    if (millisToAdd !== 0) {
      ts += millisToAdd;
      o = inst.zone.offset(ts);
    }
    return {
      ts,
      o
    };
  }
  function parseDataToDateTime(parsed, parsedZone, opts, format, text) {
    const {
      setZone,
      zone
    } = opts;
    if (parsed && Object.keys(parsed).length !== 0) {
      const interpretationZone = parsedZone || zone, inst = DateTime2.fromObject(Object.assign(parsed, opts, {
        zone: interpretationZone,
        setZone: void 0
      }));
      return setZone ? inst : inst.setZone(zone);
    } else {
      return DateTime2.invalid(new Invalid("unparsable", `the input "${text}" can't be parsed as ${format}`));
    }
  }
  function toTechFormat(dt, format, allowZ = true) {
    return dt.isValid ? Formatter.create(Locale.create("en-US"), {
      allowZ,
      forceSimple: true
    }).formatDateTimeFromString(dt, format) : null;
  }
  function toTechTimeFormat(dt, {
    suppressSeconds = false,
    suppressMilliseconds = false,
    includeOffset,
    includeZone = false,
    spaceZone = false,
    format = "extended"
  }) {
    let fmt = format === "basic" ? "HHmm" : "HH:mm";
    if (!suppressSeconds || dt.second !== 0 || dt.millisecond !== 0) {
      fmt += format === "basic" ? "ss" : ":ss";
      if (!suppressMilliseconds || dt.millisecond !== 0) {
        fmt += ".SSS";
      }
    }
    if ((includeZone || includeOffset) && spaceZone) {
      fmt += " ";
    }
    if (includeZone) {
      fmt += "z";
    } else if (includeOffset) {
      fmt += format === "basic" ? "ZZZ" : "ZZ";
    }
    return toTechFormat(dt, fmt);
  }
  var defaultUnitValues = {
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
  var defaultWeekUnitValues = {
    weekNumber: 1,
    weekday: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
  var defaultOrdinalUnitValues = {
    ordinal: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  };
  var orderedUnits$1 = ["year", "month", "day", "hour", "minute", "second", "millisecond"];
  var orderedWeekUnits = ["weekYear", "weekNumber", "weekday", "hour", "minute", "second", "millisecond"];
  var orderedOrdinalUnits = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
  function normalizeUnit(unit) {
    const normalized = {
      year: "year",
      years: "year",
      month: "month",
      months: "month",
      day: "day",
      days: "day",
      hour: "hour",
      hours: "hour",
      minute: "minute",
      minutes: "minute",
      quarter: "quarter",
      quarters: "quarter",
      second: "second",
      seconds: "second",
      millisecond: "millisecond",
      milliseconds: "millisecond",
      weekday: "weekday",
      weekdays: "weekday",
      weeknumber: "weekNumber",
      weeksnumber: "weekNumber",
      weeknumbers: "weekNumber",
      weekyear: "weekYear",
      weekyears: "weekYear",
      ordinal: "ordinal"
    }[unit.toLowerCase()];
    if (!normalized)
      throw new InvalidUnitError(unit);
    return normalized;
  }
  function quickDT(obj, zone) {
    for (const u of orderedUnits$1) {
      if (isUndefined(obj[u])) {
        obj[u] = defaultUnitValues[u];
      }
    }
    const invalid = hasInvalidGregorianData(obj) || hasInvalidTimeData(obj);
    if (invalid) {
      return DateTime2.invalid(invalid);
    }
    const tsNow = Settings.now(), offsetProvis = zone.offset(tsNow), [ts, o] = objToTS(obj, offsetProvis, zone);
    return new DateTime2({
      ts,
      zone,
      o
    });
  }
  function diffRelative(start, end, opts) {
    const round = isUndefined(opts.round) ? true : opts.round, format = (c, unit) => {
      c = roundTo(c, round || opts.calendary ? 0 : 2, true);
      const formatter = end.loc.clone(opts).relFormatter(opts);
      return formatter.format(c, unit);
    }, differ = (unit) => {
      if (opts.calendary) {
        if (!end.hasSame(start, unit)) {
          return end.startOf(unit).diff(start.startOf(unit), unit).get(unit);
        } else
          return 0;
      } else {
        return end.diff(start, unit).get(unit);
      }
    };
    if (opts.unit) {
      return format(differ(opts.unit), opts.unit);
    }
    for (const unit of opts.units) {
      const count = differ(unit);
      if (Math.abs(count) >= 1) {
        return format(count, unit);
      }
    }
    return format(0, opts.units[opts.units.length - 1]);
  }
  var DateTime2 = class {
    constructor(config) {
      const zone = config.zone || Settings.defaultZone;
      let invalid = config.invalid || (Number.isNaN(config.ts) ? new Invalid("invalid input") : null) || (!zone.isValid ? unsupportedZone(zone) : null);
      this.ts = isUndefined(config.ts) ? Settings.now() : config.ts;
      let c = null, o = null;
      if (!invalid) {
        const unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone);
        if (unchanged) {
          [c, o] = [config.old.c, config.old.o];
        } else {
          const ot = zone.offset(this.ts);
          c = tsToObj(this.ts, ot);
          invalid = Number.isNaN(c.year) ? new Invalid("invalid input") : null;
          c = invalid ? null : c;
          o = invalid ? null : ot;
        }
      }
      this._zone = zone;
      this.loc = config.loc || Locale.create();
      this.invalid = invalid;
      this.weekData = null;
      this.c = c;
      this.o = o;
      this.isLuxonDateTime = true;
    }
    static local(year, month, day, hour, minute, second, millisecond) {
      if (isUndefined(year)) {
        return new DateTime2({
          ts: Settings.now()
        });
      } else {
        return quickDT({
          year,
          month,
          day,
          hour,
          minute,
          second,
          millisecond
        }, Settings.defaultZone);
      }
    }
    static utc(year, month, day, hour, minute, second, millisecond) {
      if (isUndefined(year)) {
        return new DateTime2({
          ts: Settings.now(),
          zone: FixedOffsetZone.utcInstance
        });
      } else {
        return quickDT({
          year,
          month,
          day,
          hour,
          minute,
          second,
          millisecond
        }, FixedOffsetZone.utcInstance);
      }
    }
    static fromJSDate(date, options = {}) {
      const ts = isDate(date) ? date.valueOf() : NaN;
      if (Number.isNaN(ts)) {
        return DateTime2.invalid("invalid input");
      }
      const zoneToUse = normalizeZone(options.zone, Settings.defaultZone);
      if (!zoneToUse.isValid) {
        return DateTime2.invalid(unsupportedZone(zoneToUse));
      }
      return new DateTime2({
        ts,
        zone: zoneToUse,
        loc: Locale.fromObject(options)
      });
    }
    static fromMillis(milliseconds, options = {}) {
      if (!isNumber(milliseconds)) {
        throw new InvalidArgumentError(`fromMillis requires a numerical input, but received a ${typeof milliseconds} with value ${milliseconds}`);
      } else if (milliseconds < -MAX_DATE || milliseconds > MAX_DATE) {
        return DateTime2.invalid("Timestamp out of range");
      } else {
        return new DateTime2({
          ts: milliseconds,
          zone: normalizeZone(options.zone, Settings.defaultZone),
          loc: Locale.fromObject(options)
        });
      }
    }
    static fromSeconds(seconds, options = {}) {
      if (!isNumber(seconds)) {
        throw new InvalidArgumentError("fromSeconds requires a numerical input");
      } else {
        return new DateTime2({
          ts: seconds * 1e3,
          zone: normalizeZone(options.zone, Settings.defaultZone),
          loc: Locale.fromObject(options)
        });
      }
    }
    static fromObject(obj) {
      const zoneToUse = normalizeZone(obj.zone, Settings.defaultZone);
      if (!zoneToUse.isValid) {
        return DateTime2.invalid(unsupportedZone(zoneToUse));
      }
      const tsNow = Settings.now(), offsetProvis = zoneToUse.offset(tsNow), normalized = normalizeObject(obj, normalizeUnit, ["zone", "locale", "outputCalendar", "numberingSystem"]), containsOrdinal = !isUndefined(normalized.ordinal), containsGregorYear = !isUndefined(normalized.year), containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber, loc = Locale.fromObject(obj);
      if ((containsGregor || containsOrdinal) && definiteWeekDef) {
        throw new ConflictingSpecificationError("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
      }
      if (containsGregorMD && containsOrdinal) {
        throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
      }
      const useWeekData = definiteWeekDef || normalized.weekday && !containsGregor;
      let units, defaultValues, objNow = tsToObj(tsNow, offsetProvis);
      if (useWeekData) {
        units = orderedWeekUnits;
        defaultValues = defaultWeekUnitValues;
        objNow = gregorianToWeek(objNow);
      } else if (containsOrdinal) {
        units = orderedOrdinalUnits;
        defaultValues = defaultOrdinalUnitValues;
        objNow = gregorianToOrdinal(objNow);
      } else {
        units = orderedUnits$1;
        defaultValues = defaultUnitValues;
      }
      let foundFirst = false;
      for (const u of units) {
        const v = normalized[u];
        if (!isUndefined(v)) {
          foundFirst = true;
        } else if (foundFirst) {
          normalized[u] = defaultValues[u];
        } else {
          normalized[u] = objNow[u];
        }
      }
      const higherOrderInvalid = useWeekData ? hasInvalidWeekData(normalized) : containsOrdinal ? hasInvalidOrdinalData(normalized) : hasInvalidGregorianData(normalized), invalid = higherOrderInvalid || hasInvalidTimeData(normalized);
      if (invalid) {
        return DateTime2.invalid(invalid);
      }
      const gregorian = useWeekData ? weekToGregorian(normalized) : containsOrdinal ? ordinalToGregorian(normalized) : normalized, [tsFinal, offsetFinal] = objToTS(gregorian, offsetProvis, zoneToUse), inst = new DateTime2({
        ts: tsFinal,
        zone: zoneToUse,
        o: offsetFinal,
        loc
      });
      if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
        return DateTime2.invalid("mismatched weekday", `you can't specify both a weekday of ${normalized.weekday} and a date of ${inst.toISO()}`);
      }
      return inst;
    }
    static fromISO(text, opts = {}) {
      const [vals, parsedZone] = parseISODate(text);
      return parseDataToDateTime(vals, parsedZone, opts, "ISO 8601", text);
    }
    static fromRFC2822(text, opts = {}) {
      const [vals, parsedZone] = parseRFC2822Date(text);
      return parseDataToDateTime(vals, parsedZone, opts, "RFC 2822", text);
    }
    static fromHTTP(text, opts = {}) {
      const [vals, parsedZone] = parseHTTPDate(text);
      return parseDataToDateTime(vals, parsedZone, opts, "HTTP", opts);
    }
    static fromFormat(text, fmt, opts = {}) {
      if (isUndefined(text) || isUndefined(fmt)) {
        throw new InvalidArgumentError("fromFormat requires an input string and a format");
      }
      const {
        locale = null,
        numberingSystem = null
      } = opts, localeToUse = Locale.fromOpts({
        locale,
        numberingSystem,
        defaultToEN: true
      }), [vals, parsedZone, invalid] = parseFromTokens(localeToUse, text, fmt);
      if (invalid) {
        return DateTime2.invalid(invalid);
      } else {
        return parseDataToDateTime(vals, parsedZone, opts, `format ${fmt}`, text);
      }
    }
    static fromString(text, fmt, opts = {}) {
      return DateTime2.fromFormat(text, fmt, opts);
    }
    static fromSQL(text, opts = {}) {
      const [vals, parsedZone] = parseSQL(text);
      return parseDataToDateTime(vals, parsedZone, opts, "SQL", text);
    }
    static invalid(reason, explanation = null) {
      if (!reason) {
        throw new InvalidArgumentError("need to specify a reason the DateTime is invalid");
      }
      const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
      if (Settings.throwOnInvalid) {
        throw new InvalidDateTimeError(invalid);
      } else {
        return new DateTime2({
          invalid
        });
      }
    }
    static isDateTime(o) {
      return o && o.isLuxonDateTime || false;
    }
    get(unit) {
      return this[unit];
    }
    get isValid() {
      return this.invalid === null;
    }
    get invalidReason() {
      return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
      return this.invalid ? this.invalid.explanation : null;
    }
    get locale() {
      return this.isValid ? this.loc.locale : null;
    }
    get numberingSystem() {
      return this.isValid ? this.loc.numberingSystem : null;
    }
    get outputCalendar() {
      return this.isValid ? this.loc.outputCalendar : null;
    }
    get zone() {
      return this._zone;
    }
    get zoneName() {
      return this.isValid ? this.zone.name : null;
    }
    get year() {
      return this.isValid ? this.c.year : NaN;
    }
    get quarter() {
      return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
    }
    get month() {
      return this.isValid ? this.c.month : NaN;
    }
    get day() {
      return this.isValid ? this.c.day : NaN;
    }
    get hour() {
      return this.isValid ? this.c.hour : NaN;
    }
    get minute() {
      return this.isValid ? this.c.minute : NaN;
    }
    get second() {
      return this.isValid ? this.c.second : NaN;
    }
    get millisecond() {
      return this.isValid ? this.c.millisecond : NaN;
    }
    get weekYear() {
      return this.isValid ? possiblyCachedWeekData(this).weekYear : NaN;
    }
    get weekNumber() {
      return this.isValid ? possiblyCachedWeekData(this).weekNumber : NaN;
    }
    get weekday() {
      return this.isValid ? possiblyCachedWeekData(this).weekday : NaN;
    }
    get ordinal() {
      return this.isValid ? gregorianToOrdinal(this.c).ordinal : NaN;
    }
    get monthShort() {
      return this.isValid ? Info.months("short", {
        locale: this.locale
      })[this.month - 1] : null;
    }
    get monthLong() {
      return this.isValid ? Info.months("long", {
        locale: this.locale
      })[this.month - 1] : null;
    }
    get weekdayShort() {
      return this.isValid ? Info.weekdays("short", {
        locale: this.locale
      })[this.weekday - 1] : null;
    }
    get weekdayLong() {
      return this.isValid ? Info.weekdays("long", {
        locale: this.locale
      })[this.weekday - 1] : null;
    }
    get offset() {
      return this.isValid ? +this.o : NaN;
    }
    get offsetNameShort() {
      if (this.isValid) {
        return this.zone.offsetName(this.ts, {
          format: "short",
          locale: this.locale
        });
      } else {
        return null;
      }
    }
    get offsetNameLong() {
      if (this.isValid) {
        return this.zone.offsetName(this.ts, {
          format: "long",
          locale: this.locale
        });
      } else {
        return null;
      }
    }
    get isOffsetFixed() {
      return this.isValid ? this.zone.universal : null;
    }
    get isInDST() {
      if (this.isOffsetFixed) {
        return false;
      } else {
        return this.offset > this.set({
          month: 1
        }).offset || this.offset > this.set({
          month: 5
        }).offset;
      }
    }
    get isInLeapYear() {
      return isLeapYear(this.year);
    }
    get daysInMonth() {
      return daysInMonth(this.year, this.month);
    }
    get daysInYear() {
      return this.isValid ? daysInYear(this.year) : NaN;
    }
    get weeksInWeekYear() {
      return this.isValid ? weeksInWeekYear(this.weekYear) : NaN;
    }
    resolvedLocaleOpts(opts = {}) {
      const {
        locale,
        numberingSystem,
        calendar
      } = Formatter.create(this.loc.clone(opts), opts).resolvedOptions(this);
      return {
        locale,
        numberingSystem,
        outputCalendar: calendar
      };
    }
    toUTC(offset2 = 0, opts = {}) {
      return this.setZone(FixedOffsetZone.instance(offset2), opts);
    }
    toLocal() {
      return this.setZone(Settings.defaultZone);
    }
    setZone(zone, {
      keepLocalTime = false,
      keepCalendarTime = false
    } = {}) {
      zone = normalizeZone(zone, Settings.defaultZone);
      if (zone.equals(this.zone)) {
        return this;
      } else if (!zone.isValid) {
        return DateTime2.invalid(unsupportedZone(zone));
      } else {
        let newTS = this.ts;
        if (keepLocalTime || keepCalendarTime) {
          const offsetGuess = zone.offset(this.ts);
          const asObj = this.toObject();
          [newTS] = objToTS(asObj, offsetGuess, zone);
        }
        return clone$1(this, {
          ts: newTS,
          zone
        });
      }
    }
    reconfigure({
      locale,
      numberingSystem,
      outputCalendar
    } = {}) {
      const loc = this.loc.clone({
        locale,
        numberingSystem,
        outputCalendar
      });
      return clone$1(this, {
        loc
      });
    }
    setLocale(locale) {
      return this.reconfigure({
        locale
      });
    }
    set(values) {
      if (!this.isValid)
        return this;
      const normalized = normalizeObject(values, normalizeUnit, []), settingWeekStuff = !isUndefined(normalized.weekYear) || !isUndefined(normalized.weekNumber) || !isUndefined(normalized.weekday);
      let mixed;
      if (settingWeekStuff) {
        mixed = weekToGregorian(Object.assign(gregorianToWeek(this.c), normalized));
      } else if (!isUndefined(normalized.ordinal)) {
        mixed = ordinalToGregorian(Object.assign(gregorianToOrdinal(this.c), normalized));
      } else {
        mixed = Object.assign(this.toObject(), normalized);
        if (isUndefined(normalized.day)) {
          mixed.day = Math.min(daysInMonth(mixed.year, mixed.month), mixed.day);
        }
      }
      const [ts, o] = objToTS(mixed, this.o, this.zone);
      return clone$1(this, {
        ts,
        o
      });
    }
    plus(duration) {
      if (!this.isValid)
        return this;
      const dur = friendlyDuration(duration);
      return clone$1(this, adjustTime(this, dur));
    }
    minus(duration) {
      if (!this.isValid)
        return this;
      const dur = friendlyDuration(duration).negate();
      return clone$1(this, adjustTime(this, dur));
    }
    startOf(unit) {
      if (!this.isValid)
        return this;
      const o = {}, normalizedUnit = Duration.normalizeUnit(unit);
      switch (normalizedUnit) {
        case "years":
          o.month = 1;
        case "quarters":
        case "months":
          o.day = 1;
        case "weeks":
        case "days":
          o.hour = 0;
        case "hours":
          o.minute = 0;
        case "minutes":
          o.second = 0;
        case "seconds":
          o.millisecond = 0;
          break;
      }
      if (normalizedUnit === "weeks") {
        o.weekday = 1;
      }
      if (normalizedUnit === "quarters") {
        const q = Math.ceil(this.month / 3);
        o.month = (q - 1) * 3 + 1;
      }
      return this.set(o);
    }
    endOf(unit) {
      return this.isValid ? this.plus({
        [unit]: 1
      }).startOf(unit).minus(1) : this;
    }
    toFormat(fmt, opts = {}) {
      return this.isValid ? Formatter.create(this.loc.redefaultToEN(opts)).formatDateTimeFromString(this, fmt) : INVALID$2;
    }
    toLocaleString(opts = DATE_SHORT) {
      return this.isValid ? Formatter.create(this.loc.clone(opts), opts).formatDateTime(this) : INVALID$2;
    }
    toLocaleParts(opts = {}) {
      return this.isValid ? Formatter.create(this.loc.clone(opts), opts).formatDateTimeParts(this) : [];
    }
    toISO(opts = {}) {
      if (!this.isValid) {
        return null;
      }
      return `${this.toISODate(opts)}T${this.toISOTime(opts)}`;
    }
    toISODate({
      format = "extended"
    } = {}) {
      let fmt = format === "basic" ? "yyyyMMdd" : "yyyy-MM-dd";
      if (this.year > 9999) {
        fmt = "+" + fmt;
      }
      return toTechFormat(this, fmt);
    }
    toISOWeekDate() {
      return toTechFormat(this, "kkkk-'W'WW-c");
    }
    toISOTime({
      suppressMilliseconds = false,
      suppressSeconds = false,
      includeOffset = true,
      format = "extended"
    } = {}) {
      return toTechTimeFormat(this, {
        suppressSeconds,
        suppressMilliseconds,
        includeOffset,
        format
      });
    }
    toRFC2822() {
      return toTechFormat(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", false);
    }
    toHTTP() {
      return toTechFormat(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
    }
    toSQLDate() {
      return toTechFormat(this, "yyyy-MM-dd");
    }
    toSQLTime({
      includeOffset = true,
      includeZone = false
    } = {}) {
      return toTechTimeFormat(this, {
        includeOffset,
        includeZone,
        spaceZone: true
      });
    }
    toSQL(opts = {}) {
      if (!this.isValid) {
        return null;
      }
      return `${this.toSQLDate()} ${this.toSQLTime(opts)}`;
    }
    toString() {
      return this.isValid ? this.toISO() : INVALID$2;
    }
    valueOf() {
      return this.toMillis();
    }
    toMillis() {
      return this.isValid ? this.ts : NaN;
    }
    toSeconds() {
      return this.isValid ? this.ts / 1e3 : NaN;
    }
    toJSON() {
      return this.toISO();
    }
    toBSON() {
      return this.toJSDate();
    }
    toObject(opts = {}) {
      if (!this.isValid)
        return {};
      const base = Object.assign({}, this.c);
      if (opts.includeConfig) {
        base.outputCalendar = this.outputCalendar;
        base.numberingSystem = this.loc.numberingSystem;
        base.locale = this.loc.locale;
      }
      return base;
    }
    toJSDate() {
      return new Date(this.isValid ? this.ts : NaN);
    }
    diff(otherDateTime, unit = "milliseconds", opts = {}) {
      if (!this.isValid || !otherDateTime.isValid) {
        return Duration.invalid(this.invalid || otherDateTime.invalid, "created by diffing an invalid DateTime");
      }
      const durOpts = Object.assign({
        locale: this.locale,
        numberingSystem: this.numberingSystem
      }, opts);
      const units = maybeArray(unit).map(Duration.normalizeUnit), otherIsLater = otherDateTime.valueOf() > this.valueOf(), earlier = otherIsLater ? this : otherDateTime, later = otherIsLater ? otherDateTime : this, diffed = diff(earlier, later, units, durOpts);
      return otherIsLater ? diffed.negate() : diffed;
    }
    diffNow(unit = "milliseconds", opts = {}) {
      return this.diff(DateTime2.local(), unit, opts);
    }
    until(otherDateTime) {
      return this.isValid ? Interval.fromDateTimes(this, otherDateTime) : this;
    }
    hasSame(otherDateTime, unit) {
      if (!this.isValid)
        return false;
      if (unit === "millisecond") {
        return this.valueOf() === otherDateTime.valueOf();
      } else {
        const inputMs = otherDateTime.valueOf();
        return this.startOf(unit) <= inputMs && inputMs <= this.endOf(unit);
      }
    }
    equals(other) {
      return this.isValid && other.isValid && this.valueOf() === other.valueOf() && this.zone.equals(other.zone) && this.loc.equals(other.loc);
    }
    toRelative(options = {}) {
      if (!this.isValid)
        return null;
      const base = options.base || DateTime2.fromObject({
        zone: this.zone
      }), padding = options.padding ? this < base ? -options.padding : options.padding : 0;
      return diffRelative(base, this.plus(padding), Object.assign(options, {
        numeric: "always",
        units: ["years", "months", "days", "hours", "minutes", "seconds"]
      }));
    }
    toRelativeCalendar(options = {}) {
      if (!this.isValid)
        return null;
      return diffRelative(options.base || DateTime2.fromObject({
        zone: this.zone
      }), this, Object.assign(options, {
        numeric: "auto",
        units: ["years", "months", "days"],
        calendary: true
      }));
    }
    static min(...dateTimes) {
      if (!dateTimes.every(DateTime2.isDateTime)) {
        throw new InvalidArgumentError("min requires all arguments be DateTimes");
      }
      return bestBy(dateTimes, (i) => i.valueOf(), Math.min);
    }
    static max(...dateTimes) {
      if (!dateTimes.every(DateTime2.isDateTime)) {
        throw new InvalidArgumentError("max requires all arguments be DateTimes");
      }
      return bestBy(dateTimes, (i) => i.valueOf(), Math.max);
    }
    static fromFormatExplain(text, fmt, options = {}) {
      const {
        locale = null,
        numberingSystem = null
      } = options, localeToUse = Locale.fromOpts({
        locale,
        numberingSystem,
        defaultToEN: true
      });
      return explainFromTokens(localeToUse, text, fmt);
    }
    static fromStringExplain(text, fmt, options = {}) {
      return DateTime2.fromFormatExplain(text, fmt, options);
    }
    static get DATE_SHORT() {
      return DATE_SHORT;
    }
    static get DATE_MED() {
      return DATE_MED;
    }
    static get DATE_MED_WITH_WEEKDAY() {
      return DATE_MED_WITH_WEEKDAY;
    }
    static get DATE_FULL() {
      return DATE_FULL;
    }
    static get DATE_HUGE() {
      return DATE_HUGE;
    }
    static get TIME_SIMPLE() {
      return TIME_SIMPLE;
    }
    static get TIME_WITH_SECONDS() {
      return TIME_WITH_SECONDS;
    }
    static get TIME_WITH_SHORT_OFFSET() {
      return TIME_WITH_SHORT_OFFSET;
    }
    static get TIME_WITH_LONG_OFFSET() {
      return TIME_WITH_LONG_OFFSET;
    }
    static get TIME_24_SIMPLE() {
      return TIME_24_SIMPLE;
    }
    static get TIME_24_WITH_SECONDS() {
      return TIME_24_WITH_SECONDS;
    }
    static get TIME_24_WITH_SHORT_OFFSET() {
      return TIME_24_WITH_SHORT_OFFSET;
    }
    static get TIME_24_WITH_LONG_OFFSET() {
      return TIME_24_WITH_LONG_OFFSET;
    }
    static get DATETIME_SHORT() {
      return DATETIME_SHORT;
    }
    static get DATETIME_SHORT_WITH_SECONDS() {
      return DATETIME_SHORT_WITH_SECONDS;
    }
    static get DATETIME_MED() {
      return DATETIME_MED;
    }
    static get DATETIME_MED_WITH_SECONDS() {
      return DATETIME_MED_WITH_SECONDS;
    }
    static get DATETIME_MED_WITH_WEEKDAY() {
      return DATETIME_MED_WITH_WEEKDAY;
    }
    static get DATETIME_FULL() {
      return DATETIME_FULL;
    }
    static get DATETIME_FULL_WITH_SECONDS() {
      return DATETIME_FULL_WITH_SECONDS;
    }
    static get DATETIME_HUGE() {
      return DATETIME_HUGE;
    }
    static get DATETIME_HUGE_WITH_SECONDS() {
      return DATETIME_HUGE_WITH_SECONDS;
    }
  };
  function friendlyDateTime(dateTimeish) {
    if (DateTime2.isDateTime(dateTimeish)) {
      return dateTimeish;
    } else if (dateTimeish && dateTimeish.valueOf && isNumber(dateTimeish.valueOf())) {
      return DateTime2.fromJSDate(dateTimeish);
    } else if (dateTimeish && typeof dateTimeish === "object") {
      return DateTime2.fromObject(dateTimeish);
    } else {
      throw new InvalidArgumentError(`Unknown datetime argument: ${dateTimeish}, of type ${typeof dateTimeish}`);
    }
  }
  exports2.DateTime = DateTime2;
  exports2.Duration = Duration;
  exports2.FixedOffsetZone = FixedOffsetZone;
  exports2.IANAZone = IANAZone;
  exports2.Info = Info;
  exports2.Interval = Interval;
  exports2.InvalidZone = InvalidZone;
  exports2.LocalZone = LocalZone;
  exports2.Settings = Settings;
  exports2.Zone = Zone;
});

// node_modules/reselect/lib/index.js
var require_lib = __commonJS((exports2) => {
  "use strict";
  exports2.__esModule = true;
  exports2.defaultMemoize = defaultMemoize;
  exports2.createSelectorCreator = createSelectorCreator;
  exports2.createStructuredSelector = createStructuredSelector;
  function defaultEqualityCheck(a, b) {
    return a === b;
  }
  function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
    if (prev === null || next === null || prev.length !== next.length) {
      return false;
    }
    var length = prev.length;
    for (var i = 0; i < length; i++) {
      if (!equalityCheck(prev[i], next[i])) {
        return false;
      }
    }
    return true;
  }
  function defaultMemoize(func) {
    var equalityCheck = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : defaultEqualityCheck;
    var lastArgs = null;
    var lastResult = null;
    return function() {
      if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
        lastResult = func.apply(null, arguments);
      }
      lastArgs = arguments;
      return lastResult;
    };
  }
  function getDependencies(funcs) {
    var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;
    if (!dependencies.every(function(dep) {
      return typeof dep === "function";
    })) {
      var dependencyTypes = dependencies.map(function(dep) {
        return typeof dep;
      }).join(", ");
      throw new Error("Selector creators expect all input-selectors to be functions, " + ("instead received the following types: [" + dependencyTypes + "]"));
    }
    return dependencies;
  }
  function createSelectorCreator(memoize) {
    for (var _len = arguments.length, memoizeOptions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      memoizeOptions[_key - 1] = arguments[_key];
    }
    return function() {
      for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        funcs[_key2] = arguments[_key2];
      }
      var recomputations = 0;
      var resultFunc = funcs.pop();
      var dependencies = getDependencies(funcs);
      var memoizedResultFunc = memoize.apply(void 0, [function() {
        recomputations++;
        return resultFunc.apply(null, arguments);
      }].concat(memoizeOptions));
      var selector = memoize(function() {
        var params = [];
        var length = dependencies.length;
        for (var i = 0; i < length; i++) {
          params.push(dependencies[i].apply(null, arguments));
        }
        return memoizedResultFunc.apply(null, params);
      });
      selector.resultFunc = resultFunc;
      selector.dependencies = dependencies;
      selector.recomputations = function() {
        return recomputations;
      };
      selector.resetRecomputations = function() {
        return recomputations = 0;
      };
      return selector;
    };
  }
  var createSelector = exports2.createSelector = createSelectorCreator(defaultMemoize);
  function createStructuredSelector(selectors) {
    var selectorCreator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : createSelector;
    if (typeof selectors !== "object") {
      throw new Error("createStructuredSelector expects first argument to be an object " + ("where each property is a selector, instead received a " + typeof selectors));
    }
    var objectKeys = Object.keys(selectors);
    return selectorCreator(objectKeys.map(function(key) {
      return selectors[key];
    }), function() {
      for (var _len3 = arguments.length, values = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        values[_key3] = arguments[_key3];
      }
      return values.reduce(function(composition, value, index) {
        composition[objectKeys[index]] = value;
        return composition;
      }, {});
    });
  }
});

// node_modules/re-reselect/lib/index.js
var require_lib2 = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  var reselect = require_lib();
  function isStringOrNumber(value) {
    return typeof value === "string" || typeof value === "number";
  }
  var FlatObjectCache = /* @__PURE__ */ function() {
    function FlatObjectCache2() {
      this._cache = {};
    }
    var _proto = FlatObjectCache2.prototype;
    _proto.set = function set(key, selectorFn) {
      this._cache[key] = selectorFn;
    };
    _proto.get = function get(key) {
      return this._cache[key];
    };
    _proto.remove = function remove(key) {
      delete this._cache[key];
    };
    _proto.clear = function clear() {
      this._cache = {};
    };
    _proto.isValidCacheKey = function isValidCacheKey(cacheKey) {
      return isStringOrNumber(cacheKey);
    };
    return FlatObjectCache2;
  }();
  var defaultCacheCreator = FlatObjectCache;
  var defaultCacheKeyValidator = function defaultCacheKeyValidator2() {
    return true;
  };
  function createCachedSelector2() {
    for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
      funcs[_key] = arguments[_key];
    }
    return function(polymorphicOptions, legacyOptions) {
      if (legacyOptions) {
        throw new Error('[re-reselect] "options" as second argument is not supported anymore. Please provide an option object as single argument.');
      }
      var options = typeof polymorphicOptions === "function" ? {
        keySelector: polymorphicOptions
      } : Object.assign({}, polymorphicOptions);
      var recomputations = 0;
      var resultFunc = funcs.pop();
      var dependencies = Array.isArray(funcs[0]) ? funcs[0] : [].concat(funcs);
      var resultFuncWithRecomputations = function resultFuncWithRecomputations2() {
        recomputations++;
        return resultFunc.apply(void 0, arguments);
      };
      funcs.push(resultFuncWithRecomputations);
      var cache = options.cacheObject || new defaultCacheCreator();
      var selectorCreator = options.selectorCreator || reselect.createSelector;
      var isValidCacheKey = cache.isValidCacheKey || defaultCacheKeyValidator;
      if (options.keySelectorCreator) {
        options.keySelector = options.keySelectorCreator({
          keySelector: options.keySelector,
          inputSelectors: dependencies,
          resultFunc
        });
      }
      var selector = function selector2() {
        var cacheKey = options.keySelector.apply(options, arguments);
        if (isValidCacheKey(cacheKey)) {
          var cacheResponse = cache.get(cacheKey);
          if (cacheResponse === void 0) {
            cacheResponse = selectorCreator.apply(void 0, funcs);
            cache.set(cacheKey, cacheResponse);
          }
          return cacheResponse.apply(void 0, arguments);
        }
        console.warn('[re-reselect] Invalid cache key "' + cacheKey + '" has been returned by keySelector function.');
        return void 0;
      };
      selector.getMatchingSelector = function() {
        var cacheKey = options.keySelector.apply(options, arguments);
        return cache.get(cacheKey);
      };
      selector.removeMatchingSelector = function() {
        var cacheKey = options.keySelector.apply(options, arguments);
        cache.remove(cacheKey);
      };
      selector.clearCache = function() {
        cache.clear();
      };
      selector.resultFunc = resultFunc;
      selector.dependencies = dependencies;
      selector.cache = cache;
      selector.recomputations = function() {
        return recomputations;
      };
      selector.resetRecomputations = function() {
        return recomputations = 0;
      };
      selector.keySelector = options.keySelector;
      return selector;
    };
  }
  function createStructuredCachedSelector(selectors) {
    return reselect.createStructuredSelector(selectors, createCachedSelector2);
  }
  function validateCacheSize(cacheSize) {
    if (cacheSize === void 0) {
      throw new Error('Missing the required property "cacheSize".');
    }
    if (!Number.isInteger(cacheSize) || cacheSize <= 0) {
      throw new Error('The "cacheSize" property must be a positive integer value.');
    }
  }
  var FifoObjectCache = /* @__PURE__ */ function() {
    function FifoObjectCache2(_temp) {
      var _ref = _temp === void 0 ? {} : _temp, cacheSize = _ref.cacheSize;
      validateCacheSize(cacheSize);
      this._cache = {};
      this._cacheOrdering = [];
      this._cacheSize = cacheSize;
    }
    var _proto = FifoObjectCache2.prototype;
    _proto.set = function set(key, selectorFn) {
      this._cache[key] = selectorFn;
      this._cacheOrdering.push(key);
      if (this._cacheOrdering.length > this._cacheSize) {
        var earliest = this._cacheOrdering[0];
        this.remove(earliest);
      }
    };
    _proto.get = function get(key) {
      return this._cache[key];
    };
    _proto.remove = function remove(key) {
      var index = this._cacheOrdering.indexOf(key);
      if (index > -1) {
        this._cacheOrdering.splice(index, 1);
      }
      delete this._cache[key];
    };
    _proto.clear = function clear() {
      this._cache = {};
      this._cacheOrdering = [];
    };
    _proto.isValidCacheKey = function isValidCacheKey(cacheKey) {
      return isStringOrNumber(cacheKey);
    };
    return FifoObjectCache2;
  }();
  var LruObjectCache = /* @__PURE__ */ function() {
    function LruObjectCache2(_temp) {
      var _ref = _temp === void 0 ? {} : _temp, cacheSize = _ref.cacheSize;
      validateCacheSize(cacheSize);
      this._cache = {};
      this._cacheOrdering = [];
      this._cacheSize = cacheSize;
    }
    var _proto = LruObjectCache2.prototype;
    _proto.set = function set(key, selectorFn) {
      this._cache[key] = selectorFn;
      this._registerCacheHit(key);
      if (this._cacheOrdering.length > this._cacheSize) {
        var earliest = this._cacheOrdering[0];
        this.remove(earliest);
      }
    };
    _proto.get = function get(key) {
      this._registerCacheHit(key);
      return this._cache[key];
    };
    _proto.remove = function remove(key) {
      this._deleteCacheHit(key);
      delete this._cache[key];
    };
    _proto.clear = function clear() {
      this._cache = {};
      this._cacheOrdering = [];
    };
    _proto._registerCacheHit = function _registerCacheHit(key) {
      this._deleteCacheHit(key);
      this._cacheOrdering.push(key);
    };
    _proto._deleteCacheHit = function _deleteCacheHit(key) {
      var index = this._cacheOrdering.indexOf(key);
      if (index > -1) {
        this._cacheOrdering.splice(index, 1);
      }
    };
    _proto.isValidCacheKey = function isValidCacheKey(cacheKey) {
      return isStringOrNumber(cacheKey);
    };
    return LruObjectCache2;
  }();
  var FlatMapCache = /* @__PURE__ */ function() {
    function FlatMapCache2() {
      this._cache = new Map();
    }
    var _proto = FlatMapCache2.prototype;
    _proto.set = function set(key, selectorFn) {
      this._cache.set(key, selectorFn);
    };
    _proto.get = function get(key) {
      return this._cache.get(key);
    };
    _proto.remove = function remove(key) {
      this._cache["delete"](key);
    };
    _proto.clear = function clear() {
      this._cache.clear();
    };
    return FlatMapCache2;
  }();
  var FifoMapCache = /* @__PURE__ */ function() {
    function FifoMapCache2(_temp) {
      var _ref = _temp === void 0 ? {} : _temp, cacheSize = _ref.cacheSize;
      validateCacheSize(cacheSize);
      this._cache = new Map();
      this._cacheSize = cacheSize;
    }
    var _proto = FifoMapCache2.prototype;
    _proto.set = function set(key, selectorFn) {
      this._cache.set(key, selectorFn);
      if (this._cache.size > this._cacheSize) {
        var earliest = this._cache.keys().next().value;
        this.remove(earliest);
      }
    };
    _proto.get = function get(key) {
      return this._cache.get(key);
    };
    _proto.remove = function remove(key) {
      this._cache["delete"](key);
    };
    _proto.clear = function clear() {
      this._cache.clear();
    };
    return FifoMapCache2;
  }();
  var LruMapCache = /* @__PURE__ */ function() {
    function LruMapCache2(_temp) {
      var _ref = _temp === void 0 ? {} : _temp, cacheSize = _ref.cacheSize;
      validateCacheSize(cacheSize);
      this._cache = new Map();
      this._cacheSize = cacheSize;
    }
    var _proto = LruMapCache2.prototype;
    _proto.set = function set(key, selectorFn) {
      this._cache.set(key, selectorFn);
      if (this._cache.size > this._cacheSize) {
        var earliest = this._cache.keys().next().value;
        this.remove(earliest);
      }
    };
    _proto.get = function get(key) {
      var value = this._cache.get(key);
      if (this._cache.has(key)) {
        this.remove(key);
        this._cache.set(key, value);
      }
      return value;
    };
    _proto.remove = function remove(key) {
      this._cache["delete"](key);
    };
    _proto.clear = function clear() {
      this._cache.clear();
    };
    return LruMapCache2;
  }();
  exports2.FifoMapCache = FifoMapCache;
  exports2.FifoObjectCache = FifoObjectCache;
  exports2.FlatMapCache = FlatMapCache;
  exports2.FlatObjectCache = FlatObjectCache;
  exports2.LruMapCache = LruMapCache;
  exports2.LruObjectCache = LruObjectCache;
  exports2.createCachedSelector = createCachedSelector2;
  exports2.createStructuredCachedSelector = createStructuredCachedSelector;
  exports2.default = createCachedSelector2;
});

// src/components/main.jsx
__export(exports, {
  default: () => Main
});
var import_preact9 = __toModule(require("preact"));
var import_hooks = __toModule(require("preact/hooks"));
var import_hammerjs = __toModule(require_hammer());

// src/components/download.jsx
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
var shiftTitle = {
  F: "Fr\xFChschicht\r\n6 - 14:30 Uhr",
  S: "Sp\xE4tschicht\r\n14 - 22:30 Uhr",
  N: "Nachtschicht\r\n22 - 6:30 Uhr (in den n\xE4chsten Tag)",
  K: null
};
var shift66Name = "6-6";
var shift64Name = "6-4";
var shiftWfW = "wfw";
var shiftAddedNight = "added-night";
var shiftAddedNight8 = "added-night-8";
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
var workingLongName = {
  F: "Fr\xFChschicht",
  S: "Sp\xE4tschicht",
  N: "Nachtschicht"
};

// src/components/download.jsx
var urls = {
  [shift66Name]: [
    "/assets/6-6_gruppe_1.ics",
    "/assets/6-6_gruppe_2.ics",
    "/assets/6-6_gruppe_3.ics",
    "/assets/6-6_gruppe_4.ics",
    "/assets/6-6_gruppe_5.ics",
    "/assets/6-6_gruppe_6.ics"
  ],
  [shift64Name]: [
    "/assets/6-4_gruppe_1.ics",
    "/assets/6-4_gruppe_2.ics",
    "/assets/6-4_gruppe_3.ics",
    "/assets/6-4_gruppe_4.ics",
    "/assets/6-4_gruppe_5.ics"
  ],
  [shiftWfW]: [
    "/assets/wfw_gruppe_1.ics",
    "/assets/wfw_gruppe_2.ics",
    "/assets/wfw_gruppe_3.ics",
    "/assets/wfw_gruppe_4.ics",
    "/assets/wfw_gruppe_5.ics",
    "/assets/wfw_gruppe_6.ics"
  ],
  [shiftAddedNight]: [
    "/assets/nacht_gruppe_1.ics",
    "/assets/nacht_gruppe_2.ics",
    "/assets/nacht_gruppe_3.ics"
  ]
};
function Download({shiftModel}) {
  if (!(shiftModel in urls)) {
    return /* @__PURE__ */ import_preact.h("div", {
      class: "my-4 mx-auto p-4 text-center bg-gray-300 text-gray-900 rounded"
    }, "F\xFCr dieses Schichtmodell sind die Kalender noch in Arbeit");
  }
  return /* @__PURE__ */ import_preact.h("div", {
    class: "my-4 mx-auto px-1"
  }, /* @__PURE__ */ import_preact.h("section", {
    class: "p-4 pt-2 text-center bg-gray-300 text-gray-900 rounded"
  }, /* @__PURE__ */ import_preact.h("h4", {
    class: "text-xl font-semibold"
  }, "Downloade einen ", shiftModelText[shiftModel], " Kalender"), /* @__PURE__ */ import_preact.h("p", {
    class: "py-2"
  }, "F\xFCge deine Schichtgruppe zu deiner Kalender-App hinzu!"), urls[shiftModel].map((href, index) => {
    const group = index + 1;
    return /* @__PURE__ */ import_preact.h("a", {
      key: shiftModel + group,
      class: "inline-block text-blue-800 underline" + (index === 0 ? "" : " ml-2"),
      href,
      download: `${shiftModelText[shiftModel]} - Gruppe ${group}.ics`,
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Gruppe ", group);
  })));
}

// src/components/footer.jsx
var import_preact2 = __toModule(require("preact"));
var import_preact_router = __toModule(require_preact_router());
function Footer() {
  return /* @__PURE__ */ import_preact2.h("p", {
    class: "mt-4 mb-3 text-center text-xs"
  }, /* @__PURE__ */ import_preact2.h("b", null, "Der inoffizielle Schichtkalender f\xFCr Bosch Reutlingen."), /* @__PURE__ */ import_preact2.h("br", null), "Made by Christopher Astfalk.", /* @__PURE__ */ import_preact2.h("br", null), "Dieser Kalender wird ", /* @__PURE__ */ import_preact2.h("strong", null, /* @__PURE__ */ import_preact2.h("em", null, "nicht")), " von der Robert Bosch GmbH\u2122\uFE0F bereitgestellt. Robert Bosch GmbH\u2122\uFE0F haftet nicht f\xFCr den Inhalt dieser Seite.", /* @__PURE__ */ import_preact2.h("br", null), "Alle Angaben sind ohne Gew\xE4hr.", /* @__PURE__ */ import_preact2.h("br", null), "Alle Daten werden nur lokal gespeichert! Und nicht an einen Server \xFCbertragen. Deswegen gibt es keine Cookie Meldung.", /* @__PURE__ */ import_preact2.h("br", null), "Lizenz: ", /* @__PURE__ */ import_preact2.h("a", {
    href: "https://www.mozilla.org/en-US/MPL/2.0/",
    class: "inline-block text-blue-700 underline",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Mozilla Public License 2.0"), /* @__PURE__ */ import_preact2.h("br", null), /* @__PURE__ */ import_preact2.h(import_preact_router.Link, {
    class: "inline-block text-blue-700 underline",
    href: "/impressum/",
    tabIndex: "0",
    onClick: () => {
      window.scrollTo(0, 0);
    }
  }, "Impressum"));
}

// src/components/month.jsx
var import_preact8 = __toModule(require("preact"));

// src/components/month-body.jsx
var import_preact7 = __toModule(require("preact"));
var import_luxon = __toModule(require_luxon());

// src/components/cells/week.jsx
var import_preact3 = __toModule(require("preact"));
function WeekCell({time}) {
  return /* @__PURE__ */ import_preact3.h("td", {
    class: "text-gray-800 bg-white border-r border-black border",
    rowSpan: Math.min(7 - time.weekday, time.daysInMonth - time.day) + 1
  }, /* @__PURE__ */ import_preact3.h("span", {
    class: "sr-only"
  }, "Woche ", time.weekNumber), /* @__PURE__ */ import_preact3.h("span", {
    "aria-hidden": "true"
  }, time.weekNumber));
}

// src/components/cells/dayInMonth.jsx
var import_preact4 = __toModule(require("preact"));
function DayInMonthCell({
  time,
  holidayData,
  dayLightSaving,
  isToday,
  isSearchResult,
  isWeekCellStart
}) {
  const isDayLightSaving = dayLightSaving != null && dayLightSaving.day === time.day;
  const border = isToday || isSearchResult ? `${isWeekCellStart ? "" : "border-l-4"} border-t-4 border-b-4` : "border-l";
  const borderColor = isSearchResult ? "border-violet-400" : "border-black";
  let holidayStyle = "";
  if (isDayLightSaving) {
    holidayStyle = "bg-yellow-300 text-black cursor-help border-4 border-red-600";
  } else if (holidayData != null && ["holiday", "school"].includes(holidayData.type)) {
    holidayStyle = "bg-teal-400 text-black";
  }
  return /* @__PURE__ */ import_preact4.h("td", {
    class: `${borderColor} ${border} ${holidayStyle}`,
    title: isDayLightSaving ? dayLightSaving.name : holidayData != null ? holidayData.name : null
  }, /* @__PURE__ */ import_preact4.h("time", {
    dateTime: time.toISODate()
  }, time.day));
}

// src/components/cells/weekDay.jsx
var import_preact5 = __toModule(require("preact"));
function WeekDayCell({time, isToday, isSearchResult}) {
  let border = "";
  if (isSearchResult) {
    border = "border-t-4 border-b-4 border-violet-400";
  } else if (isToday) {
    border = "border-t-4 border-b-4 border-black";
  }
  return /* @__PURE__ */ import_preact5.h("td", {
    class: border
  }, /* @__PURE__ */ import_preact5.h("span", {
    class: "sr-only"
  }, time.weekdayLong), /* @__PURE__ */ import_preact5.h("span", {
    "aria-hidden": "true"
  }, time.weekdayShort));
}

// src/components/cells/groupShift.jsx
var import_preact6 = __toModule(require("preact"));
function GroupShiftCell({group, shift, isToday, isSearchResult}) {
  let border = "";
  if (isSearchResult) {
    border = "border-t-4 border-b-4 border-violet-400";
  } else if (isToday) {
    border = "border-t-4 border-b-4 border-black";
  }
  const groupColors = [
    "bg-group-1",
    "bg-group-2",
    "bg-group-3",
    "bg-group-4",
    "bg-group-5",
    "bg-group-6"
  ];
  const workStyle = shift !== "K" ? groupColors[group] : "";
  const title = isToday ? "Heute " + shiftTitle[shift] : shiftTitle[shift];
  return /* @__PURE__ */ import_preact6.h("td", {
    class: `text-black ${border} ${workStyle}`,
    title
  }, shift !== "K" && /* @__PURE__ */ import_preact6.h(import_preact6.Fragment, null, /* @__PURE__ */ import_preact6.h("span", {
    class: "sr-only"
  }, workingLongName[shift]), /* @__PURE__ */ import_preact6.h("span", {
    "aria-hidden": "true"
  }, shift)));
}

// src/components/month-body.jsx
function MonthBody({year, month, data, today, search, group}) {
  const todayInThisMonth = today != null && today[0] === year && today[1] === month;
  const dayRows = data.days.map((dayShiftsData, index) => {
    const thatDay = index + 1;
    const time = import_luxon.DateTime.fromObject({year, month: month + 1, day: thatDay, locale: "de-DE"});
    const weekDay = time.weekday;
    const holidayData = data.holidays[thatDay];
    const shifts = group === 0 ? dayShiftsData : dayShiftsData.slice(group - 1, group);
    const isToday = todayInThisMonth && (thatDay === today[2] || today[3] < 6 && thatDay + 1 === today[2]);
    const isSearchResult = search === thatDay;
    let border = "";
    if (isSearchResult) {
      border = "border-r-4 border-violet-400";
    } else if (isToday) {
      border = "border-r-4 border-black";
    }
    const isWeekend = [0, 6, 7].includes(weekDay);
    const isClosingHoliday = holidayData != null && holidayData.type === "closing";
    let background = "";
    if (isClosingHoliday) {
      background = "bg-green-700 text-white";
    } else if (isWeekend) {
      background = "bg-gray-300";
    }
    return /* @__PURE__ */ import_preact7.h("tr", {
      key: index,
      class: `${border} ${background}`,
      title: holidayData != null && holidayData.type === "closing" ? holidayData.name : void 0
    }, (weekDay === 1 || index === 0) && /* @__PURE__ */ import_preact7.h(WeekCell, {
      time
    }), /* @__PURE__ */ import_preact7.h(DayInMonthCell, {
      time,
      holidayData,
      dayLightSaving: data.holidays.daylightSavingSwitch,
      isToday,
      isSearchResult,
      isWeekCellStart: weekDay === 1 || index === 0
    }), /* @__PURE__ */ import_preact7.h(WeekDayCell, {
      time,
      isToday,
      isSearchResult
    }), shifts.map((shift, index2, all) => {
      const gr = group === 0 ? index2 : group - 1;
      return /* @__PURE__ */ import_preact7.h(GroupShiftCell, {
        key: gr,
        group: gr,
        shift,
        isToday,
        isSearchResult
      });
    }));
  });
  return /* @__PURE__ */ import_preact7.h("tbody", null, dayRows);
}

// src/components/month.jsx
var Month = class extends import_preact8.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return [
      "year",
      "month",
      "data",
      "today",
      "search",
      "group"
    ].some((key) => this.props[key] !== nextProps[key]);
  }
  render({year, month, data, today, search, group}) {
    const groups = [];
    if (group === 0) {
      for (let i = 0, max = data.workingCount.length; i < max; ++i) {
        groups.push(i);
      }
    } else {
      groups.push(group - 1);
    }
    const isToday = today != null && today[0] === year && today[1] === month;
    return /* @__PURE__ */ import_preact8.h("table", {
      id: `month_${year}-${month + 1}`,
      class: "mt-8 xl:mt-0 border border-black border-collapse text-center",
      "aria-labelledby": `month_${year}-${month + 1}_caption`
    }, /* @__PURE__ */ import_preact8.h("caption", {
      id: `month_${year}-${month + 1}_caption`,
      class: isToday ? "border border-b-0 border-black bg-gray-300 text-black font-bold" : "font-bold"
    }, monthNames[month], " ", year, isToday ? " (Jetzt)" : ""), /* @__PURE__ */ import_preact8.h("thead", null, /* @__PURE__ */ import_preact8.h("tr", null, /* @__PURE__ */ import_preact8.h("th", null, /* @__PURE__ */ import_preact8.h("span", {
      class: "sr-only"
    }, "Woche"), /* @__PURE__ */ import_preact8.h("span", {
      "aria-hidden": "true",
      title: "Woche"
    }, "Wo")), /* @__PURE__ */ import_preact8.h("th", {
      title: "Tag im Monat",
      "aria-label": "Tag im Monat"
    }, "Tag"), /* @__PURE__ */ import_preact8.h("th", {
      title: "Wochentag"
    }, /* @__PURE__ */ import_preact8.h("span", {
      class: "sr-only"
    }, "Wochentag")), groups.map((gr) => /* @__PURE__ */ import_preact8.h("th", {
      key: gr
    }, /* @__PURE__ */ import_preact8.h("span", {
      class: "sr-only"
    }, "Gruppe " + (gr + 1)), /* @__PURE__ */ import_preact8.h("span", {
      "aria-hidden": "true",
      title: "Gruppe " + (gr + 1)
    }, "Gr. ", gr + 1))))), /* @__PURE__ */ import_preact8.h(MonthBody, {
      year,
      month,
      data,
      today,
      search,
      group
    }), /* @__PURE__ */ import_preact8.h("tfoot", {
      class: "text-sm font-bold"
    }, /* @__PURE__ */ import_preact8.h("tr", null, /* @__PURE__ */ import_preact8.h("td", {
      class: "border border-black p-1 cursor-help",
      colSpan: "3",
      title: "Summe der Tage an denen eine Schichtgruppe diesen Monat arbeitet."
    }, "Summe"), groups.map((gr) => /* @__PURE__ */ import_preact8.h("td", {
      key: gr,
      "aria-label": "Summe Arbeitstage"
    }, data.workingCount[gr])))));
  }
};
var month_default = Month;

// src/lib/select-month-data.js
var import_re_reselect = __toModule(require_lib2());

// src/lib/utils.js
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
var isSSR = (() => {
  try {
    const isBrowser = "document" in window && "navigator" in window;
    return !isBrowser;
  } catch (err) {
    return true;
  }
})();

// src/lib/workdata.js
function getMonthData(year, month, shiftModel) {
  switch (shiftModel) {
    case shiftAddedNight:
      return getAddedNightModel(year, month);
    case shiftAddedNight8:
      return getAddedNight8Model(year, month);
    case shiftWfW:
      return getWfWModel(year, month);
    case shift64Name:
      return get64Model(year, month);
    case shift66Name:
    default:
      return get66Model(year, month);
  }
}
function get66Model(year, month) {
  const daysData = [];
  const groupsWorkingDays = [0, 0, 0, 0, 0, 0];
  const isOldModel = year < 2010 || year === 2010 && month < 3;
  const isOnSwitch = year === 2010 && month === 3;
  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = isOldModel || isOnSwitch && i < 3 ? get44ModelDay(year, month, i + 1) : get12DayCycleModelDay(year, month, i + 1, [3, 0, 2, 5, 1, 4]);
    daysData.push(aDay);
    aDay.forEach((isWorking, gr) => {
      if (isWorking !== "K") {
        groupsWorkingDays[gr] += 1;
      }
    });
  }
  return {
    days: daysData,
    workingCount: groupsWorkingDays
  };
}
function get64Model(year, month) {
  const daysData = [];
  const groupsWorkingDays = [0, 0, 0, 0, 0];
  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = get64ModelDay(year, month, i + 1);
    daysData.push(aDay);
    aDay.forEach((isWorking, gr) => {
      if (isWorking !== "K") {
        groupsWorkingDays[gr] += 1;
      }
    });
  }
  return {
    days: daysData,
    workingCount: groupsWorkingDays
  };
}
function getWfWModel(year, month) {
  const daysData = [];
  const groupsWorkingDays = [0, 0, 0, 0, 0, 0];
  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = get12DayCycleModelDay(year, month, i + 1, [3, 2, 1, 0, 5, 4]);
    daysData.push(aDay);
    aDay.forEach((isWorking, gr) => {
      if (isWorking !== "K") {
        groupsWorkingDays[gr] += 1;
      }
    });
  }
  return {
    days: daysData,
    workingCount: groupsWorkingDays
  };
}
function get12DayCycleModelDay(year, month, day, groupOffsets) {
  const time = new Date(year, month, day, 0, 0, 0, 0).getTime();
  const daysInCycle = Math.floor(time / 1e3 / 60 / 60 / 24 / 2) % 6;
  return groupOffsets.map((offset) => {
    let shiftDay = daysInCycle + offset;
    if (shiftDay > 5) {
      shiftDay -= 6;
    }
    switch (shiftDay) {
      case 0:
        return "F";
      case 1:
        return "S";
      case 2:
        return "N";
      default:
        return "K";
    }
  });
}
function get64ModelDay(year, month, day) {
  const time = new Date(year, month, day, 0, 0, 0, 0).getTime();
  const daysInCycle = Math.floor(time / 1e3 / 60 / 60 / 24 / 2) % 5;
  return [2, 3, 4, 0, 1].map((offset, group) => {
    let shiftDay = daysInCycle + offset;
    if (shiftDay > 4) {
      shiftDay -= 5;
    }
    if (group >= 2) {
      switch (shiftDay) {
        case 0:
          return "F";
        case 1:
          return "S";
        case 2:
          return "N";
        default:
          return "K";
      }
    }
    switch (shiftDay) {
      case 0:
        return group === 1 ? "F" : "S";
      case 1:
        return group === 1 ? "F" : "N";
      case 2:
        return group === 1 ? "S" : "N";
      default:
        return "K";
    }
  });
}
function get44ModelDay(year, month, day) {
  const time = new Date(year, month, day, 0, 0, 0, 0).getTime();
  const daysInCycle = time / 1e3 / 60 / 60 / 24 % 24;
  return [14, 10, 6, 2, 22, 18].map((offset) => {
    let shiftDay = Math.floor((daysInCycle + offset) / 4);
    if (shiftDay > 5) {
      shiftDay -= 6;
    }
    switch (shiftDay) {
      case 0:
        return "N";
      case 2:
        return "S";
      case 4:
        return "F";
      default:
        return "K";
    }
  });
}
function getAddedNightModel(year, month) {
  const daysData = [];
  const groupsWorkingDays = [0, 0, 0];
  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = getAddedNightModelDay(year, month, i + 1);
    daysData.push(aDay);
    aDay.forEach((isWorking, gr) => {
      if (isWorking !== "K") {
        groupsWorkingDays[gr] += 1;
      }
    });
  }
  return {
    days: daysData,
    workingCount: groupsWorkingDays
  };
}
function getAddedNightModelDay(year, month, day) {
  const time = new Date(year, month, day, 0, 0, 0, 0).getTime();
  const daysInCycle = Math.floor(time / 1e3 / 60 / 60 / 24) % 21;
  return [3, 17, 10].map((offset) => {
    let shiftDay = daysInCycle + offset;
    if (shiftDay > 20) {
      shiftDay -= 21;
    }
    switch (shiftDay) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 5:
      case 6:
      case 7:
      case 8:
      case 12:
      case 13:
      case 16:
      case 17:
        return "N";
      default:
        return "K";
    }
  });
}
function getAddedNight8Model(year, month) {
  const daysData = [];
  const groupsWorkingDays = [0, 0, 0];
  for (let i = 0, days = getDaysInMonth(year, month); i < days; ++i) {
    const aDay = getAddedNight8ModelDay(year, month, i + 1);
    daysData.push(aDay);
    aDay.forEach((isWorking, gr) => {
      if (isWorking !== "K") {
        groupsWorkingDays[gr] += 1;
      }
    });
  }
  return {
    days: daysData,
    workingCount: groupsWorkingDays
  };
}
function getAddedNight8ModelDay(year, month, day) {
  const dateTime = new Date(year, month, day, 0, 0, 0, 0);
  const weekDay = dateTime.getDay();
  const weeksInCycle = Math.floor((dateTime.getTime() / 1e3 / 60 / 60 / 24 + 54) / 7) % 16;
  return [0, 1, 2].map((gr) => {
    switch (weeksInCycle) {
      case 0:
      case 2:
      case 4:
      case 6:
        if (weekDay === 0 || weekDay === 6) {
          return "K";
        } else {
          return gr === 0 ? "S" : "F";
        }
      case 1:
      case 3:
      case 5:
      case 7:
        if (weekDay === 0 || weekDay === 6) {
          return "K";
        } else {
          return gr === 0 ? "F" : "S";
        }
      default: {
        const shiftDay = weekDay - gr;
        return shiftDay < 4 && shiftDay >= 0 ? "N" : "K";
      }
    }
  });
}

// src/lib/ferien.js
var ferien = [
  {
    start: "2019-04-15T00:00",
    end: "2019-04-28T00:00",
    year: 2019,
    stateCode: "BW",
    name: "Osterferien",
    slug: "osterferien-2019-BW"
  },
  {
    start: "2019-06-11T00:00",
    end: "2019-06-22T00:00",
    year: 2019,
    stateCode: "BW",
    name: "Pfingstferien",
    slug: "pfingstferien-2019-BW"
  },
  {
    start: "2019-07-29T00:00",
    end: "2019-09-11T00:00",
    year: 2019,
    stateCode: "BW",
    name: "Sommerferien",
    slug: "sommerferien-2019-BW"
  },
  {
    start: "2019-10-28T00:00",
    end: "2019-10-31T00:00",
    year: 2019,
    stateCode: "BW",
    name: "Herbstferien",
    slug: "herbstferien-2019-BW"
  },
  {
    start: "2019-12-23T00:00",
    end: "2020-01-05T00:00",
    year: 2019,
    stateCode: "BW",
    name: "Weihnachtsferien",
    slug: "weihnachtsferien-2019-BW"
  },
  {
    start: "2020-04-06T00:00",
    end: "2020-04-19T00:00",
    year: 2020,
    stateCode: "BW",
    name: "Osterferien",
    slug: "osterferien-2020-BW"
  },
  {
    start: "2020-06-02T00:00",
    end: "2020-06-14T00:00",
    year: 2020,
    stateCode: "BW",
    name: "Pfingstferien",
    slug: "pfingstferien-2020-BW"
  },
  {
    start: "2020-07-30T00:00",
    end: "2020-09-13T00:00",
    year: 2020,
    stateCode: "BW",
    name: "Sommerferien",
    slug: "sommerferien-2020-BW"
  },
  {
    start: "2020-10-25T23:00:00.000Z",
    end: "2020-10-30T23:00:00.000Z",
    year: 2020,
    stateCode: "BW",
    name: "Herbstferien",
    slug: "Herbstferien 2020 Baden-W\xFCrttemberg"
  },
  {
    start: "2020-12-22T23:00:00.000Z",
    end: "2021-01-09T23:00:00.000Z",
    year: 2020,
    stateCode: "BW",
    name: "Weihnachtsferien",
    slug: "Weihnachtsferien 2020 Baden-W\xFCrttemberg"
  },
  {
    start: "2021-03-31T22:00:00.000Z",
    end: "2021-04-01T22:00:00.000Z",
    year: 2021,
    stateCode: "BW",
    name: "Osterferien",
    slug: "Osterferien 2021 Baden-W\xFCrttemberg"
  },
  {
    start: "2021-04-05T22:00:00.000Z",
    end: "2021-04-10T22:00:00.000Z",
    year: 2021,
    stateCode: "BW",
    name: "Osterferien",
    slug: "Osterferien 2021 Baden-W\xFCrttemberg"
  },
  {
    start: "2021-05-24T22:00:00.000Z",
    end: "2021-06-05T22:00:00.000Z",
    year: 2021,
    stateCode: "BW",
    name: "Pfingstferien",
    slug: "Pfingstferien 2021 Baden-W\xFCrttemberg"
  },
  {
    start: "2021-07-28T22:00:00.000Z",
    end: "2021-09-11T22:00:00.000Z",
    year: 2021,
    stateCode: "BW",
    name: "Sommerferien",
    slug: "Sommerferien 2021 Baden-W\xFCrttemberg"
  },
  {
    start: "2021-10-30T22:00:00.000Z",
    end: "2021-10-31T23:00:00.000Z",
    year: 2021,
    stateCode: "BW",
    name: "Herbstferien",
    slug: "Herbstferien 2021 Baden-W\xFCrttemberg"
  },
  {
    start: "2021-11-01T23:00:00.000Z",
    end: "2021-11-06T23:00:00.000Z",
    year: 2021,
    stateCode: "BW",
    name: "Herbstferien",
    slug: "Herbstferien 2021 Baden-W\xFCrttemberg"
  },
  {
    start: "2021-12-22T23:00:00.000Z",
    end: "2022-01-08T23:00:00.000Z",
    year: 2021,
    stateCode: "BW",
    name: "Weihnachtsferien",
    slug: "Weihnachtsferien 2021 Baden-W\xFCrttemberg"
  }
];

// src/lib/holiday-data.js
function getHolidays(year, month) {
  switch (month) {
    case 0:
      return addSchoolHolidays(year, month, {
        1: {
          name: "Neujahr",
          type: "holiday"
        }
      });
    case 2:
    case 3: {
      const easter = getEaster(year);
      const dayOfEaster = month === 3 ? easter - 31 : easter;
      const easterData = {
        name: "Ostern",
        type: "closing"
      };
      const data = {};
      for (let i = -2; i < 2; ++i) {
        const aEasterDay = dayOfEaster + i;
        if (aEasterDay > 0) {
          data[aEasterDay] = easterData;
        }
      }
      if (month === 2) {
        data.daylightSavingSwitch = {
          name: "Zeitumstellung!\r\nEs wird um 1 Stunde vor (von 2 Uhr auf 3 Uhr) gestellt.",
          day: getDaylightSavingDay(year, month)
        };
      }
      return addSchoolHolidays(year, month, data);
    }
    case 4:
    case 5: {
      const easterDay = getEaster(year) - 31 * (month - 2);
      const dataOfMayJun = [
        {
          date: easterDay + 40,
          name: "Himmelfahrt"
        },
        {
          date: easterDay + 50,
          name: "Pfingsten"
        },
        {
          date: easterDay + 51,
          name: "Pfingsten"
        },
        {
          date: easterDay + 61,
          name: "Fronleichnam"
        }
      ].reduce((monthData, holiday) => {
        if (holiday.date > 0 && holiday.date <= 31) {
          monthData[holiday.date] = {
            name: holiday.name,
            type: "holiday"
          };
        }
        return monthData;
      }, {});
      if (month === 4) {
        dataOfMayJun[1] = {
          name: "Tag der Arbeit",
          type: "holiday"
        };
      }
      return addSchoolHolidays(year, month, dataOfMayJun);
    }
    case 9:
      return addSchoolHolidays(year, month, {
        3: {
          name: "Tag der deutschen Einheit",
          type: "holiday"
        },
        daylightSavingSwitch: {
          name: "Zeitumstellung!\r\nEs wird um 1 Stunde zur\xFCck (von 3 Uhr auf 2 Uhr) gestellt.",
          day: getDaylightSavingDay(year, month)
        }
      });
    case 10:
      return addSchoolHolidays(year, month, {
        1: {
          name: "Allerheiligen",
          type: "holiday"
        }
      });
    case 11: {
      const xmasData = {
        name: "Weihnachten",
        type: "closing"
      };
      return addSchoolHolidays(year, month, {
        24: xmasData,
        25: xmasData,
        26: xmasData,
        31: {
          name: "Silvester",
          type: "holiday"
        }
      });
    }
    default:
      return addSchoolHolidays(year, month);
  }
}
function addSchoolHolidays(year, month, monthData) {
  const holidaysInThisMonth = ferien.filter((holiday) => {
    if (holiday.year !== year && !holiday.end.startsWith(String(year)))
      return false;
    const start = new Date(holiday.start);
    const end = new Date(holiday.end);
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    return startYear === year && startMonth === month || endYear === year && endMonth === month || startYear === endYear && startMonth < month && endMonth > month;
  }).map((holiday) => {
    const start = new Date(holiday.start);
    const end = new Date(holiday.end);
    return {
      name: holiday.name,
      start: {
        month: start.getMonth(),
        date: start.getDate()
      },
      end: {
        month: end.getMonth(),
        date: end.getDate()
      }
    };
  }).reduce((monthData2, holiday) => {
    const start = holiday.start.month === month ? holiday.start.date : 1;
    const end = holiday.end.month === month ? holiday.end.date : getDaysInMonth(year, month);
    const data = {
      name: holiday.name,
      type: "school"
    };
    for (let i = start; i <= end; ++i) {
      monthData2[i] = data;
    }
    return monthData2;
  }, {});
  return Object.assign(holidaysInThisMonth, monthData);
}
function getEaster(year) {
  const k = Math.floor(year / 100);
  const M = 15 + k - Math.floor(k / 3) - Math.floor(k / 4);
  const N = 5;
  const a = Math.round(afterDot(year / 19) * 19);
  const b = Math.round(afterDot(year / 4) * 4);
  const c = Math.round(afterDot(year / 7) * 7);
  const d = Math.round(afterDot((19 * a + M) / 30) * 30);
  const e = Math.round(afterDot((2 * b + 4 * c + 6 * d + N) / 7) * 7);
  return 22 + d + e;
}
function afterDot(number) {
  return number - Math.floor(number);
}
function getDaylightSavingDay(year, month) {
  if (month !== 2 && month !== 9)
    return -1;
  for (let day = getDaysInMonth(year, month), min = day - 9; day > min; --day) {
    if (new Date(year, month, day).getDay() === 0) {
      return day;
    }
  }
  return -1;
}

// src/lib/select-month-data.js
var select_month_data_default = import_re_reselect.default((year) => year, (year, month) => month, (year, month, shiftModel) => shiftModel, (year, month, shiftModel) => {
  const data = getMonthData(year, month, shiftModel);
  data.holidays = getHolidays(year, month);
  return data;
})((year, month, shiftModel) => `${year}-${month}-${shiftModel}`);

// src/components/main.jsx
function Main({
  isFullYear,
  year,
  month,
  shiftModel,
  today,
  search,
  group,
  dispatch
}) {
  const ref = useHammer(dispatch, isFullYear);
  const numberOfMonths = useNumberOfMonths(group, isFullYear);
  const monthsData = [];
  if (isFullYear) {
    for (let i = 0; i < 12; ++i) {
      monthsData.push([year, i]);
    }
  } else {
    switch (numberOfMonths) {
      case 1:
        monthsData.push([year, month]);
        break;
      case 2: {
        monthsData.push([year, month]);
        let nextMonth = month + 1;
        let nextYear = year;
        if (nextMonth > 11) {
          nextMonth -= 12;
          nextYear += 1;
        }
        monthsData.push([nextYear, nextMonth]);
        break;
      }
      case 4:
      default:
        for (let i = 0; i < numberOfMonths; ++i) {
          let monthNr = month + (i - 1);
          let yearNr = year;
          if (monthNr > 11) {
            monthNr -= 12;
            yearNr += 1;
          } else if (monthNr < 0) {
            monthNr += 12;
            yearNr -= 1;
          }
          monthsData.push([yearNr, monthNr]);
        }
        break;
    }
  }
  return /* @__PURE__ */ import_preact9.h("main", {
    class: "flex flex-col content-center"
  }, /* @__PURE__ */ import_preact9.h("div", {
    id: "calendar_main_out",
    class: "flex flex-row flex-wrap justify-around pt-16 px-5 pb-2",
    onClick: processClick,
    ref,
    "aria-live": "polite"
  }, monthsData.map(([year2, month2]) => /* @__PURE__ */ import_preact9.h(month_default, {
    key: `${year2}-${month2}-${shiftModel}-${group}`,
    year: year2,
    month: month2,
    data: select_month_data_default(year2, month2, shiftModel),
    today: today[0] === year2 && today[1] === month2 ? today : null,
    search: search != null && search[0] === year2 && search[1] === month2 ? search[2] : null,
    group
  }))), /* @__PURE__ */ import_preact9.h(Download, {
    shiftModel
  }), /* @__PURE__ */ import_preact9.h(Footer, null));
}
function useNumberOfMonths(group, displayFullYear) {
  const [numberOfMonths, setNumberOfMonths] = import_hooks.useState(() => isSSR || window.innerWidth < 1220 ? 1 : 4);
  import_hooks.useEffect(() => {
    const onResize = () => {
      const nextNumberOfMonths = window.innerWidth < 1220 ? 1 : 4;
      setNumberOfMonths(nextNumberOfMonths);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  if (displayFullYear) {
    return 12;
  }
  return group > 0 ? numberOfMonths * 2 : numberOfMonths;
}
function useHammer(dispatch, isFullYear) {
  const [container, setContainer] = import_hooks.useState(null);
  import_hooks.useEffect(() => {
    if (isFullYear || container == null)
      return;
    const handler = (event) => {
      switch (event.direction) {
        case 2:
          dispatch({
            type: "move",
            payload: 1
          });
          break;
        case 4:
          dispatch({
            type: "move",
            payload: -1
          });
          break;
      }
    };
    const hammertime = new import_hammerjs.default(container);
    hammertime.on("swipe", handler);
    return () => {
      hammertime.off("swipe", handler);
    };
  }, [isFullYear, container]);
  return setContainer;
}
function processClick(event) {
  let target = event.target;
  while (target && target.nodeName !== "MAIN") {
    if (target.title && target.title.length > 0) {
      window.alert(target.title);
      return;
    }
    target = target.parentNode;
  }
}
