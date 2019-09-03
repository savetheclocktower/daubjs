var Daub = (function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var O = 'object';
  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global_1 =
    // eslint-disable-next-line no-undef
    check(typeof globalThis == O && globalThis) ||
    check(typeof window == O && window) ||
    check(typeof self == O && self) ||
    check(typeof commonjsGlobal == O && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func
    Function('return this')();

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var descriptors = !fails(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
  var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;

  var objectPropertyIsEnumerable = {
  	f: f
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString = {}.toString;

  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var split = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings



  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  // `ToPrimitive` abstract operation
  // https://tc39.github.io/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive = function (input, PREFERRED_STRING) {
    if (!isObject(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var hasOwnProperty = {}.hasOwnProperty;

  var has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var document$1 = global_1.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS = isObject(document$1) && isObject(document$1.createElement);

  var documentCreateElement = function (it) {
    return EXISTS ? document$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !descriptors && !fails(function () {
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
  var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) try {
      return nativeGetOwnPropertyDescriptor(O, P);
    } catch (error) { /* empty */ }
    if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = {
  	f: f$1
  };

  var anObject = function (it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
  };

  var nativeDefineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return nativeDefineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty = {
  	f: f$2
  };

  var hide = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var setGlobal = function (key, value) {
    try {
      hide(global_1, key, value);
    } catch (error) {
      global_1[key] = value;
    } return value;
  };

  var isPure = false;

  var shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = global_1[SHARED] || setGlobal(SHARED, {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.2.1',
    mode:  'global',
    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
  });
  });

  var functionToString = shared('native-function-to-string', Function.toString);

  var WeakMap = global_1.WeakMap;

  var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(functionToString.call(WeakMap));

  var id = 0;
  var postfix = Math.random();

  var uid = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
  };

  var keys = shared('keys');

  var sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys = {};

  var WeakMap$1 = global_1.WeakMap;
  var set, get, has$1;

  var enforce = function (it) {
    return has$1(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (nativeWeakMap) {
    var store = new WeakMap$1();
    var wmget = store.get;
    var wmhas = store.has;
    var wmset = store.set;
    set = function (it, metadata) {
      wmset.call(store, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store, it) || {};
    };
    has$1 = function (it) {
      return wmhas.call(store, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys[STATE] = true;
    set = function (it, metadata) {
      hide(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return has(it, STATE) ? it[STATE] : {};
    };
    has$1 = function (it) {
      return has(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has$1,
    enforce: enforce,
    getterFor: getterFor
  };

  var redefine = createCommonjsModule(function (module) {
  var getInternalState = internalState.get;
  var enforceInternalState = internalState.enforce;
  var TEMPLATE = String(functionToString).split('toString');

  shared('inspectSource', function (it) {
    return functionToString.call(it);
  });

  (module.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    if (typeof value == 'function') {
      if (typeof key == 'string' && !has(value, 'name')) hide(value, 'name', key);
      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
    if (O === global_1) {
      if (simple) O[key] = value;
      else setGlobal(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else hide(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return typeof this == 'function' && getInternalState(this).source || functionToString.call(this);
  });
  });

  var path = global_1;

  var aFunction = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
      : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
  };

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger
  var toInteger = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
  };

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false)
  };

  var indexOf = arrayIncludes.indexOf;


  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys$1);
  };

  var objectGetOwnPropertyNames = {
  	f: f$3
  };

  var f$4 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
  	f: f$4
  };

  // all object keys, includes non-enumerable and symbols
  var ownKeys$1 = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys$1(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;

  var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : typeof detection == 'function' ? fails(detection)
      : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';

  var isForced_1 = isForced;

  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global_1;
    } else if (STATIC) {
      target = global_1[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global_1[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor$1(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        hide(sourceProperty, 'sham', true);
      }
      // extend global
      redefine(target, key, sourceProperty, options);
    }
  };

  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
    // Chrome 38 Symbol has incorrect toString conversion
    // eslint-disable-next-line no-undef
    return !String(Symbol());
  });

  // `IsArray` abstract operation
  // https://tc39.github.io/ecma262/#sec-isarray
  var isArray = Array.isArray || function isArray(arg) {
    return classofRaw(arg) == 'Array';
  };

  // `ToObject` abstract operation
  // https://tc39.github.io/ecma262/#sec-toobject
  var toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys
  var objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };

  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
    return O;
  };

  var html = getBuiltIn('document', 'documentElement');

  var IE_PROTO = sharedKey('IE_PROTO');

  var PROTOTYPE = 'prototype';
  var Empty = function () { /* empty */ };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var length = enumBugKeys.length;
    var lt = '<';
    var script = 'script';
    var gt = '>';
    var js = 'java' + script + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe);
    iframe.src = String(js);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
    return createDict();
  };

  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE] = anObject(O);
      result = new Empty();
      Empty[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : objectDefineProperties(result, Properties);
  };

  hiddenKeys[IE_PROTO] = true;

  var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

  var toString$1 = {}.toString;

  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return nativeGetOwnPropertyNames(it);
    } catch (error) {
      return windowNames.slice();
    }
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
  var f$5 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == '[object Window]'
      ? getWindowNames(it)
      : nativeGetOwnPropertyNames(toIndexedObject(it));
  };

  var objectGetOwnPropertyNamesExternal = {
  	f: f$5
  };

  var Symbol$1 = global_1.Symbol;
  var store$1 = shared('wks');

  var wellKnownSymbol = function (name) {
    return store$1[name] || (store$1[name] = nativeSymbol && Symbol$1[name]
      || (nativeSymbol ? Symbol$1 : uid)('Symbol.' + name));
  };

  var f$6 = wellKnownSymbol;

  var wrappedWellKnownSymbol = {
  	f: f$6
  };

  var defineProperty = objectDefineProperty.f;

  var defineWellKnownSymbol = function (NAME) {
    var Symbol = path.Symbol || (path.Symbol = {});
    if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
      value: wrappedWellKnownSymbol.f(NAME)
    });
  };

  var defineProperty$1 = objectDefineProperty.f;



  var TO_STRING_TAG = wellKnownSymbol('toStringTag');

  var setToStringTag = function (it, TAG, STATIC) {
    if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
      defineProperty$1(it, TO_STRING_TAG, { configurable: true, value: TAG });
    }
  };

  var aFunction$1 = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    } return it;
  };

  // optional / simple context binding
  var bindContext = function (fn, that, length) {
    aFunction$1(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var SPECIES = wellKnownSymbol('species');

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.github.io/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate = function (originalArray, length) {
    var C;
    if (isArray(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
      else if (isObject(C)) {
        C = C[SPECIES];
        if (C === null) C = undefined;
      }
    } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  var push = [].push;

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
  var createMethod$1 = function (TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject($this);
      var self = indexedObject(O);
      var boundFunction = bindContext(callbackfn, that, 3);
      var length = toLength(self.length);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate;
      var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
      var value, result;
      for (;length > index; index++) if (NO_HOLES || index in self) {
        value = self[index];
        result = boundFunction(value, index, O);
        if (TYPE) {
          if (IS_MAP) target[index] = result; // map
          else if (result) switch (TYPE) {
            case 3: return true;              // some
            case 5: return value;             // find
            case 6: return index;             // findIndex
            case 2: push.call(target, value); // filter
          } else if (IS_EVERY) return false;  // every
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
    forEach: createMethod$1(0),
    // `Array.prototype.map` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.map
    map: createMethod$1(1),
    // `Array.prototype.filter` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.filter
    filter: createMethod$1(2),
    // `Array.prototype.some` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.some
    some: createMethod$1(3),
    // `Array.prototype.every` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.every
    every: createMethod$1(4),
    // `Array.prototype.find` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    find: createMethod$1(5),
    // `Array.prototype.findIndex` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$1(6)
  };

  var $forEach = arrayIteration.forEach;

  var HIDDEN = sharedKey('hidden');
  var SYMBOL = 'Symbol';
  var PROTOTYPE$1 = 'prototype';
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
  var setInternalState = internalState.set;
  var getInternalState = internalState.getterFor(SYMBOL);
  var ObjectPrototype = Object[PROTOTYPE$1];
  var $Symbol = global_1.Symbol;
  var JSON = global_1.JSON;
  var nativeJSONStringify = JSON && JSON.stringify;
  var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
  var nativeDefineProperty$1 = objectDefineProperty.f;
  var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
  var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
  var AllSymbols = shared('symbols');
  var ObjectPrototypeSymbols = shared('op-symbols');
  var StringToSymbolRegistry = shared('string-to-symbol-registry');
  var SymbolToStringRegistry = shared('symbol-to-string-registry');
  var WellKnownSymbolsStore = shared('wks');
  var QObject = global_1.QObject;
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDescriptor = descriptors && fails(function () {
    return objectCreate(nativeDefineProperty$1({}, 'a', {
      get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (O, P, Attributes) {
    var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P);
    if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
    nativeDefineProperty$1(O, P, Attributes);
    if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
      nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
    }
  } : nativeDefineProperty$1;

  var wrap = function (tag, description) {
    var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
    setInternalState(symbol, {
      type: SYMBOL,
      tag: tag,
      description: description
    });
    if (!descriptors) symbol.description = description;
    return symbol;
  };

  var isSymbol = nativeSymbol && typeof $Symbol.iterator == 'symbol' ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return Object(it) instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(O, P, Attributes) {
    if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
    anObject(O);
    var key = toPrimitive(P, true);
    anObject(Attributes);
    if (has(AllSymbols, key)) {
      if (!Attributes.enumerable) {
        if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
        O[HIDDEN][key] = true;
      } else {
        if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
        Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
      } return setSymbolDescriptor(O, key, Attributes);
    } return nativeDefineProperty$1(O, key, Attributes);
  };

  var $defineProperties = function defineProperties(O, Properties) {
    anObject(O);
    var properties = toIndexedObject(Properties);
    var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
    $forEach(keys, function (key) {
      if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
    });
    return O;
  };

  var $create = function create(O, Properties) {
    return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
  };

  var $propertyIsEnumerable = function propertyIsEnumerable(V) {
    var P = toPrimitive(V, true);
    var enumerable = nativePropertyIsEnumerable$1.call(this, P);
    if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
    return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
  };

  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
    var it = toIndexedObject(O);
    var key = toPrimitive(P, true);
    if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
    var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
    if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
      descriptor.enumerable = true;
    }
    return descriptor;
  };

  var $getOwnPropertyNames = function getOwnPropertyNames(O) {
    var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
    var result = [];
    $forEach(names, function (key) {
      if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
    });
    return result;
  };

  var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
    var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
    var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
    var result = [];
    $forEach(names, function (key) {
      if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
        result.push(AllSymbols[key]);
      }
    });
    return result;
  };

  // `Symbol` constructor
  // https://tc39.github.io/ecma262/#sec-symbol-constructor
  if (!nativeSymbol) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
      var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
      var tag = uid(description);
      var setter = function (value) {
        if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
        if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
      };
      if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
      return wrap(tag, description);
    };

    redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
      return getInternalState(this).tag;
    });

    objectPropertyIsEnumerable.f = $propertyIsEnumerable;
    objectDefineProperty.f = $defineProperty;
    objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
    objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
    objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

    if (descriptors) {
      // https://github.com/tc39/proposal-Symbol-description
      nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
        configurable: true,
        get: function description() {
          return getInternalState(this).description;
        }
      });
      {
        redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
      }
    }

    wrappedWellKnownSymbol.f = function (name) {
      return wrap(wellKnownSymbol(name), name);
    };
  }

  _export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
    Symbol: $Symbol
  });

  $forEach(objectKeys(WellKnownSymbolsStore), function (name) {
    defineWellKnownSymbol(name);
  });

  _export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
    // `Symbol.for` method
    // https://tc39.github.io/ecma262/#sec-symbol.for
    'for': function (key) {
      var string = String(key);
      if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
      var symbol = $Symbol(string);
      StringToSymbolRegistry[string] = symbol;
      SymbolToStringRegistry[symbol] = string;
      return symbol;
    },
    // `Symbol.keyFor` method
    // https://tc39.github.io/ecma262/#sec-symbol.keyfor
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
      if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
    },
    useSetter: function () { USE_SETTER = true; },
    useSimple: function () { USE_SETTER = false; }
  });

  _export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
    // `Object.create` method
    // https://tc39.github.io/ecma262/#sec-object.create
    create: $create,
    // `Object.defineProperty` method
    // https://tc39.github.io/ecma262/#sec-object.defineproperty
    defineProperty: $defineProperty,
    // `Object.defineProperties` method
    // https://tc39.github.io/ecma262/#sec-object.defineproperties
    defineProperties: $defineProperties,
    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor
  });

  _export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
    // `Object.getOwnPropertyNames` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
    getOwnPropertyNames: $getOwnPropertyNames,
    // `Object.getOwnPropertySymbols` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
  // https://bugs.chromium.org/p/v8/issues/detail?id=3443
  _export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
    getOwnPropertySymbols: function getOwnPropertySymbols(it) {
      return objectGetOwnPropertySymbols.f(toObject(it));
    }
  });

  // `JSON.stringify` method behavior with symbols
  // https://tc39.github.io/ecma262/#sec-json.stringify
  JSON && _export({ target: 'JSON', stat: true, forced: !nativeSymbol || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return nativeJSONStringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || nativeJSONStringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || nativeJSONStringify(Object(symbol)) != '{}';
  }) }, {
    stringify: function stringify(it) {
      var args = [it];
      var index = 1;
      var replacer, $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer = args[1];
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return nativeJSONStringify.apply(JSON, args);
    }
  });

  // `Symbol.prototype[@@toPrimitive]` method
  // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
  if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) hide($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
  // `Symbol.prototype[@@toStringTag]` property
  // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
  setToStringTag($Symbol, SYMBOL);

  hiddenKeys[HIDDEN] = true;

  // `Symbol.asyncIterator` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.asynciterator
  defineWellKnownSymbol('asyncIterator');

  var defineProperty$2 = objectDefineProperty.f;


  var NativeSymbol = global_1.Symbol;

  if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
    // Safari 12 bug
    NativeSymbol().description !== undefined
  )) {
    var EmptyStringDescriptionStore = {};
    // wrap Symbol constructor for correct work with undefined description
    var SymbolWrapper = function Symbol() {
      var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
      var result = this instanceof SymbolWrapper
        ? new NativeSymbol(description)
        // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
        : description === undefined ? NativeSymbol() : NativeSymbol(description);
      if (description === '') EmptyStringDescriptionStore[result] = true;
      return result;
    };
    copyConstructorProperties(SymbolWrapper, NativeSymbol);
    var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
    symbolPrototype.constructor = SymbolWrapper;

    var symbolToString = symbolPrototype.toString;
    var native = String(NativeSymbol('test')) == 'Symbol(test)';
    var regexp = /^Symbol\((.*)\)[^)]+$/;
    defineProperty$2(symbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        var symbol = isObject(this) ? this.valueOf() : this;
        var string = symbolToString.call(symbol);
        if (has(EmptyStringDescriptionStore, symbol)) return '';
        var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
        return desc === '' ? undefined : desc;
      }
    });

    _export({ global: true, forced: true }, {
      Symbol: SymbolWrapper
    });
  }

  // `Symbol.hasInstance` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.hasinstance
  defineWellKnownSymbol('hasInstance');

  // `Symbol.isConcatSpreadable` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
  defineWellKnownSymbol('isConcatSpreadable');

  // `Symbol.iterator` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.iterator
  defineWellKnownSymbol('iterator');

  // `Symbol.match` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.match
  defineWellKnownSymbol('match');

  // `Symbol.matchAll` well-known symbol
  defineWellKnownSymbol('matchAll');

  // `Symbol.replace` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.replace
  defineWellKnownSymbol('replace');

  // `Symbol.search` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.search
  defineWellKnownSymbol('search');

  // `Symbol.species` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.species
  defineWellKnownSymbol('species');

  // `Symbol.split` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.split
  defineWellKnownSymbol('split');

  // `Symbol.toPrimitive` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.toprimitive
  defineWellKnownSymbol('toPrimitive');

  // `Symbol.toStringTag` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.tostringtag
  defineWellKnownSymbol('toStringTag');

  // `Symbol.unscopables` well-known symbol
  // https://tc39.github.io/ecma262/#sec-symbol.unscopables
  defineWellKnownSymbol('unscopables');

  var nativeAssign = Object.assign;

  // `Object.assign` method
  // https://tc39.github.io/ecma262/#sec-object.assign
  // should work with symbols and should have deterministic property order (V8 bug)
  var objectAssign = !nativeAssign || fails(function () {
    var A = {};
    var B = {};
    // eslint-disable-next-line no-undef
    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) { B[chr] = chr; });
    return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars
    var T = toObject(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    var propertyIsEnumerable = objectPropertyIsEnumerable.f;
    while (argumentsLength > index) {
      var S = indexedObject(arguments[index++]);
      var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
      }
    } return T;
  } : nativeAssign;

  // `Object.assign` method
  // https://tc39.github.io/ecma262/#sec-object.assign
  _export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
    assign: objectAssign
  });

  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  _export({ target: 'Object', stat: true, sham: !descriptors }, {
    create: objectCreate
  });

  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  _export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
    defineProperty: objectDefineProperty.f
  });

  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  _export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
    defineProperties: objectDefineProperties
  });

  var propertyIsEnumerable = objectPropertyIsEnumerable.f;

  // `Object.{ entries, values }` methods implementation
  var createMethod$2 = function (TO_ENTRIES) {
    return function (it) {
      var O = toIndexedObject(it);
      var keys = objectKeys(O);
      var length = keys.length;
      var i = 0;
      var result = [];
      var key;
      while (length > i) {
        key = keys[i++];
        if (!descriptors || propertyIsEnumerable.call(O, key)) {
          result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
        }
      }
      return result;
    };
  };

  var objectToArray = {
    // `Object.entries` method
    // https://tc39.github.io/ecma262/#sec-object.entries
    entries: createMethod$2(true),
    // `Object.values` method
    // https://tc39.github.io/ecma262/#sec-object.values
    values: createMethod$2(false)
  };

  var $entries = objectToArray.entries;

  // `Object.entries` method
  // https://tc39.github.io/ecma262/#sec-object.entries
  _export({ target: 'Object', stat: true }, {
    entries: function entries(O) {
      return $entries(O);
    }
  });

  var freezing = !fails(function () {
    return Object.isExtensible(Object.preventExtensions({}));
  });

  var internalMetadata = createCommonjsModule(function (module) {
  var defineProperty = objectDefineProperty.f;



  var METADATA = uid('meta');
  var id = 0;

  var isExtensible = Object.isExtensible || function () {
    return true;
  };

  var setMetadata = function (it) {
    defineProperty(it, METADATA, { value: {
      objectID: 'O' + ++id, // object ID
      weakData: {}          // weak collections IDs
    } });
  };

  var fastKey = function (it, create) {
    // return a primitive with prefix
    if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!has(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMetadata(it);
    // return object ID
    } return it[METADATA].objectID;
  };

  var getWeakData = function (it, create) {
    if (!has(it, METADATA)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMetadata(it);
    // return the store of weak collections IDs
    } return it[METADATA].weakData;
  };

  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
    return it;
  };

  var meta = module.exports = {
    REQUIRED: false,
    fastKey: fastKey,
    getWeakData: getWeakData,
    onFreeze: onFreeze
  };

  hiddenKeys[METADATA] = true;
  });
  var internalMetadata_1 = internalMetadata.REQUIRED;
  var internalMetadata_2 = internalMetadata.fastKey;
  var internalMetadata_3 = internalMetadata.getWeakData;
  var internalMetadata_4 = internalMetadata.onFreeze;

  var onFreeze = internalMetadata.onFreeze;

  var nativeFreeze = Object.freeze;
  var FAILS_ON_PRIMITIVES = fails(function () { nativeFreeze(1); });

  // `Object.freeze` method
  // https://tc39.github.io/ecma262/#sec-object.freeze
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !freezing }, {
    freeze: function freeze(it) {
      return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
    }
  });

  var iterators = {};

  var ITERATOR = wellKnownSymbol('iterator');
  var ArrayPrototype = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
  };

  var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof = function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };

  var ITERATOR$1 = wellKnownSymbol('iterator');

  var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$1]
      || it['@@iterator']
      || iterators[classof(it)];
  };

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      var returnMethod = iterator['return'];
      if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
      throw error;
    }
  };

  var iterate_1 = createCommonjsModule(function (module) {
  var Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };

  var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
    var boundFunction = bindContext(fn, that, AS_ENTRIES ? 2 : 1);
    var iterator, iterFn, index, length, result, step;

    if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (index = 0, length = toLength(iterable.length); length > index; index++) {
          result = AS_ENTRIES
            ? boundFunction(anObject(step = iterable[index])[0], step[1])
            : boundFunction(iterable[index]);
          if (result && result instanceof Result) return result;
        } return new Result(false);
      }
      iterator = iterFn.call(iterable);
    }

    while (!(step = iterator.next()).done) {
      result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
      if (result && result instanceof Result) return result;
    } return new Result(false);
  };

  iterate.stop = function (result) {
    return new Result(true, result);
  };
  });

  var createProperty = function (object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
  };

  // `Object.fromEntries` method
  // https://github.com/tc39/proposal-object-from-entries
  _export({ target: 'Object', stat: true }, {
    fromEntries: function fromEntries(iterable) {
      var obj = {};
      iterate_1(iterable, function (k, v) {
        createProperty(obj, k, v);
      }, undefined, true);
      return obj;
    }
  });

  var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;


  var FAILS_ON_PRIMITIVES$1 = fails(function () { nativeGetOwnPropertyDescriptor$2(1); });
  var FORCED = !descriptors || FAILS_ON_PRIMITIVES$1;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
  _export({ target: 'Object', stat: true, forced: FORCED, sham: !descriptors }, {
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
      return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it), key);
    }
  });

  // `Object.getOwnPropertyDescriptors` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  _export({ target: 'Object', stat: true, sham: !descriptors }, {
    getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
      var O = toIndexedObject(object);
      var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
      var keys = ownKeys$1(O);
      var result = {};
      var index = 0;
      var key, descriptor;
      while (keys.length > index) {
        descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
        if (descriptor !== undefined) createProperty(result, key, descriptor);
      }
      return result;
    }
  });

  var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;

  var FAILS_ON_PRIMITIVES$2 = fails(function () { return !Object.getOwnPropertyNames(1); });

  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
    getOwnPropertyNames: nativeGetOwnPropertyNames$2
  });

  var correctPrototypeGetter = !fails(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var IE_PROTO$1 = sharedKey('IE_PROTO');
  var ObjectPrototype$1 = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof
  var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
    O = toObject(O);
    if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectPrototype$1 : null;
  };

  var FAILS_ON_PRIMITIVES$3 = fails(function () { objectGetPrototypeOf(1); });

  // `Object.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.getprototypeof
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3, sham: !correctPrototypeGetter }, {
    getPrototypeOf: function getPrototypeOf(it) {
      return objectGetPrototypeOf(toObject(it));
    }
  });

  // `SameValue` abstract operation
  // https://tc39.github.io/ecma262/#sec-samevalue
  var sameValue = Object.is || function is(x, y) {
    // eslint-disable-next-line no-self-compare
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  };

  // `Object.is` method
  // https://tc39.github.io/ecma262/#sec-object.is
  _export({ target: 'Object', stat: true }, {
    is: sameValue
  });

  var nativeIsExtensible = Object.isExtensible;
  var FAILS_ON_PRIMITIVES$4 = fails(function () { nativeIsExtensible(1); });

  // `Object.isExtensible` method
  // https://tc39.github.io/ecma262/#sec-object.isextensible
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 }, {
    isExtensible: function isExtensible(it) {
      return isObject(it) ? nativeIsExtensible ? nativeIsExtensible(it) : true : false;
    }
  });

  var nativeIsFrozen = Object.isFrozen;
  var FAILS_ON_PRIMITIVES$5 = fails(function () { nativeIsFrozen(1); });

  // `Object.isFrozen` method
  // https://tc39.github.io/ecma262/#sec-object.isfrozen
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5 }, {
    isFrozen: function isFrozen(it) {
      return isObject(it) ? nativeIsFrozen ? nativeIsFrozen(it) : false : true;
    }
  });

  var nativeIsSealed = Object.isSealed;
  var FAILS_ON_PRIMITIVES$6 = fails(function () { nativeIsSealed(1); });

  // `Object.isSealed` method
  // https://tc39.github.io/ecma262/#sec-object.issealed
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$6 }, {
    isSealed: function isSealed(it) {
      return isObject(it) ? nativeIsSealed ? nativeIsSealed(it) : false : true;
    }
  });

  var FAILS_ON_PRIMITIVES$7 = fails(function () { objectKeys(1); });

  // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$7 }, {
    keys: function keys(it) {
      return objectKeys(toObject(it));
    }
  });

  var onFreeze$1 = internalMetadata.onFreeze;



  var nativePreventExtensions = Object.preventExtensions;
  var FAILS_ON_PRIMITIVES$8 = fails(function () { nativePreventExtensions(1); });

  // `Object.preventExtensions` method
  // https://tc39.github.io/ecma262/#sec-object.preventextensions
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$8, sham: !freezing }, {
    preventExtensions: function preventExtensions(it) {
      return nativePreventExtensions && isObject(it) ? nativePreventExtensions(onFreeze$1(it)) : it;
    }
  });

  var onFreeze$2 = internalMetadata.onFreeze;



  var nativeSeal = Object.seal;
  var FAILS_ON_PRIMITIVES$9 = fails(function () { nativeSeal(1); });

  // `Object.seal` method
  // https://tc39.github.io/ecma262/#sec-object.seal
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$9, sham: !freezing }, {
    seal: function seal(it) {
      return nativeSeal && isObject(it) ? nativeSeal(onFreeze$2(it)) : it;
    }
  });

  var aPossiblePrototype = function (it) {
    if (!isObject(it) && it !== null) {
      throw TypeError("Can't set " + String(it) + ' as a prototype');
    } return it;
  };

  // `Object.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */
  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
      setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
      setter.call(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) { /* empty */ }
    return function setPrototypeOf(O, proto) {
      anObject(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter.call(O, proto);
      else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  // `Object.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-object.setprototypeof
  _export({ target: 'Object', stat: true }, {
    setPrototypeOf: objectSetPrototypeOf
  });

  var $values = objectToArray.values;

  // `Object.values` method
  // https://tc39.github.io/ecma262/#sec-object.values
  _export({ target: 'Object', stat: true }, {
    values: function values(O) {
      return $values(O);
    }
  });

  var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
  var test = {};

  test[TO_STRING_TAG$2] = 'z';

  // `Object.prototype.toString` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
  var objectToString = String(test) !== '[object z]' ? function toString() {
    return '[object ' + classof(this) + ']';
  } : test.toString;

  var ObjectPrototype$2 = Object.prototype;

  // `Object.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
  if (objectToString !== ObjectPrototype$2.toString) {
    redefine(ObjectPrototype$2, 'toString', objectToString, { unsafe: true });
  }

  // Forced replacement object prototype accessors methods
  var forcedObjectPrototypeAccessorsMethods =  !fails(function () {
    var key = Math.random();
    // In FF throws only define methods
    // eslint-disable-next-line no-undef, no-useless-call
    __defineSetter__.call(null, key, function () { /* empty */ });
    delete global_1[key];
  });

  // `Object.prototype.__defineGetter__` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.__defineGetter__
  if (descriptors) {
    _export({ target: 'Object', proto: true, forced: forcedObjectPrototypeAccessorsMethods }, {
      __defineGetter__: function __defineGetter__(P, getter) {
        objectDefineProperty.f(toObject(this), P, { get: aFunction$1(getter), enumerable: true, configurable: true });
      }
    });
  }

  // `Object.prototype.__defineSetter__` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.__defineSetter__
  if (descriptors) {
    _export({ target: 'Object', proto: true, forced: forcedObjectPrototypeAccessorsMethods }, {
      __defineSetter__: function __defineSetter__(P, setter) {
        objectDefineProperty.f(toObject(this), P, { set: aFunction$1(setter), enumerable: true, configurable: true });
      }
    });
  }

  var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;

  // `Object.prototype.__lookupGetter__` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.__lookupGetter__
  if (descriptors) {
    _export({ target: 'Object', proto: true, forced: forcedObjectPrototypeAccessorsMethods }, {
      __lookupGetter__: function __lookupGetter__(P) {
        var O = toObject(this);
        var key = toPrimitive(P, true);
        var desc;
        do {
          if (desc = getOwnPropertyDescriptor$2(O, key)) return desc.get;
        } while (O = objectGetPrototypeOf(O));
      }
    });
  }

  var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;

  // `Object.prototype.__lookupSetter__` method
  // https://tc39.github.io/ecma262/#sec-object.prototype.__lookupSetter__
  if (descriptors) {
    _export({ target: 'Object', proto: true, forced: forcedObjectPrototypeAccessorsMethods }, {
      __lookupSetter__: function __lookupSetter__(P) {
        var O = toObject(this);
        var key = toPrimitive(P, true);
        var desc;
        do {
          if (desc = getOwnPropertyDescriptor$3(O, key)) return desc.set;
        } while (O = objectGetPrototypeOf(O));
      }
    });
  }

  var slice = [].slice;
  var factories = {};

  var construct = function (C, argsLength, args) {
    if (!(argsLength in factories)) {
      for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
      // eslint-disable-next-line no-new-func
      factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
    } return factories[argsLength](C, args);
  };

  // `Function.prototype.bind` method implementation
  // https://tc39.github.io/ecma262/#sec-function.prototype.bind
  var functionBind = Function.bind || function bind(that /* , ...args */) {
    var fn = aFunction$1(this);
    var partArgs = slice.call(arguments, 1);
    var boundFunction = function bound(/* args... */) {
      var args = partArgs.concat(slice.call(arguments));
      return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
    };
    if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
    return boundFunction;
  };

  // `Function.prototype.bind` method
  // https://tc39.github.io/ecma262/#sec-function.prototype.bind
  _export({ target: 'Function', proto: true }, {
    bind: functionBind
  });

  var defineProperty$3 = objectDefineProperty.f;

  var FunctionPrototype = Function.prototype;
  var FunctionPrototypeToString = FunctionPrototype.toString;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME = 'name';

  // Function instances `.name` property
  // https://tc39.github.io/ecma262/#sec-function-instances-name
  if (descriptors && !(NAME in FunctionPrototype)) {
    defineProperty$3(FunctionPrototype, NAME, {
      configurable: true,
      get: function () {
        try {
          return FunctionPrototypeToString.call(this).match(nameRE)[1];
        } catch (error) {
          return '';
        }
      }
    });
  }

  var HAS_INSTANCE = wellKnownSymbol('hasInstance');
  var FunctionPrototype$1 = Function.prototype;

  // `Function.prototype[@@hasInstance]` method
  // https://tc39.github.io/ecma262/#sec-function.prototype-@@hasinstance
  if (!(HAS_INSTANCE in FunctionPrototype$1)) {
    objectDefineProperty.f(FunctionPrototype$1, HAS_INSTANCE, { value: function (O) {
      if (typeof this != 'function' || !isObject(O)) return false;
      if (!isObject(this.prototype)) return O instanceof this;
      // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
      while (O = objectGetPrototypeOf(O)) if (this.prototype === O) return true;
      return false;
    } });
  }

  // `Array.from` method implementation
  // https://tc39.github.io/ecma262/#sec-array.from
  var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iteratorMethod = getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = bindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
    // if the target is not iterable or it's an array with the default iterator - use a simple case
    if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
      iterator = iteratorMethod.call(O);
      result = new C();
      for (;!(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping
          ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
          : step.value
        );
      }
    } else {
      length = toLength(O.length);
      result = new C(length);
      for (;length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  };

  var ITERATOR$2 = wellKnownSymbol('iterator');
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function () {
        return { done: !!called++ };
      },
      'return': function () {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR$2] = function () {
      return this;
    };
    // eslint-disable-next-line no-throw-literal
    Array.from(iteratorWithReturn, function () { throw 2; });
  } catch (error) { /* empty */ }

  var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR$2] = function () {
        return {
          next: function () {
            return { done: ITERATION_SUPPORT = true };
          }
        };
      };
      exec(object);
    } catch (error) { /* empty */ }
    return ITERATION_SUPPORT;
  };

  var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
    Array.from(iterable);
  });

  // `Array.from` method
  // https://tc39.github.io/ecma262/#sec-array.from
  _export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
    from: arrayFrom
  });

  // `Array.isArray` method
  // https://tc39.github.io/ecma262/#sec-array.isarray
  _export({ target: 'Array', stat: true }, {
    isArray: isArray
  });

  var ISNT_GENERIC = fails(function () {
    function F() { /* empty */ }
    return !(Array.of.call(F) instanceof F);
  });

  // `Array.of` method
  // https://tc39.github.io/ecma262/#sec-array.of
  // WebKit Array.of isn't generic
  _export({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
    of: function of(/* ...args */) {
      var index = 0;
      var argumentsLength = arguments.length;
      var result = new (typeof this == 'function' ? this : Array)(argumentsLength);
      while (argumentsLength > index) createProperty(result, index, arguments[index++]);
      result.length = argumentsLength;
      return result;
    }
  });

  var SPECIES$1 = wellKnownSymbol('species');

  var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    return !fails(function () {
      var array = [];
      var constructor = array.constructor = {};
      constructor[SPECIES$1] = function () {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

  var IS_CONCAT_SPREADABLE_SUPPORT = !fails(function () {
    var array = [];
    array[IS_CONCAT_SPREADABLE] = false;
    return array.concat()[0] !== array;
  });

  var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

  var isConcatSpreadable = function (O) {
    if (!isObject(O)) return false;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray(O);
  };

  var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

  // `Array.prototype.concat` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species
  _export({ target: 'Array', proto: true, forced: FORCED$1 }, {
    concat: function concat(arg) { // eslint-disable-line no-unused-vars
      var O = toObject(this);
      var A = arraySpeciesCreate(O, 0);
      var n = 0;
      var i, k, length, len, E;
      for (i = -1, length = arguments.length; i < length; i++) {
        E = i === -1 ? O : arguments[i];
        if (isConcatSpreadable(E)) {
          len = toLength(E.length);
          if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
        } else {
          if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          createProperty(A, n++, E);
        }
      }
      A.length = n;
      return A;
    }
  });

  var min$2 = Math.min;

  // `Array.prototype.copyWithin` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
  var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var to = toAbsoluteIndex(target, len);
    var from = toAbsoluteIndex(start, len);
    var end = arguments.length > 2 ? arguments[2] : undefined;
    var count = min$2((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
    var inc = 1;
    if (from < to && to < from + count) {
      inc = -1;
      from += count - 1;
      to += count - 1;
    }
    while (count-- > 0) {
      if (from in O) O[to] = O[from];
      else delete O[to];
      to += inc;
      from += inc;
    } return O;
  };

  var UNSCOPABLES = wellKnownSymbol('unscopables');
  var ArrayPrototype$1 = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
    hide(ArrayPrototype$1, UNSCOPABLES, objectCreate(null));
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables = function (key) {
    ArrayPrototype$1[UNSCOPABLES][key] = true;
  };

  // `Array.prototype.copyWithin` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
  _export({ target: 'Array', proto: true }, {
    copyWithin: arrayCopyWithin
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('copyWithin');

  var sloppyArrayMethod = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !method || !fails(function () {
      // eslint-disable-next-line no-useless-call,no-throw-literal
      method.call(null, argument || function () { throw 1; }, 1);
    });
  };

  var $every = arrayIteration.every;


  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  _export({ target: 'Array', proto: true, forced: sloppyArrayMethod('every') }, {
    every: function every(callbackfn /* , thisArg */) {
      return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // `Array.prototype.fill` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.fill
  var arrayFill = function fill(value /* , start = 0, end = @length */) {
    var O = toObject(this);
    var length = toLength(O.length);
    var argumentsLength = arguments.length;
    var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
    var end = argumentsLength > 2 ? arguments[2] : undefined;
    var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
    while (endPos > index) O[index++] = value;
    return O;
  };

  // `Array.prototype.fill` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.fill
  _export({ target: 'Array', proto: true }, {
    fill: arrayFill
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('fill');

  var $filter = arrayIteration.filter;


  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('filter') }, {
    filter: function filter(callbackfn /* , thisArg */) {
      return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var $find = arrayIteration.find;


  var FIND = 'find';
  var SKIPS_HOLES = true;

  // Shouldn't skip holes
  if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  _export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
    find: function find(callbackfn /* , that = undefined */) {
      return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables(FIND);

  var $findIndex = arrayIteration.findIndex;


  var FIND_INDEX = 'findIndex';
  var SKIPS_HOLES$1 = true;

  // Shouldn't skip holes
  if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES$1 = false; });

  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findindex
  _export({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
    findIndex: function findIndex(callbackfn /* , that = undefined */) {
      return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables(FIND_INDEX);

  // `FlattenIntoArray` abstract operation
  // https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
  var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
    var targetIndex = start;
    var sourceIndex = 0;
    var mapFn = mapper ? bindContext(mapper, thisArg, 3) : false;
    var element;

    while (sourceIndex < sourceLen) {
      if (sourceIndex in source) {
        element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

        if (depth > 0 && isArray(element)) {
          targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
        } else {
          if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
          target[targetIndex] = element;
        }

        targetIndex++;
      }
      sourceIndex++;
    }
    return targetIndex;
  };

  var flattenIntoArray_1 = flattenIntoArray;

  // `Array.prototype.flat` method
  // https://github.com/tc39/proposal-flatMap
  _export({ target: 'Array', proto: true }, {
    flat: function flat(/* depthArg = 1 */) {
      var depthArg = arguments.length ? arguments[0] : undefined;
      var O = toObject(this);
      var sourceLen = toLength(O.length);
      var A = arraySpeciesCreate(O, 0);
      A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
      return A;
    }
  });

  // `Array.prototype.flatMap` method
  // https://github.com/tc39/proposal-flatMap
  _export({ target: 'Array', proto: true }, {
    flatMap: function flatMap(callbackfn /* , thisArg */) {
      var O = toObject(this);
      var sourceLen = toLength(O.length);
      var A;
      aFunction$1(callbackfn);
      A = arraySpeciesCreate(O, 0);
      A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      return A;
    }
  });

  var $forEach$1 = arrayIteration.forEach;


  // `Array.prototype.forEach` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  var arrayForEach = sloppyArrayMethod('forEach') ? function forEach(callbackfn /* , thisArg */) {
    return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  } : [].forEach;

  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  _export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
    forEach: arrayForEach
  });

  var $includes = arrayIncludes.includes;


  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  _export({ target: 'Array', proto: true }, {
    includes: function includes(el /* , fromIndex = 0 */) {
      return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('includes');

  var $indexOf = arrayIncludes.indexOf;


  var nativeIndexOf = [].indexOf;

  var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
  var SLOPPY_METHOD = sloppyArrayMethod('indexOf');

  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  _export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
    indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
      return NEGATIVE_ZERO
        // convert -0 to +0
        ? nativeIndexOf.apply(this, arguments) || 0
        : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var nativeJoin = [].join;

  var ES3_STRINGS = indexedObject != Object;
  var SLOPPY_METHOD$1 = sloppyArrayMethod('join', ',');

  // `Array.prototype.join` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.join
  _export({ target: 'Array', proto: true, forced: ES3_STRINGS || SLOPPY_METHOD$1 }, {
    join: function join(separator) {
      return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
    }
  });

  var min$3 = Math.min;
  var nativeLastIndexOf = [].lastIndexOf;
  var NEGATIVE_ZERO$1 = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
  var SLOPPY_METHOD$2 = sloppyArrayMethod('lastIndexOf');

  // `Array.prototype.lastIndexOf` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
  var arrayLastIndexOf = (NEGATIVE_ZERO$1 || SLOPPY_METHOD$2) ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO$1) return nativeLastIndexOf.apply(this, arguments) || 0;
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = min$3(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
    return -1;
  } : nativeLastIndexOf;

  // `Array.prototype.lastIndexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
  _export({ target: 'Array', proto: true, forced: arrayLastIndexOf !== [].lastIndexOf }, {
    lastIndexOf: arrayLastIndexOf
  });

  var $map = arrayIteration.map;


  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('map') }, {
    map: function map(callbackfn /* , thisArg */) {
      return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // `Array.prototype.{ reduce, reduceRight }` methods implementation
  var createMethod$3 = function (IS_RIGHT) {
    return function (that, callbackfn, argumentsLength, memo) {
      aFunction$1(callbackfn);
      var O = toObject(that);
      var self = indexedObject(O);
      var length = toLength(O.length);
      var index = IS_RIGHT ? length - 1 : 0;
      var i = IS_RIGHT ? -1 : 1;
      if (argumentsLength < 2) while (true) {
        if (index in self) {
          memo = self[index];
          index += i;
          break;
        }
        index += i;
        if (IS_RIGHT ? index < 0 : length <= index) {
          throw TypeError('Reduce of empty array with no initial value');
        }
      }
      for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
        memo = callbackfn(memo, self[index], index, O);
      }
      return memo;
    };
  };

  var arrayReduce = {
    // `Array.prototype.reduce` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
    left: createMethod$3(false),
    // `Array.prototype.reduceRight` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
    right: createMethod$3(true)
  };

  var $reduce = arrayReduce.left;


  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  _export({ target: 'Array', proto: true, forced: sloppyArrayMethod('reduce') }, {
    reduce: function reduce(callbackfn /* , initialValue */) {
      return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var $reduceRight = arrayReduce.right;


  // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  _export({ target: 'Array', proto: true, forced: sloppyArrayMethod('reduceRight') }, {
    reduceRight: function reduceRight(callbackfn /* , initialValue */) {
      return $reduceRight(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var nativeReverse = [].reverse;
  var test$1 = [1, 2];

  // `Array.prototype.reverse` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reverse
  // fix for Safari 12.0 bug
  // https://bugs.webkit.org/show_bug.cgi?id=188794
  _export({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
    reverse: function reverse() {
      if (isArray(this)) this.length = this.length;
      return nativeReverse.call(this);
    }
  });

  var SPECIES$2 = wellKnownSymbol('species');
  var nativeSlice = [].slice;
  var max$1 = Math.max;

  // `Array.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.slice
  // fallback for not array-like ES3 strings and DOM objects
  _export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('slice') }, {
    slice: function slice(start, end) {
      var O = toIndexedObject(this);
      var length = toLength(O.length);
      var k = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === undefined ? length : end, length);
      // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
      var Constructor, result, n;
      if (isArray(O)) {
        Constructor = O.constructor;
        // cross-realm fallback
        if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
          Constructor = undefined;
        } else if (isObject(Constructor)) {
          Constructor = Constructor[SPECIES$2];
          if (Constructor === null) Constructor = undefined;
        }
        if (Constructor === Array || Constructor === undefined) {
          return nativeSlice.call(O, k, fin);
        }
      }
      result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
      for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
      result.length = n;
      return result;
    }
  });

  var $some = arrayIteration.some;


  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  _export({ target: 'Array', proto: true, forced: sloppyArrayMethod('some') }, {
    some: function some(callbackfn /* , thisArg */) {
      return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var nativeSort = [].sort;
  var test$2 = [1, 2, 3];

  // IE8-
  var FAILS_ON_UNDEFINED = fails(function () {
    test$2.sort(undefined);
  });
  // V8 bug
  var FAILS_ON_NULL = fails(function () {
    test$2.sort(null);
  });
  // Old WebKit
  var SLOPPY_METHOD$3 = sloppyArrayMethod('sort');

  var FORCED$2 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || SLOPPY_METHOD$3;

  // `Array.prototype.sort` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.sort
  _export({ target: 'Array', proto: true, forced: FORCED$2 }, {
    sort: function sort(comparefn) {
      return comparefn === undefined
        ? nativeSort.call(toObject(this))
        : nativeSort.call(toObject(this), aFunction$1(comparefn));
    }
  });

  var max$2 = Math.max;
  var min$4 = Math.min;
  var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

  // `Array.prototype.splice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.splice
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('splice') }, {
    splice: function splice(start, deleteCount /* , ...items */) {
      var O = toObject(this);
      var len = toLength(O.length);
      var actualStart = toAbsoluteIndex(start, len);
      var argumentsLength = arguments.length;
      var insertCount, actualDeleteCount, A, k, from, to;
      if (argumentsLength === 0) {
        insertCount = actualDeleteCount = 0;
      } else if (argumentsLength === 1) {
        insertCount = 0;
        actualDeleteCount = len - actualStart;
      } else {
        insertCount = argumentsLength - 2;
        actualDeleteCount = min$4(max$2(toInteger(deleteCount), 0), len - actualStart);
      }
      if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
        throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
      }
      A = arraySpeciesCreate(O, actualDeleteCount);
      for (k = 0; k < actualDeleteCount; k++) {
        from = actualStart + k;
        if (from in O) createProperty(A, k, O[from]);
      }
      A.length = actualDeleteCount;
      if (insertCount < actualDeleteCount) {
        for (k = actualStart; k < len - actualDeleteCount; k++) {
          from = k + actualDeleteCount;
          to = k + insertCount;
          if (from in O) O[to] = O[from];
          else delete O[to];
        }
        for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
      } else if (insertCount > actualDeleteCount) {
        for (k = len - actualDeleteCount; k > actualStart; k--) {
          from = k + actualDeleteCount - 1;
          to = k + insertCount - 1;
          if (from in O) O[to] = O[from];
          else delete O[to];
        }
      }
      for (k = 0; k < insertCount; k++) {
        O[k + actualStart] = arguments[k + 2];
      }
      O.length = len - actualDeleteCount + insertCount;
      return A;
    }
  });

  var SPECIES$3 = wellKnownSymbol('species');

  var setSpecies = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;

    if (descriptors && Constructor && !Constructor[SPECIES$3]) {
      defineProperty(Constructor, SPECIES$3, {
        configurable: true,
        get: function () { return this; }
      });
    }
  };

  // `Array[@@species]` getter
  // https://tc39.github.io/ecma262/#sec-get-array-@@species
  setSpecies('Array');

  // this method was added to unscopables after implementation
  // in popular engines, so it's moved to a separate module


  addToUnscopables('flat');

  // this method was added to unscopables after implementation
  // in popular engines, so it's moved to a separate module


  addToUnscopables('flatMap');

  var ITERATOR$3 = wellKnownSymbol('iterator');
  var BUGGY_SAFARI_ITERATORS = false;

  var returnThis = function () { return this; };

  // `%IteratorPrototype%` object
  // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
  }

  if (IteratorPrototype == undefined) IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  if ( !has(IteratorPrototype, ITERATOR$3)) hide(IteratorPrototype, ITERATOR$3, returnThis);

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





  var returnThis$1 = function () { return this; };

  var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
    iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$4 = wellKnownSymbol('iterator');
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis$2 = function () { return this; };

  var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
        case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
        case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
      } return function () { return new IteratorConstructor(this); };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$4]
      || IterablePrototype['@@iterator']
      || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
      if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
        if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
          } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
            hide(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return nativeIterator.call(this); };
    }

    // define iterator
    if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
      hide(IterablePrototype, ITERATOR$4, defaultIterator);
    }
    iterators[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine(IterablePrototype, KEY, methods[KEY]);
        }
      } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
    }

    return methods;
  };

  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$1 = internalState.set;
  var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.github.io/ecma262/#sec-createarrayiterator
  var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
    setInternalState$1(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$1(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = undefined;
      return { value: undefined, done: true };
    }
    if (kind == 'keys') return { value: index, done: false };
    if (kind == 'values') return { value: target[index], done: false };
    return { value: [index, target[index]], done: false };
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
  iterators.Arguments = iterators.Array;

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');

  var fromCharCode = String.fromCharCode;
  var nativeFromCodePoint = String.fromCodePoint;

  // length should be 1, old FF problem
  var INCORRECT_LENGTH = !!nativeFromCodePoint && nativeFromCodePoint.length != 1;

  // `String.fromCodePoint` method
  // https://tc39.github.io/ecma262/#sec-string.fromcodepoint
  _export({ target: 'String', stat: true, forced: INCORRECT_LENGTH }, {
    fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
      var elements = [];
      var length = arguments.length;
      var i = 0;
      var code;
      while (length > i) {
        code = +arguments[i++];
        if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw RangeError(code + ' is not a valid code point');
        elements.push(code < 0x10000
          ? fromCharCode(code)
          : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00)
        );
      } return elements.join('');
    }
  });

  // `String.raw` method
  // https://tc39.github.io/ecma262/#sec-string.raw
  _export({ target: 'String', stat: true }, {
    raw: function raw(template) {
      var rawTemplate = toIndexedObject(template.raw);
      var literalSegments = toLength(rawTemplate.length);
      var argumentsLength = arguments.length;
      var elements = [];
      var i = 0;
      while (literalSegments > i) {
        elements.push(String(rawTemplate[i++]));
        if (i < argumentsLength) elements.push(String(arguments[i]));
      } return elements.join('');
    }
  });

  // `String.prototype.{ codePointAt, at }` methods implementation
  var createMethod$4 = function (CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = String(requireObjectCoercible($this));
      var position = toInteger(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = S.charCodeAt(position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size
        || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
          ? CONVERT_TO_STRING ? S.charAt(position) : first
          : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };

  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod$4(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod$4(true)
  };

  var codeAt = stringMultibyte.codeAt;

  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  _export({ target: 'String', proto: true }, {
    codePointAt: function codePointAt(pos) {
      return codeAt(this, pos);
    }
  });

  var MATCH = wellKnownSymbol('match');

  // `IsRegExp` abstract operation
  // https://tc39.github.io/ecma262/#sec-isregexp
  var isRegexp = function (it) {
    var isRegExp;
    return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
  };

  var notARegexp = function (it) {
    if (isRegexp(it)) {
      throw TypeError("The method doesn't accept regular expressions");
    } return it;
  };

  var MATCH$1 = wellKnownSymbol('match');

  var correctIsRegexpLogic = function (METHOD_NAME) {
    var regexp = /./;
    try {
      '/./'[METHOD_NAME](regexp);
    } catch (e) {
      try {
        regexp[MATCH$1] = false;
        return '/./'[METHOD_NAME](regexp);
      } catch (f) { /* empty */ }
    } return false;
  };

  var nativeEndsWith = ''.endsWith;
  var min$5 = Math.min;

  // `String.prototype.endsWith` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.endswith
  _export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('endsWith') }, {
    endsWith: function endsWith(searchString /* , endPosition = @length */) {
      var that = String(requireObjectCoercible(this));
      notARegexp(searchString);
      var endPosition = arguments.length > 1 ? arguments[1] : undefined;
      var len = toLength(that.length);
      var end = endPosition === undefined ? len : min$5(toLength(endPosition), len);
      var search = String(searchString);
      return nativeEndsWith
        ? nativeEndsWith.call(that, search, end)
        : that.slice(end - search.length, end) === search;
    }
  });

  // `String.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.includes
  _export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
    includes: function includes(searchString /* , position = 0 */) {
      return !!~String(requireObjectCoercible(this))
        .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // `RegExp.prototype.flags` getter implementation
  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
  var regexpFlags = function () {
    var that = anObject(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.dotAll) result += 's';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  var nativeExec = RegExp.prototype.exec;
  // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.
  var nativeReplace = String.prototype.replace;

  var patchedExec = nativeExec;

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/;
    var re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
  })();

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

      match = nativeExec.call(re, str);

      if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  var regexpExec = patchedExec;

  var SPECIES$4 = wellKnownSymbol('species');

  var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = { a: '7' };
      return result;
    };
    return ''.replace(re, '$<a>') !== '7';
  });

  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  // Weex JS has frozen built-in prototypes, so use try / catch wrapper
  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () { return originalExec.apply(this, arguments); };
    var result = 'ab'.split(re);
    return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
  });

  var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
    var SYMBOL = wellKnownSymbol(KEY);

    var DELEGATES_TO_SYMBOL = !fails(function () {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function () { return 7; };
      return ''[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;
      re.exec = function () { execCalled = true; return null; };

      if (KEY === 'split') {
        // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.
        re.constructor = {};
        re.constructor[SPECIES$4] = function () { return re; };
      }

      re[SYMBOL]('');
      return !execCalled;
    });

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
      (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      var nativeRegExpMethod = /./[SYMBOL];
      var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      });
      var stringMethod = methods[0];
      var regexMethod = methods[1];

      redefine(String.prototype, KEY, stringMethod);
      redefine(RegExp.prototype, SYMBOL, length == 2
        // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
        // 21.2.5.11 RegExp.prototype[@@split](string, limit)
        ? function (string, arg) { return regexMethod.call(string, this, arg); }
        // 21.2.5.6 RegExp.prototype[@@match](string)
        // 21.2.5.9 RegExp.prototype[@@search](string)
        : function (string) { return regexMethod.call(string, this); }
      );
      if (sham) hide(RegExp.prototype[SYMBOL], 'sham', true);
    }
  };

  var charAt = stringMultibyte.charAt;

  // `AdvanceStringIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-advancestringindex
  var advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? charAt(S, index).length : 1);
  };

  // `RegExpExec` abstract operation
  // https://tc39.github.io/ecma262/#sec-regexpexec
  var regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (typeof exec === 'function') {
      var result = exec.call(R, S);
      if (typeof result !== 'object') {
        throw TypeError('RegExp exec method returned something other than an Object or null');
      }
      return result;
    }

    if (classofRaw(R) !== 'RegExp') {
      throw TypeError('RegExp#exec called on incompatible receiver');
    }

    return regexpExec.call(R, S);
  };

  // @@match logic
  fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
    return [
      // `String.prototype.match` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.match
      function match(regexp) {
        var O = requireObjectCoercible(this);
        var matcher = regexp == undefined ? undefined : regexp[MATCH];
        return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
      },
      // `RegExp.prototype[@@match]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
      function (regexp) {
        var res = maybeCallNative(nativeMatch, regexp, this);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);

        if (!rx.global) return regexpExecAbstract(rx, S);

        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
        var A = [];
        var n = 0;
        var result;
        while ((result = regexpExecAbstract(rx, S)) !== null) {
          var matchStr = String(result[0]);
          A[n] = matchStr;
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
          n++;
        }
        return n === 0 ? null : A;
      }
    ];
  });

  var SPECIES$5 = wellKnownSymbol('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.github.io/ecma262/#sec-speciesconstructor
  var speciesConstructor = function (O, defaultConstructor) {
    var C = anObject(O).constructor;
    var S;
    return C === undefined || (S = anObject(C)[SPECIES$5]) == undefined ? defaultConstructor : aFunction$1(S);
  };

  var MATCH_ALL = wellKnownSymbol('matchAll');
  var REGEXP_STRING = 'RegExp String';
  var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
  var setInternalState$2 = internalState.set;
  var getInternalState$2 = internalState.getterFor(REGEXP_STRING_ITERATOR);
  var RegExpPrototype = RegExp.prototype;
  var regExpBuiltinExec = RegExpPrototype.exec;

  var regExpExec = function (R, S) {
    var exec = R.exec;
    var result;
    if (typeof exec == 'function') {
      result = exec.call(R, S);
      if (typeof result != 'object') throw TypeError('Incorrect exec result');
      return result;
    } return regExpBuiltinExec.call(R, S);
  };

  // eslint-disable-next-line max-len
  var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, global, fullUnicode) {
    setInternalState$2(this, {
      type: REGEXP_STRING_ITERATOR,
      regexp: regexp,
      string: string,
      global: global,
      unicode: fullUnicode,
      done: false
    });
  }, REGEXP_STRING, function next() {
    var state = getInternalState$2(this);
    if (state.done) return { value: undefined, done: true };
    var R = state.regexp;
    var S = state.string;
    var match = regExpExec(R, S);
    if (match === null) return { value: undefined, done: state.done = true };
    if (state.global) {
      if (String(match[0]) == '') R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode);
      return { value: match, done: false };
    }
    state.done = true;
    return { value: match, done: false };
  });

  var $matchAll = function (string) {
    var R = anObject(this);
    var S = String(string);
    var C, flagsValue, flags, matcher, global, fullUnicode;
    C = speciesConstructor(R, RegExp);
    flagsValue = R.flags;
    if (flagsValue === undefined && R instanceof RegExp && !('flags' in RegExpPrototype)) {
      flagsValue = regexpFlags.call(R);
    }
    flags = flagsValue === undefined ? '' : String(flagsValue);
    matcher = new C(C === RegExp ? R.source : R, flags);
    global = !!~flags.indexOf('g');
    fullUnicode = !!~flags.indexOf('u');
    matcher.lastIndex = toLength(R.lastIndex);
    return new $RegExpStringIterator(matcher, S, global, fullUnicode);
  };

  // `String.prototype.matchAll` method
  // https://github.com/tc39/proposal-string-matchall
  _export({ target: 'String', proto: true }, {
    matchAll: function matchAll(regexp) {
      var O = requireObjectCoercible(this);
      var S, matcher, rx;
      if (regexp != null) {
        matcher = regexp[MATCH_ALL];
        if (matcher === undefined && isPure && classof(regexp) == 'RegExp') matcher = $matchAll;
        if (matcher != null) return aFunction$1(matcher).call(regexp, O);
      }
      S = String(O);
      rx = new RegExp(regexp, 'g');
      return  rx[MATCH_ALL](S);
    }
  });

   MATCH_ALL in RegExpPrototype || hide(RegExpPrototype, MATCH_ALL, $matchAll);

  // `String.prototype.repeat` method implementation
  // https://tc39.github.io/ecma262/#sec-string.prototype.repeat
  var stringRepeat = ''.repeat || function repeat(count) {
    var str = String(requireObjectCoercible(this));
    var result = '';
    var n = toInteger(count);
    if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
    for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
    return result;
  };

  // https://github.com/tc39/proposal-string-pad-start-end




  var ceil$1 = Math.ceil;

  // `String.prototype.{ padStart, padEnd }` methods implementation
  var createMethod$5 = function (IS_END) {
    return function ($this, maxLength, fillString) {
      var S = String(requireObjectCoercible($this));
      var stringLength = S.length;
      var fillStr = fillString === undefined ? ' ' : String(fillString);
      var intMaxLength = toLength(maxLength);
      var fillLen, stringFiller;
      if (intMaxLength <= stringLength || fillStr == '') return S;
      fillLen = intMaxLength - stringLength;
      stringFiller = stringRepeat.call(fillStr, ceil$1(fillLen / fillStr.length));
      if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
      return IS_END ? S + stringFiller : stringFiller + S;
    };
  };

  var stringPad = {
    // `String.prototype.padStart` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
    start: createMethod$5(false),
    // `String.prototype.padEnd` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.padend
    end: createMethod$5(true)
  };

  var userAgent = getBuiltIn('navigator', 'userAgent') || '';

  // https://github.com/zloirock/core-js/issues/280


  // eslint-disable-next-line unicorn/no-unsafe-regex
  var webkitStringPadBug = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);

  var $padEnd = stringPad.end;


  // `String.prototype.padEnd` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.padend
  _export({ target: 'String', proto: true, forced: webkitStringPadBug }, {
    padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
      return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var $padStart = stringPad.start;


  // `String.prototype.padStart` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
  _export({ target: 'String', proto: true, forced: webkitStringPadBug }, {
    padStart: function padStart(maxLength /* , fillString = ' ' */) {
      return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // `String.prototype.repeat` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.repeat
  _export({ target: 'String', proto: true }, {
    repeat: stringRepeat
  });

  var max$3 = Math.max;
  var min$6 = Math.min;
  var floor$1 = Math.floor;
  var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
  var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

  var maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };

  // @@replace logic
  fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative) {
    return [
      // `String.prototype.replace` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = requireObjectCoercible(this);
        var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
        return replacer !== undefined
          ? replacer.call(searchValue, O, replaceValue)
          : nativeReplace.call(String(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
      function (regexp, replaceValue) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);

        var functionalReplace = typeof replaceValue === 'function';
        if (!functionalReplace) replaceValue = String(replaceValue);

        var global = rx.global;
        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }
        var results = [];
        while (true) {
          var result = regexpExecAbstract(rx, S);
          if (result === null) break;

          results.push(result);
          if (!global) break;

          var matchStr = String(result[0]);
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        }

        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];

          var matched = String(result[0]);
          var position = max$3(min$6(toInteger(result.index), S.length), 0);
          var captures = [];
          // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
          for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = [matched].concat(captures, position, S);
            if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
            var replacement = String(replaceValue.apply(undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + S.slice(nextSourcePosition);
      }
    ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
    function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
      if (namedCaptures !== undefined) {
        namedCaptures = toObject(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }
      return nativeReplace.call(replacement, symbols, function (match, ch) {
        var capture;
        switch (ch.charAt(0)) {
          case '$': return '$';
          case '&': return matched;
          case '`': return str.slice(0, position);
          case "'": return str.slice(tailPos);
          case '<':
            capture = namedCaptures[ch.slice(1, -1)];
            break;
          default: // \d\d?
            var n = +ch;
            if (n === 0) return match;
            if (n > m) {
              var f = floor$1(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
              return match;
            }
            capture = captures[n - 1];
        }
        return capture === undefined ? '' : capture;
      });
    }
  });

  // @@search logic
  fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
    return [
      // `String.prototype.search` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.search
      function search(regexp) {
        var O = requireObjectCoercible(this);
        var searcher = regexp == undefined ? undefined : regexp[SEARCH];
        return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
      },
      // `RegExp.prototype[@@search]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
      function (regexp) {
        var res = maybeCallNative(nativeSearch, regexp, this);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);

        var previousLastIndex = rx.lastIndex;
        if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
        var result = regexpExecAbstract(rx, S);
        if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
        return result === null ? -1 : result.index;
      }
    ];
  });

  var arrayPush = [].push;
  var min$7 = Math.min;
  var MAX_UINT32 = 0xFFFFFFFF;

  // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
  var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

  // @@split logic
  fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
    var internalSplit;
    if (
      'abbc'.split(/(b)*/)[1] == 'c' ||
      'test'.split(/(?:)/, -1).length != 4 ||
      'ab'.split(/(?:ab)*/).length != 2 ||
      '.'.split(/(.?)(.?)/).length != 4 ||
      '.'.split(/()()/).length > 1 ||
      ''.split(/.?/).length
    ) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function (separator, limit) {
        var string = String(requireObjectCoercible(this));
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (separator === undefined) return [string];
        // If `separator` is not a regex, use native split
        if (!isRegexp(separator)) {
          return nativeSplit.call(string, separator, lim);
        }
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = regexpExec.call(separatorCopy, string)) {
          lastIndex = separatorCopy.lastIndex;
          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= lim) break;
          }
          if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
        }
        if (lastLastIndex === string.length) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));
        return output.length > lim ? output.slice(0, lim) : output;
      };
    // Chakra, V8
    } else if ('0'.split(undefined, 0).length) {
      internalSplit = function (separator, limit) {
        return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
      };
    } else internalSplit = nativeSplit;

    return [
      // `String.prototype.split` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = requireObjectCoercible(this);
        var splitter = separator == undefined ? undefined : separator[SPLIT];
        return splitter !== undefined
          ? splitter.call(separator, O, limit)
          : internalSplit.call(String(O), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (regexp, limit) {
        var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);
        var C = speciesConstructor(rx, RegExp);

        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (SUPPORTS_Y ? 'y' : 'g');

        // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.
        var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = SUPPORTS_Y ? q : 0;
          var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
          var e;
          if (
            z === null ||
            (e = min$7(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
          ) {
            q = advanceStringIndex(S, q, unicodeMatching);
          } else {
            A.push(S.slice(p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              A.push(z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        A.push(S.slice(p));
        return A;
      }
    ];
  }, !SUPPORTS_Y);

  var nativeStartsWith = ''.startsWith;
  var min$8 = Math.min;

  // `String.prototype.startsWith` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.startswith
  _export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('startsWith') }, {
    startsWith: function startsWith(searchString /* , position = 0 */) {
      var that = String(requireObjectCoercible(this));
      notARegexp(searchString);
      var index = toLength(min$8(arguments.length > 1 ? arguments[1] : undefined, that.length));
      var search = String(searchString);
      return nativeStartsWith
        ? nativeStartsWith.call(that, search, index)
        : that.slice(index, index + search.length) === search;
    }
  });

  // a string of all valid unicode whitespaces
  // eslint-disable-next-line max-len
  var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

  var whitespace = '[' + whitespaces + ']';
  var ltrim = RegExp('^' + whitespace + whitespace + '*');
  var rtrim = RegExp(whitespace + whitespace + '*$');

  // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
  var createMethod$6 = function (TYPE) {
    return function ($this) {
      var string = String(requireObjectCoercible($this));
      if (TYPE & 1) string = string.replace(ltrim, '');
      if (TYPE & 2) string = string.replace(rtrim, '');
      return string;
    };
  };

  var stringTrim = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
    start: createMethod$6(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
    end: createMethod$6(2),
    // `String.prototype.trim` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.trim
    trim: createMethod$6(3)
  };

  var non = '\u200B\u0085\u180E';

  // check that a method works with the correct list
  // of whitespaces and has a correct name
  var forcedStringTrimMethod = function (METHOD_NAME) {
    return fails(function () {
      return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
    });
  };

  var $trim = stringTrim.trim;


  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  _export({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
    trim: function trim() {
      return $trim(this);
    }
  });

  var $trimStart = stringTrim.start;


  var FORCED$3 = forcedStringTrimMethod('trimStart');

  var trimStart = FORCED$3 ? function trimStart() {
    return $trimStart(this);
  } : ''.trimStart;

  // `String.prototype.{ trimStart, trimLeft }` methods
  // https://github.com/tc39/ecmascript-string-left-right-trim
  _export({ target: 'String', proto: true, forced: FORCED$3 }, {
    trimStart: trimStart,
    trimLeft: trimStart
  });

  var $trimEnd = stringTrim.end;


  var FORCED$4 = forcedStringTrimMethod('trimEnd');

  var trimEnd = FORCED$4 ? function trimEnd() {
    return $trimEnd(this);
  } : ''.trimEnd;

  // `String.prototype.{ trimEnd, trimRight }` methods
  // https://github.com/tc39/ecmascript-string-left-right-trim
  _export({ target: 'String', proto: true, forced: FORCED$4 }, {
    trimEnd: trimEnd,
    trimRight: trimEnd
  });

  var charAt$1 = stringMultibyte.charAt;



  var STRING_ITERATOR = 'String Iterator';
  var setInternalState$3 = internalState.set;
  var getInternalState$3 = internalState.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
  defineIterator(String, 'String', function (iterated) {
    setInternalState$3(this, {
      type: STRING_ITERATOR,
      string: String(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState$3(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: undefined, done: true };
    point = charAt$1(string, index);
    state.index += point.length;
    return { value: point, done: false };
  });

  var quot = /"/g;

  // B.2.3.2.1 CreateHTML(string, tag, attribute, value)
  // https://tc39.github.io/ecma262/#sec-createhtml
  var createHtml = function (string, tag, attribute, value) {
    var S = String(requireObjectCoercible(string));
    var p1 = '<' + tag;
    if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
    return p1 + '>' + S + '</' + tag + '>';
  };

  // check the existence of a method, lowercase
  // of a tag and escaping quotes in arguments
  var forcedStringHtmlMethod = function (METHOD_NAME) {
    return fails(function () {
      var test = ''[METHOD_NAME]('"');
      return test !== test.toLowerCase() || test.split('"').length > 3;
    });
  };

  // `String.prototype.anchor` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.anchor
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('anchor') }, {
    anchor: function anchor(name) {
      return createHtml(this, 'a', 'name', name);
    }
  });

  // `String.prototype.big` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.big
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('big') }, {
    big: function big() {
      return createHtml(this, 'big', '', '');
    }
  });

  // `String.prototype.blink` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.blink
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('blink') }, {
    blink: function blink() {
      return createHtml(this, 'blink', '', '');
    }
  });

  // `String.prototype.bold` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.bold
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('bold') }, {
    bold: function bold() {
      return createHtml(this, 'b', '', '');
    }
  });

  // `String.prototype.fixed` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.fixed
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('fixed') }, {
    fixed: function fixed() {
      return createHtml(this, 'tt', '', '');
    }
  });

  // `String.prototype.fontcolor` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.fontcolor
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('fontcolor') }, {
    fontcolor: function fontcolor(color) {
      return createHtml(this, 'font', 'color', color);
    }
  });

  // `String.prototype.fontsize` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.fontsize
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('fontsize') }, {
    fontsize: function fontsize(size) {
      return createHtml(this, 'font', 'size', size);
    }
  });

  // `String.prototype.italics` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.italics
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('italics') }, {
    italics: function italics() {
      return createHtml(this, 'i', '', '');
    }
  });

  // `String.prototype.link` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.link
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('link') }, {
    link: function link(url) {
      return createHtml(this, 'a', 'href', url);
    }
  });

  // `String.prototype.small` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.small
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('small') }, {
    small: function small() {
      return createHtml(this, 'small', '', '');
    }
  });

  // `String.prototype.strike` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.strike
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('strike') }, {
    strike: function strike() {
      return createHtml(this, 'strike', '', '');
    }
  });

  // `String.prototype.sub` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.sub
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('sub') }, {
    sub: function sub() {
      return createHtml(this, 'sub', '', '');
    }
  });

  // `String.prototype.sup` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.sup
  _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('sup') }, {
    sup: function sup() {
      return createHtml(this, 'sup', '', '');
    }
  });

  // makes subclassing work correct for wrapped built-ins
  var inheritIfRequired = function ($this, dummy, Wrapper) {
    var NewTarget, NewTargetPrototype;
    if (
      // it can work only with native `setPrototypeOf`
      objectSetPrototypeOf &&
      // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
      typeof (NewTarget = dummy.constructor) == 'function' &&
      NewTarget !== Wrapper &&
      isObject(NewTargetPrototype = NewTarget.prototype) &&
      NewTargetPrototype !== Wrapper.prototype
    ) objectSetPrototypeOf($this, NewTargetPrototype);
    return $this;
  };

  var defineProperty$4 = objectDefineProperty.f;
  var getOwnPropertyNames = objectGetOwnPropertyNames.f;







  var MATCH$2 = wellKnownSymbol('match');
  var NativeRegExp = global_1.RegExp;
  var RegExpPrototype$1 = NativeRegExp.prototype;
  var re1 = /a/g;
  var re2 = /a/g;

  // "new" should create a new object, old webkit bug
  var CORRECT_NEW = new NativeRegExp(re1) !== re1;

  var FORCED$5 = descriptors && isForced_1('RegExp', (!CORRECT_NEW || fails(function () {
    re2[MATCH$2] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  })));

  // `RegExp` constructor
  // https://tc39.github.io/ecma262/#sec-regexp-constructor
  if (FORCED$5) {
    var RegExpWrapper = function RegExp(pattern, flags) {
      var thisIsRegExp = this instanceof RegExpWrapper;
      var patternIsRegExp = isRegexp(pattern);
      var flagsAreUndefined = flags === undefined;
      return !thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined ? pattern
        : inheritIfRequired(CORRECT_NEW
          ? new NativeRegExp(patternIsRegExp && !flagsAreUndefined ? pattern.source : pattern, flags)
          : NativeRegExp((patternIsRegExp = pattern instanceof RegExpWrapper)
            ? pattern.source
            : pattern, patternIsRegExp && flagsAreUndefined ? regexpFlags.call(pattern) : flags)
        , thisIsRegExp ? this : RegExpPrototype$1, RegExpWrapper);
    };
    var proxy = function (key) {
      key in RegExpWrapper || defineProperty$4(RegExpWrapper, key, {
        configurable: true,
        get: function () { return NativeRegExp[key]; },
        set: function (it) { NativeRegExp[key] = it; }
      });
    };
    var keys$1 = getOwnPropertyNames(NativeRegExp);
    var index = 0;
    while (keys$1.length > index) proxy(keys$1[index++]);
    RegExpPrototype$1.constructor = RegExpWrapper;
    RegExpWrapper.prototype = RegExpPrototype$1;
    redefine(global_1, 'RegExp', RegExpWrapper);
  }

  // https://tc39.github.io/ecma262/#sec-get-regexp-@@species
  setSpecies('RegExp');

  _export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
    exec: regexpExec
  });

  // `RegExp.prototype.flags` getter
  // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
  if (descriptors && /./g.flags != 'g') {
    objectDefineProperty.f(RegExp.prototype, 'flags', {
      configurable: true,
      get: regexpFlags
    });
  }

  var TO_STRING = 'toString';
  var RegExpPrototype$2 = RegExp.prototype;
  var nativeToString = RegExpPrototype$2[TO_STRING];

  var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
  // FF44- RegExp#toString has a wrong name
  var INCORRECT_NAME = nativeToString.name != TO_STRING;

  // `RegExp.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
  if (NOT_GENERIC || INCORRECT_NAME) {
    redefine(RegExp.prototype, TO_STRING, function toString() {
      var R = anObject(this);
      var p = String(R.source);
      var rf = R.flags;
      var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$2) ? regexpFlags.call(R) : rf);
      return '/' + p + '/' + f;
    }, { unsafe: true });
  }

  var trim = stringTrim.trim;


  var nativeParseInt = global_1.parseInt;
  var hex = /^[+-]?0[Xx]/;
  var FORCED$6 = nativeParseInt(whitespaces + '08') !== 8 || nativeParseInt(whitespaces + '0x16') !== 22;

  // `parseInt` method
  // https://tc39.github.io/ecma262/#sec-parseint-string-radix
  var _parseInt = FORCED$6 ? function parseInt(string, radix) {
    var S = trim(String(string));
    return nativeParseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
  } : nativeParseInt;

  // `parseInt` method
  // https://tc39.github.io/ecma262/#sec-parseint-string-radix
  _export({ global: true, forced: parseInt != _parseInt }, {
    parseInt: _parseInt
  });

  var trim$1 = stringTrim.trim;


  var nativeParseFloat = global_1.parseFloat;
  var FORCED$7 = 1 / nativeParseFloat(whitespaces + '-0') !== -Infinity;

  // `parseFloat` method
  // https://tc39.github.io/ecma262/#sec-parsefloat-string
  var _parseFloat = FORCED$7 ? function parseFloat(string) {
    var trimmedString = trim$1(String(string));
    var result = nativeParseFloat(trimmedString);
    return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
  } : nativeParseFloat;

  // `parseFloat` method
  // https://tc39.github.io/ecma262/#sec-parsefloat-string
  _export({ global: true, forced: parseFloat != _parseFloat }, {
    parseFloat: _parseFloat
  });

  var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
  var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;
  var defineProperty$5 = objectDefineProperty.f;
  var trim$2 = stringTrim.trim;

  var NUMBER = 'Number';
  var NativeNumber = global_1[NUMBER];
  var NumberPrototype = NativeNumber.prototype;

  // Opera ~12 has broken Object#toString
  var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

  // `ToNumber` abstract operation
  // https://tc39.github.io/ecma262/#sec-tonumber
  var toNumber = function (argument) {
    var it = toPrimitive(argument, false);
    var first, third, radix, maxCode, digits, length, index, code;
    if (typeof it == 'string' && it.length > 2) {
      it = trim$2(it);
      first = it.charCodeAt(0);
      if (first === 43 || first === 45) {
        third = it.charCodeAt(2);
        if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
      } else if (first === 48) {
        switch (it.charCodeAt(1)) {
          case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
          case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
          default: return +it;
        }
        digits = it.slice(2);
        length = digits.length;
        for (index = 0; index < length; index++) {
          code = digits.charCodeAt(index);
          // parseInt parses a string to a first unavailable symbol
          // but ToNumber should return NaN if a string contains unavailable symbols
          if (code < 48 || code > maxCode) return NaN;
        } return parseInt(digits, radix);
      }
    } return +it;
  };

  // `Number` constructor
  // https://tc39.github.io/ecma262/#sec-number-constructor
  if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
    var NumberWrapper = function Number(value) {
      var it = arguments.length < 1 ? 0 : value;
      var dummy = this;
      return dummy instanceof NumberWrapper
        // check on 1..constructor(foo) case
        && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
          ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
    };
    for (var keys$2 = descriptors ? getOwnPropertyNames$1(NativeNumber) : (
      // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
      // ES2015 (in case, if modules with ES2015 Number statics required before):
      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
    ).split(','), j = 0, key; keys$2.length > j; j++) {
      if (has(NativeNumber, key = keys$2[j]) && !has(NumberWrapper, key)) {
        defineProperty$5(NumberWrapper, key, getOwnPropertyDescriptor$4(NativeNumber, key));
      }
    }
    NumberWrapper.prototype = NumberPrototype;
    NumberPrototype.constructor = NumberWrapper;
    redefine(global_1, NUMBER, NumberWrapper);
  }

  // `Number.EPSILON` constant
  // https://tc39.github.io/ecma262/#sec-number.epsilon
  _export({ target: 'Number', stat: true }, {
    EPSILON: Math.pow(2, -52)
  });

  var globalIsFinite = global_1.isFinite;

  // `Number.isFinite` method
  // https://tc39.github.io/ecma262/#sec-number.isfinite
  var numberIsFinite = Number.isFinite || function isFinite(it) {
    return typeof it == 'number' && globalIsFinite(it);
  };

  // `Number.isFinite` method
  // https://tc39.github.io/ecma262/#sec-number.isfinite
  _export({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

  var floor$2 = Math.floor;

  // `Number.isInteger` method implementation
  // https://tc39.github.io/ecma262/#sec-number.isinteger
  var isInteger = function isInteger(it) {
    return !isObject(it) && isFinite(it) && floor$2(it) === it;
  };

  // `Number.isInteger` method
  // https://tc39.github.io/ecma262/#sec-number.isinteger
  _export({ target: 'Number', stat: true }, {
    isInteger: isInteger
  });

  // `Number.isNaN` method
  // https://tc39.github.io/ecma262/#sec-number.isnan
  _export({ target: 'Number', stat: true }, {
    isNaN: function isNaN(number) {
      // eslint-disable-next-line no-self-compare
      return number != number;
    }
  });

  var abs = Math.abs;

  // `Number.isSafeInteger` method
  // https://tc39.github.io/ecma262/#sec-number.issafeinteger
  _export({ target: 'Number', stat: true }, {
    isSafeInteger: function isSafeInteger(number) {
      return isInteger(number) && abs(number) <= 0x1FFFFFFFFFFFFF;
    }
  });

  // `Number.MAX_SAFE_INTEGER` constant
  // https://tc39.github.io/ecma262/#sec-number.max_safe_integer
  _export({ target: 'Number', stat: true }, {
    MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
  });

  // `Number.MIN_SAFE_INTEGER` constant
  // https://tc39.github.io/ecma262/#sec-number.min_safe_integer
  _export({ target: 'Number', stat: true }, {
    MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
  });

  // `Number.parseFloat` method
  // https://tc39.github.io/ecma262/#sec-number.parseFloat
  _export({ target: 'Number', stat: true, forced: Number.parseFloat != _parseFloat }, {
    parseFloat: _parseFloat
  });

  // `Number.parseInt` method
  // https://tc39.github.io/ecma262/#sec-number.parseint
  _export({ target: 'Number', stat: true, forced: Number.parseInt != _parseInt }, {
    parseInt: _parseInt
  });

  // `thisNumberValue` abstract operation
  // https://tc39.github.io/ecma262/#sec-thisnumbervalue
  var thisNumberValue = function (value) {
    if (typeof value != 'number' && classofRaw(value) != 'Number') {
      throw TypeError('Incorrect invocation');
    }
    return +value;
  };

  var nativeToFixed = 1.0.toFixed;
  var floor$3 = Math.floor;

  var pow = function (x, n, acc) {
    return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
  };

  var log = function (x) {
    var n = 0;
    var x2 = x;
    while (x2 >= 4096) {
      n += 12;
      x2 /= 4096;
    }
    while (x2 >= 2) {
      n += 1;
      x2 /= 2;
    } return n;
  };

  var FORCED$8 = nativeToFixed && (
    0.00008.toFixed(3) !== '0.000' ||
    0.9.toFixed(0) !== '1' ||
    1.255.toFixed(2) !== '1.25' ||
    1000000000000000128.0.toFixed(0) !== '1000000000000000128'
  ) || !fails(function () {
    // V8 ~ Android 4.3-
    nativeToFixed.call({});
  });

  // `Number.prototype.toFixed` method
  // https://tc39.github.io/ecma262/#sec-number.prototype.tofixed
  _export({ target: 'Number', proto: true, forced: FORCED$8 }, {
    // eslint-disable-next-line max-statements
    toFixed: function toFixed(fractionDigits) {
      var number = thisNumberValue(this);
      var fractDigits = toInteger(fractionDigits);
      var data = [0, 0, 0, 0, 0, 0];
      var sign = '';
      var result = '0';
      var e, z, j, k;

      var multiply = function (n, c) {
        var index = -1;
        var c2 = c;
        while (++index < 6) {
          c2 += n * data[index];
          data[index] = c2 % 1e7;
          c2 = floor$3(c2 / 1e7);
        }
      };

      var divide = function (n) {
        var index = 6;
        var c = 0;
        while (--index >= 0) {
          c += data[index];
          data[index] = floor$3(c / n);
          c = (c % n) * 1e7;
        }
      };

      var dataToString = function () {
        var index = 6;
        var s = '';
        while (--index >= 0) {
          if (s !== '' || index === 0 || data[index] !== 0) {
            var t = String(data[index]);
            s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
          }
        } return s;
      };

      if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
      // eslint-disable-next-line no-self-compare
      if (number != number) return 'NaN';
      if (number <= -1e21 || number >= 1e21) return String(number);
      if (number < 0) {
        sign = '-';
        number = -number;
      }
      if (number > 1e-21) {
        e = log(number * pow(2, 69, 1)) - 69;
        z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
        z *= 0x10000000000000;
        e = 52 - e;
        if (e > 0) {
          multiply(0, z);
          j = fractDigits;
          while (j >= 7) {
            multiply(1e7, 0);
            j -= 7;
          }
          multiply(pow(10, j, 1), 0);
          j = e - 1;
          while (j >= 23) {
            divide(1 << 23);
            j -= 23;
          }
          divide(1 << j);
          multiply(1, 1);
          divide(2);
          result = dataToString();
        } else {
          multiply(0, z);
          multiply(1 << -e, 0);
          result = dataToString() + stringRepeat.call('0', fractDigits);
        }
      }
      if (fractDigits > 0) {
        k = result.length;
        result = sign + (k <= fractDigits
          ? '0.' + stringRepeat.call('0', fractDigits - k) + result
          : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
      } else {
        result = sign + result;
      } return result;
    }
  });

  var nativeToPrecision = 1.0.toPrecision;

  var FORCED$9 = fails(function () {
    // IE7-
    return nativeToPrecision.call(1, undefined) !== '1';
  }) || !fails(function () {
    // V8 ~ Android 4.3-
    nativeToPrecision.call({});
  });

  // `Number.prototype.toPrecision` method
  // https://tc39.github.io/ecma262/#sec-number.prototype.toprecision
  _export({ target: 'Number', proto: true, forced: FORCED$9 }, {
    toPrecision: function toPrecision(precision) {
      return precision === undefined
        ? nativeToPrecision.call(thisNumberValue(this))
        : nativeToPrecision.call(thisNumberValue(this), precision);
    }
  });

  var log$1 = Math.log;

  // `Math.log1p` method implementation
  // https://tc39.github.io/ecma262/#sec-math.log1p
  var mathLog1p = Math.log1p || function log1p(x) {
    return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log$1(1 + x);
  };

  var nativeAcosh = Math.acosh;
  var log$2 = Math.log;
  var sqrt = Math.sqrt;
  var LN2 = Math.LN2;

  var FORCED$a = !nativeAcosh
    // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
    || Math.floor(nativeAcosh(Number.MAX_VALUE)) != 710
    // Tor Browser bug: Math.acosh(Infinity) -> NaN
    || nativeAcosh(Infinity) != Infinity;

  // `Math.acosh` method
  // https://tc39.github.io/ecma262/#sec-math.acosh
  _export({ target: 'Math', stat: true, forced: FORCED$a }, {
    acosh: function acosh(x) {
      return (x = +x) < 1 ? NaN : x > 94906265.62425156
        ? log$2(x) + LN2
        : mathLog1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
    }
  });

  var nativeAsinh = Math.asinh;
  var log$3 = Math.log;
  var sqrt$1 = Math.sqrt;

  function asinh(x) {
    return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log$3(x + sqrt$1(x * x + 1));
  }

  // `Math.asinh` method
  // https://tc39.github.io/ecma262/#sec-math.asinh
  // Tor Browser bug: Math.asinh(0) -> -0
  _export({ target: 'Math', stat: true, forced: !(nativeAsinh && 1 / nativeAsinh(0) > 0) }, {
    asinh: asinh
  });

  var nativeAtanh = Math.atanh;
  var log$4 = Math.log;

  // `Math.atanh` method
  // https://tc39.github.io/ecma262/#sec-math.atanh
  // Tor Browser bug: Math.atanh(-0) -> 0
  _export({ target: 'Math', stat: true, forced: !(nativeAtanh && 1 / nativeAtanh(-0) < 0) }, {
    atanh: function atanh(x) {
      return (x = +x) == 0 ? x : log$4((1 + x) / (1 - x)) / 2;
    }
  });

  // `Math.sign` method implementation
  // https://tc39.github.io/ecma262/#sec-math.sign
  var mathSign = Math.sign || function sign(x) {
    // eslint-disable-next-line no-self-compare
    return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
  };

  var abs$1 = Math.abs;
  var pow$1 = Math.pow;

  // `Math.cbrt` method
  // https://tc39.github.io/ecma262/#sec-math.cbrt
  _export({ target: 'Math', stat: true }, {
    cbrt: function cbrt(x) {
      return mathSign(x = +x) * pow$1(abs$1(x), 1 / 3);
    }
  });

  var floor$4 = Math.floor;
  var log$5 = Math.log;
  var LOG2E = Math.LOG2E;

  // `Math.clz32` method
  // https://tc39.github.io/ecma262/#sec-math.clz32
  _export({ target: 'Math', stat: true }, {
    clz32: function clz32(x) {
      return (x >>>= 0) ? 31 - floor$4(log$5(x + 0.5) * LOG2E) : 32;
    }
  });

  var nativeExpm1 = Math.expm1;
  var exp = Math.exp;

  // `Math.expm1` method implementation
  // https://tc39.github.io/ecma262/#sec-math.expm1
  var mathExpm1 = (!nativeExpm1
    // Old FF bug
    || nativeExpm1(10) > 22025.465794806719 || nativeExpm1(10) < 22025.4657948067165168
    // Tor Browser bug
    || nativeExpm1(-2e-17) != -2e-17
  ) ? function expm1(x) {
    return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
  } : nativeExpm1;

  var nativeCosh = Math.cosh;
  var abs$2 = Math.abs;
  var E = Math.E;

  // `Math.cosh` method
  // https://tc39.github.io/ecma262/#sec-math.cosh
  _export({ target: 'Math', stat: true, forced: !nativeCosh || nativeCosh(710) === Infinity }, {
    cosh: function cosh(x) {
      var t = mathExpm1(abs$2(x) - 1) + 1;
      return (t + 1 / (t * E * E)) * (E / 2);
    }
  });

  // `Math.expm1` method
  // https://tc39.github.io/ecma262/#sec-math.expm1
  _export({ target: 'Math', stat: true, forced: mathExpm1 != Math.expm1 }, { expm1: mathExpm1 });

  var abs$3 = Math.abs;
  var pow$2 = Math.pow;
  var EPSILON = pow$2(2, -52);
  var EPSILON32 = pow$2(2, -23);
  var MAX32 = pow$2(2, 127) * (2 - EPSILON32);
  var MIN32 = pow$2(2, -126);

  var roundTiesToEven = function (n) {
    return n + 1 / EPSILON - 1 / EPSILON;
  };

  // `Math.fround` method implementation
  // https://tc39.github.io/ecma262/#sec-math.fround
  var mathFround = Math.fround || function fround(x) {
    var $abs = abs$3(x);
    var $sign = mathSign(x);
    var a, result;
    if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    // eslint-disable-next-line no-self-compare
    if (result > MAX32 || result != result) return $sign * Infinity;
    return $sign * result;
  };

  // `Math.fround` method
  // https://tc39.github.io/ecma262/#sec-math.fround
  _export({ target: 'Math', stat: true }, { fround: mathFround });

  var $hypot = Math.hypot;
  var abs$4 = Math.abs;
  var sqrt$2 = Math.sqrt;

  // Chrome 77 bug
  // https://bugs.chromium.org/p/v8/issues/detail?id=9546
  var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

  // `Math.hypot` method
  // https://tc39.github.io/ecma262/#sec-math.hypot
  _export({ target: 'Math', stat: true, forced: BUGGY }, {
    hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
      var sum = 0;
      var i = 0;
      var aLen = arguments.length;
      var larg = 0;
      var arg, div;
      while (i < aLen) {
        arg = abs$4(arguments[i++]);
        if (larg < arg) {
          div = larg / arg;
          sum = sum * div * div + 1;
          larg = arg;
        } else if (arg > 0) {
          div = arg / larg;
          sum += div * div;
        } else sum += arg;
      }
      return larg === Infinity ? Infinity : larg * sqrt$2(sum);
    }
  });

  var nativeImul = Math.imul;

  var FORCED$b = fails(function () {
    return nativeImul(0xFFFFFFFF, 5) != -5 || nativeImul.length != 2;
  });

  // `Math.imul` method
  // https://tc39.github.io/ecma262/#sec-math.imul
  // some WebKit versions fails with big numbers, some has wrong arity
  _export({ target: 'Math', stat: true, forced: FORCED$b }, {
    imul: function imul(x, y) {
      var UINT16 = 0xFFFF;
      var xn = +x;
      var yn = +y;
      var xl = UINT16 & xn;
      var yl = UINT16 & yn;
      return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
    }
  });

  var log$6 = Math.log;
  var LOG10E = Math.LOG10E;

  // `Math.log10` method
  // https://tc39.github.io/ecma262/#sec-math.log10
  _export({ target: 'Math', stat: true }, {
    log10: function log10(x) {
      return log$6(x) * LOG10E;
    }
  });

  // `Math.log1p` method
  // https://tc39.github.io/ecma262/#sec-math.log1p
  _export({ target: 'Math', stat: true }, { log1p: mathLog1p });

  var log$7 = Math.log;
  var LN2$1 = Math.LN2;

  // `Math.log2` method
  // https://tc39.github.io/ecma262/#sec-math.log2
  _export({ target: 'Math', stat: true }, {
    log2: function log2(x) {
      return log$7(x) / LN2$1;
    }
  });

  // `Math.sign` method
  // https://tc39.github.io/ecma262/#sec-math.sign
  _export({ target: 'Math', stat: true }, {
    sign: mathSign
  });

  var abs$5 = Math.abs;
  var exp$1 = Math.exp;
  var E$1 = Math.E;

  var FORCED$c = fails(function () {
    return Math.sinh(-2e-17) != -2e-17;
  });

  // `Math.sinh` method
  // https://tc39.github.io/ecma262/#sec-math.sinh
  // V8 near Chromium 38 has a problem with very small numbers
  _export({ target: 'Math', stat: true, forced: FORCED$c }, {
    sinh: function sinh(x) {
      return abs$5(x = +x) < 1 ? (mathExpm1(x) - mathExpm1(-x)) / 2 : (exp$1(x - 1) - exp$1(-x - 1)) * (E$1 / 2);
    }
  });

  var exp$2 = Math.exp;

  // `Math.tanh` method
  // https://tc39.github.io/ecma262/#sec-math.tanh
  _export({ target: 'Math', stat: true }, {
    tanh: function tanh(x) {
      var a = mathExpm1(x = +x);
      var b = mathExpm1(-x);
      return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp$2(x) + exp$2(-x));
    }
  });

  // Math[@@toStringTag] property
  // https://tc39.github.io/ecma262/#sec-math-@@tostringtag
  setToStringTag(Math, 'Math', true);

  var ceil$2 = Math.ceil;
  var floor$5 = Math.floor;

  // `Math.trunc` method
  // https://tc39.github.io/ecma262/#sec-math.trunc
  _export({ target: 'Math', stat: true }, {
    trunc: function trunc(it) {
      return (it > 0 ? floor$5 : ceil$2)(it);
    }
  });

  // `Date.now` method
  // https://tc39.github.io/ecma262/#sec-date.now
  _export({ target: 'Date', stat: true }, {
    now: function now() {
      return new Date().getTime();
    }
  });

  var FORCED$d = fails(function () {
    return new Date(NaN).toJSON() !== null
      || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
  });

  // `Date.prototype.toJSON` method
  // https://tc39.github.io/ecma262/#sec-date.prototype.tojson
  _export({ target: 'Date', proto: true, forced: FORCED$d }, {
    // eslint-disable-next-line no-unused-vars
    toJSON: function toJSON(key) {
      var O = toObject(this);
      var pv = toPrimitive(O);
      return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
    }
  });

  var padStart = stringPad.start;

  var abs$6 = Math.abs;
  var DatePrototype = Date.prototype;
  var getTime = DatePrototype.getTime;
  var nativeDateToISOString = DatePrototype.toISOString;

  // `Date.prototype.toISOString` method implementation
  // https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
  // PhantomJS / old WebKit fails here:
  var dateToIsoString = (fails(function () {
    return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
  }) || !fails(function () {
    nativeDateToISOString.call(new Date(NaN));
  })) ? function toISOString() {
    if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
    var date = this;
    var year = date.getUTCFullYear();
    var milliseconds = date.getUTCMilliseconds();
    var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
    return sign + padStart(abs$6(year), sign ? 6 : 4, 0) +
      '-' + padStart(date.getUTCMonth() + 1, 2, 0) +
      '-' + padStart(date.getUTCDate(), 2, 0) +
      'T' + padStart(date.getUTCHours(), 2, 0) +
      ':' + padStart(date.getUTCMinutes(), 2, 0) +
      ':' + padStart(date.getUTCSeconds(), 2, 0) +
      '.' + padStart(milliseconds, 3, 0) +
      'Z';
  } : nativeDateToISOString;

  // `Date.prototype.toISOString` method
  // https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
  // PhantomJS / old WebKit has a broken implementations
  _export({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== dateToIsoString }, {
    toISOString: dateToIsoString
  });

  var DatePrototype$1 = Date.prototype;
  var INVALID_DATE = 'Invalid Date';
  var TO_STRING$1 = 'toString';
  var nativeDateToString = DatePrototype$1[TO_STRING$1];
  var getTime$1 = DatePrototype$1.getTime;

  // `Date.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-date.prototype.tostring
  if (new Date(NaN) + '' != INVALID_DATE) {
    redefine(DatePrototype$1, TO_STRING$1, function toString() {
      var value = getTime$1.call(this);
      // eslint-disable-next-line no-self-compare
      return value === value ? nativeDateToString.call(this) : INVALID_DATE;
    });
  }

  var dateToPrimitive = function (hint) {
    if (hint !== 'string' && hint !== 'number' && hint !== 'default') {
      throw TypeError('Incorrect hint');
    } return toPrimitive(anObject(this), hint !== 'number');
  };

  var TO_PRIMITIVE$1 = wellKnownSymbol('toPrimitive');
  var DatePrototype$2 = Date.prototype;

  // `Date.prototype[@@toPrimitive]` method
  // https://tc39.github.io/ecma262/#sec-date.prototype-@@toprimitive
  if (!(TO_PRIMITIVE$1 in DatePrototype$2)) hide(DatePrototype$2, TO_PRIMITIVE$1, dateToPrimitive);

  // JSON[@@toStringTag] property
  // https://tc39.github.io/ecma262/#sec-json-@@tostringtag
  setToStringTag(global_1.JSON, 'JSON', true);

  var nativePromiseConstructor = global_1.Promise;

  var redefineAll = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var anInstance = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
    } return it;
  };

  var location = global_1.location;
  var set$1 = global_1.setImmediate;
  var clear = global_1.clearImmediate;
  var process = global_1.process;
  var MessageChannel = global_1.MessageChannel;
  var Dispatch = global_1.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;

  var run = function (id) {
    // eslint-disable-next-line no-prototype-builtins
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };

  var runner = function (id) {
    return function () {
      run(id);
    };
  };

  var listener = function (event) {
    run(event.data);
  };

  var post = function (id) {
    // old engines have not location.origin
    global_1.postMessage(id + '', location.protocol + '//' + location.host);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set$1 || !clear) {
    set$1 = function setImmediate(fn) {
      var args = [];
      var i = 1;
      while (arguments.length > i) args.push(arguments[i++]);
      queue[++counter] = function () {
        // eslint-disable-next-line no-new-func
        (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue[id];
    };
    // Node.js 0.8-
    if (classofRaw(process) == 'process') {
      defer = function (id) {
        process.nextTick(runner(id));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(runner(id));
      };
    // Browsers with MessageChannel, includes WebWorkers
    } else if (MessageChannel) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = bindContext(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (global_1.addEventListener && typeof postMessage == 'function' && !global_1.importScripts && !fails(post)) {
      defer = post;
      global_1.addEventListener('message', listener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
      defer = function (id) {
        html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
          html.removeChild(this);
          run(id);
        };
      };
    // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(runner(id), 0);
      };
    }
  }

  var task = {
    set: set$1,
    clear: clear
  };

  var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor.f;

  var macrotask = task.set;


  var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
  var process$1 = global_1.process;
  var Promise$1 = global_1.Promise;
  var IS_NODE = classofRaw(process$1) == 'process';
  // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
  var queueMicrotaskDescriptor = getOwnPropertyDescriptor$5(global_1, 'queueMicrotask');
  var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

  var flush, head, last, notify, toggle, node, promise, then;

  // modern engines have queueMicrotask method
  if (!queueMicrotask) {
    flush = function () {
      var parent, fn;
      if (IS_NODE && (parent = process$1.domain)) parent.exit();
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (error) {
          if (head) notify();
          else last = undefined;
          throw error;
        }
      } last = undefined;
      if (parent) parent.enter();
    };

    // Node.js
    if (IS_NODE) {
      notify = function () {
        process$1.nextTick(flush);
      };
    // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
    } else if (MutationObserver && !/(iphone|ipod|ipad).*applewebkit/i.test(userAgent)) {
      toggle = true;
      node = document.createTextNode('');
      new MutationObserver(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
      notify = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      promise = Promise$1.resolve(undefined);
      then = promise.then;
      notify = function () {
        then.call(promise, flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
    } else {
      notify = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(global_1, flush);
      };
    }
  }

  var microtask = queueMicrotask || function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };

  var PromiseCapability = function (C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aFunction$1(resolve);
    this.reject = aFunction$1(reject);
  };

  // 25.4.1.5 NewPromiseCapability(C)
  var f$7 = function (C) {
    return new PromiseCapability(C);
  };

  var newPromiseCapability = {
  	f: f$7
  };

  var promiseResolve = function (C, x) {
    anObject(C);
    if (isObject(x) && x.constructor === C) return x;
    var promiseCapability = newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var hostReportErrors = function (a, b) {
    var console = global_1.console;
    if (console && console.error) {
      arguments.length === 1 ? console.error(a) : console.error(a, b);
    }
  };

  var perform = function (exec) {
    try {
      return { error: false, value: exec() };
    } catch (error) {
      return { error: true, value: error };
    }
  };

  var task$1 = task.set;










  var SPECIES$6 = wellKnownSymbol('species');
  var PROMISE = 'Promise';
  var getInternalState$4 = internalState.get;
  var setInternalState$4 = internalState.set;
  var getInternalPromiseState = internalState.getterFor(PROMISE);
  var PromiseConstructor = nativePromiseConstructor;
  var TypeError$1 = global_1.TypeError;
  var document$2 = global_1.document;
  var process$2 = global_1.process;
  var $fetch = global_1.fetch;
  var versions = process$2 && process$2.versions;
  var v8 = versions && versions.v8 || '';
  var newPromiseCapability$1 = newPromiseCapability.f;
  var newGenericPromiseCapability = newPromiseCapability$1;
  var IS_NODE$1 = classofRaw(process$2) == 'process';
  var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
  var UNHANDLED_REJECTION = 'unhandledrejection';
  var REJECTION_HANDLED = 'rejectionhandled';
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var HANDLED = 1;
  var UNHANDLED = 2;
  var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

  var FORCED$e = isForced_1(PROMISE, function () {
    // correct subclassing with @@species support
    var promise = PromiseConstructor.resolve(1);
    var empty = function () { /* empty */ };
    var FakePromise = (promise.constructor = {})[SPECIES$6] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return !((IS_NODE$1 || typeof PromiseRejectionEvent == 'function')
      && (!isPure || promise['finally'])
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1);
  });

  var INCORRECT_ITERATION$1 = FORCED$e || !checkCorrectnessOfIteration(function (iterable) {
    PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
  });

  // helpers
  var isThenable = function (it) {
    var then;
    return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
  };

  var notify$1 = function (promise, state, isReject) {
    if (state.notified) return;
    state.notified = true;
    var chain = state.reactions;
    microtask(function () {
      var value = state.value;
      var ok = state.state == FULFILLED;
      var index = 0;
      // variable length - can't use forEach
      while (chain.length > index) {
        var reaction = chain[index++];
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
              state.rejection = HANDLED;
            }
            if (handler === true) result = value;
            else {
              if (domain) domain.enter();
              result = handler(value); // can throw
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (error) {
          if (domain && !exited) domain.exit();
          reject(error);
        }
      }
      state.reactions = [];
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(promise, state);
    });
  };

  var dispatchEvent = function (name, promise, reason) {
    var event, handler;
    if (DISPATCH_EVENT) {
      event = document$2.createEvent('Event');
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      global_1.dispatchEvent(event);
    } else event = { promise: promise, reason: reason };
    if (handler = global_1['on' + name]) handler(event);
    else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
  };

  var onUnhandled = function (promise, state) {
    task$1.call(global_1, function () {
      var value = state.value;
      var IS_UNHANDLED = isUnhandled(state);
      var result;
      if (IS_UNHANDLED) {
        result = perform(function () {
          if (IS_NODE$1) {
            process$2.emit('unhandledRejection', value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };

  var isUnhandled = function (state) {
    return state.rejection !== HANDLED && !state.parent;
  };

  var onHandleUnhandled = function (promise, state) {
    task$1.call(global_1, function () {
      if (IS_NODE$1) {
        process$2.emit('rejectionHandled', promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };

  var bind = function (fn, promise, state, unwrap) {
    return function (value) {
      fn(promise, state, value, unwrap);
    };
  };

  var internalReject = function (promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify$1(promise, state, true);
  };

  var internalResolve = function (promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    try {
      if (promise === value) throw TypeError$1("Promise can't be resolved itself");
      var then = isThenable(value);
      if (then) {
        microtask(function () {
          var wrapper = { done: false };
          try {
            then.call(value,
              bind(internalResolve, promise, wrapper, state),
              bind(internalReject, promise, wrapper, state)
            );
          } catch (error) {
            internalReject(promise, wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify$1(promise, state, false);
      }
    } catch (error) {
      internalReject(promise, { done: false }, error, state);
    }
  };

  // constructor polyfill
  if (FORCED$e) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance(this, PromiseConstructor, PROMISE);
      aFunction$1(executor);
      Internal.call(this);
      var state = getInternalState$4(this);
      try {
        executor(bind(internalResolve, this, state), bind(internalReject, this, state));
      } catch (error) {
        internalReject(this, state, error);
      }
    };
    // eslint-disable-next-line no-unused-vars
    Internal = function Promise(executor) {
      setInternalState$4(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: [],
        rejection: false,
        state: PENDING,
        value: undefined
      });
    };
    Internal.prototype = redefineAll(PromiseConstructor.prototype, {
      // `Promise.prototype.then` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.then
      then: function then(onFulfilled, onRejected) {
        var state = getInternalPromiseState(this);
        var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = IS_NODE$1 ? process$2.domain : undefined;
        state.parent = true;
        state.reactions.push(reaction);
        if (state.state != PENDING) notify$1(this, state, false);
        return reaction.promise;
      },
      // `Promise.prototype.catch` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function () {
      var promise = new Internal();
      var state = getInternalState$4(promise);
      this.promise = promise;
      this.resolve = bind(internalResolve, promise, state);
      this.reject = bind(internalReject, promise, state);
    };
    newPromiseCapability.f = newPromiseCapability$1 = function (C) {
      return C === PromiseConstructor || C === PromiseWrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };

    if ( typeof nativePromiseConstructor == 'function') {
      nativeThen = nativePromiseConstructor.prototype.then;

      // wrap native Promise#then for native async functions
      redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          nativeThen.call(that, resolve, reject);
        }).then(onFulfilled, onRejected);
      });

      // wrap fetch result
      if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
        // eslint-disable-next-line no-unused-vars
        fetch: function fetch(input) {
          return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
        }
      });
    }
  }

  _export({ global: true, wrap: true, forced: FORCED$e }, {
    Promise: PromiseConstructor
  });

  setToStringTag(PromiseConstructor, PROMISE, false);
  setSpecies(PROMISE);

  PromiseWrapper = path[PROMISE];

  // statics
  _export({ target: PROMISE, stat: true, forced: FORCED$e }, {
    // `Promise.reject` method
    // https://tc39.github.io/ecma262/#sec-promise.reject
    reject: function reject(r) {
      var capability = newPromiseCapability$1(this);
      capability.reject.call(undefined, r);
      return capability.promise;
    }
  });

  _export({ target: PROMISE, stat: true, forced:  FORCED$e }, {
    // `Promise.resolve` method
    // https://tc39.github.io/ecma262/#sec-promise.resolve
    resolve: function resolve(x) {
      return promiseResolve( this, x);
    }
  });

  _export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 }, {
    // `Promise.all` method
    // https://tc39.github.io/ecma262/#sec-promise.all
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction$1(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate_1(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          $promiseResolve.call(C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    },
    // `Promise.race` method
    // https://tc39.github.io/ecma262/#sec-promise.race
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aFunction$1(C.resolve);
        iterate_1(iterable, function (promise) {
          $promiseResolve.call(C, promise).then(capability.resolve, reject);
        });
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  // `Promise.allSettled` method
  // https://github.com/tc39/proposal-promise-allSettled
  _export({ target: 'Promise', stat: true }, {
    allSettled: function allSettled(iterable) {
      var C = this;
      var capability = newPromiseCapability.f(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function () {
        var promiseResolve = aFunction$1(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate_1(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          promiseResolve.call(C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = { status: 'fulfilled', value: value };
            --remaining || resolve(values);
          }, function (e) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = { status: 'rejected', reason: e };
            --remaining || resolve(values);
          });
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  // `Promise.prototype.finally` method
  // https://tc39.github.io/ecma262/#sec-promise.prototype.finally
  _export({ target: 'Promise', proto: true, real: true }, {
    'finally': function (onFinally) {
      var C = speciesConstructor(this, getBuiltIn('Promise'));
      var isFunction = typeof onFinally == 'function';
      return this.then(
        isFunction ? function (x) {
          return promiseResolve(C, onFinally()).then(function () { return x; });
        } : onFinally,
        isFunction ? function (e) {
          return promiseResolve(C, onFinally()).then(function () { throw e; });
        } : onFinally
      );
    }
  });

  // patch native Promise.prototype for native async functions
  if ( typeof nativePromiseConstructor == 'function' && !nativePromiseConstructor.prototype['finally']) {
    redefine(nativePromiseConstructor.prototype, 'finally', getBuiltIn('Promise').prototype['finally']);
  }

  var collection = function (CONSTRUCTOR_NAME, wrapper, common, IS_MAP, IS_WEAK) {
    var NativeConstructor = global_1[CONSTRUCTOR_NAME];
    var NativePrototype = NativeConstructor && NativeConstructor.prototype;
    var Constructor = NativeConstructor;
    var ADDER = IS_MAP ? 'set' : 'add';
    var exported = {};

    var fixMethod = function (KEY) {
      var nativeMethod = NativePrototype[KEY];
      redefine(NativePrototype, KEY,
        KEY == 'add' ? function add(value) {
          nativeMethod.call(this, value === 0 ? 0 : value);
          return this;
        } : KEY == 'delete' ? function (key) {
          return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
        } : KEY == 'get' ? function get(key) {
          return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
        } : KEY == 'has' ? function has(key) {
          return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
        } : function set(key, value) {
          nativeMethod.call(this, key === 0 ? 0 : key, value);
          return this;
        }
      );
    };

    // eslint-disable-next-line max-len
    if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
      new NativeConstructor().entries().next();
    })))) {
      // create collection constructor
      Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
      internalMetadata.REQUIRED = true;
    } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
      var instance = new Constructor();
      // early implementations not supports chaining
      var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
      // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
      var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      // eslint-disable-next-line no-new
      var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
      // for early implementations -0 and +0 not the same
      var BUGGY_ZERO = !IS_WEAK && fails(function () {
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new NativeConstructor();
        var index = 5;
        while (index--) $instance[ADDER](index, index);
        return !$instance.has(-0);
      });

      if (!ACCEPT_ITERABLES) {
        Constructor = wrapper(function (dummy, iterable) {
          anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
          var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
          if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
          return that;
        });
        Constructor.prototype = NativePrototype;
        NativePrototype.constructor = Constructor;
      }

      if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
        fixMethod('delete');
        fixMethod('has');
        IS_MAP && fixMethod('get');
      }

      if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

      // weak collections should not contains .clear method
      if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
    }

    exported[CONSTRUCTOR_NAME] = Constructor;
    _export({ global: true, forced: Constructor != NativeConstructor }, exported);

    setToStringTag(Constructor, CONSTRUCTOR_NAME);

    if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

    return Constructor;
  };

  var defineProperty$6 = objectDefineProperty.f;








  var fastKey = internalMetadata.fastKey;


  var setInternalState$5 = internalState.set;
  var internalStateGetterFor = internalState.getterFor;

  var collectionStrong = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$5(that, {
          type: CONSTRUCTOR_NAME,
          index: objectCreate(null),
          first: undefined,
          last: undefined,
          size: 0
        });
        if (!descriptors) that.size = 0;
        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
      });

      var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

      var define = function (that, key, value) {
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        var previous, index;
        // change existing entry
        if (entry) {
          entry.value = value;
        // create new entry
        } else {
          state.last = entry = {
            index: index = fastKey(key, true),
            key: key,
            value: value,
            previous: previous = state.last,
            next: undefined,
            removed: false
          };
          if (!state.first) state.first = entry;
          if (previous) previous.next = entry;
          if (descriptors) state.size++;
          else that.size++;
          // add to index
          if (index !== 'F') state.index[index] = entry;
        } return that;
      };

      var getEntry = function (that, key) {
        var state = getInternalState(that);
        // fast case
        var index = fastKey(key);
        var entry;
        if (index !== 'F') return state.index[index];
        // frozen object case
        for (entry = state.first; entry; entry = entry.next) {
          if (entry.key == key) return entry;
        }
      };

      redefineAll(C.prototype, {
        // 23.1.3.1 Map.prototype.clear()
        // 23.2.3.2 Set.prototype.clear()
        clear: function clear() {
          var that = this;
          var state = getInternalState(that);
          var data = state.index;
          var entry = state.first;
          while (entry) {
            entry.removed = true;
            if (entry.previous) entry.previous = entry.previous.next = undefined;
            delete data[entry.index];
            entry = entry.next;
          }
          state.first = state.last = undefined;
          if (descriptors) state.size = 0;
          else that.size = 0;
        },
        // 23.1.3.3 Map.prototype.delete(key)
        // 23.2.3.4 Set.prototype.delete(value)
        'delete': function (key) {
          var that = this;
          var state = getInternalState(that);
          var entry = getEntry(that, key);
          if (entry) {
            var next = entry.next;
            var prev = entry.previous;
            delete state.index[entry.index];
            entry.removed = true;
            if (prev) prev.next = next;
            if (next) next.previous = prev;
            if (state.first == entry) state.first = next;
            if (state.last == entry) state.last = prev;
            if (descriptors) state.size--;
            else that.size--;
          } return !!entry;
        },
        // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
        // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
        forEach: function forEach(callbackfn /* , that = undefined */) {
          var state = getInternalState(this);
          var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
          var entry;
          while (entry = entry ? entry.next : state.first) {
            boundFunction(entry.value, entry.key, this);
            // revert to the last existing entry
            while (entry && entry.removed) entry = entry.previous;
          }
        },
        // 23.1.3.7 Map.prototype.has(key)
        // 23.2.3.7 Set.prototype.has(value)
        has: function has(key) {
          return !!getEntry(this, key);
        }
      });

      redefineAll(C.prototype, IS_MAP ? {
        // 23.1.3.6 Map.prototype.get(key)
        get: function get(key) {
          var entry = getEntry(this, key);
          return entry && entry.value;
        },
        // 23.1.3.9 Map.prototype.set(key, value)
        set: function set(key, value) {
          return define(this, key === 0 ? 0 : key, value);
        }
      } : {
        // 23.2.3.1 Set.prototype.add(value)
        add: function add(value) {
          return define(this, value = value === 0 ? 0 : value, value);
        }
      });
      if (descriptors) defineProperty$6(C.prototype, 'size', {
        get: function () {
          return getInternalState(this).size;
        }
      });
      return C;
    },
    setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
      var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
      var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
      var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
      // add .keys, .values, .entries, [@@iterator]
      // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
      defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
        setInternalState$5(this, {
          type: ITERATOR_NAME,
          target: iterated,
          state: getInternalCollectionState(iterated),
          kind: kind,
          last: undefined
        });
      }, function () {
        var state = getInternalIteratorState(this);
        var kind = state.kind;
        var entry = state.last;
        // revert to the last existing entry
        while (entry && entry.removed) entry = entry.previous;
        // get next entry
        if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
          // or finish the iteration
          state.target = undefined;
          return { value: undefined, done: true };
        }
        // return step by kind
        if (kind == 'keys') return { value: entry.key, done: false };
        if (kind == 'values') return { value: entry.value, done: false };
        return { value: [entry.key, entry.value], done: false };
      }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

      // add [@@species], 23.1.2.2, 23.2.2.2
      setSpecies(CONSTRUCTOR_NAME);
    }
  };

  // `Map` constructor
  // https://tc39.github.io/ecma262/#sec-map-objects
  var es_map = collection('Map', function (get) {
    return function Map() { return get(this, arguments.length ? arguments[0] : undefined); };
  }, collectionStrong, true);

  // `Set` constructor
  // https://tc39.github.io/ecma262/#sec-set-objects
  var es_set = collection('Set', function (get) {
    return function Set() { return get(this, arguments.length ? arguments[0] : undefined); };
  }, collectionStrong);

  var getWeakData = internalMetadata.getWeakData;








  var setInternalState$6 = internalState.set;
  var internalStateGetterFor$1 = internalState.getterFor;
  var find = arrayIteration.find;
  var findIndex = arrayIteration.findIndex;
  var id$1 = 0;

  // fallback for uncaught frozen keys
  var uncaughtFrozenStore = function (store) {
    return store.frozen || (store.frozen = new UncaughtFrozenStore());
  };

  var UncaughtFrozenStore = function () {
    this.entries = [];
  };

  var findUncaughtFrozen = function (store, key) {
    return find(store.entries, function (it) {
      return it[0] === key;
    });
  };

  UncaughtFrozenStore.prototype = {
    get: function (key) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) return entry[1];
    },
    has: function (key) {
      return !!findUncaughtFrozen(this, key);
    },
    set: function (key, value) {
      var entry = findUncaughtFrozen(this, key);
      if (entry) entry[1] = value;
      else this.entries.push([key, value]);
    },
    'delete': function (key) {
      var index = findIndex(this.entries, function (it) {
        return it[0] === key;
      });
      if (~index) this.entries.splice(index, 1);
      return !!~index;
    }
  };

  var collectionWeak = {
    getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        anInstance(that, C, CONSTRUCTOR_NAME);
        setInternalState$6(that, {
          type: CONSTRUCTOR_NAME,
          id: id$1++,
          frozen: undefined
        });
        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
      });

      var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

      var define = function (that, key, value) {
        var state = getInternalState(that);
        var data = getWeakData(anObject(key), true);
        if (data === true) uncaughtFrozenStore(state).set(key, value);
        else data[state.id] = value;
        return that;
      };

      redefineAll(C.prototype, {
        // 23.3.3.2 WeakMap.prototype.delete(key)
        // 23.4.3.3 WeakSet.prototype.delete(value)
        'delete': function (key) {
          var state = getInternalState(this);
          if (!isObject(key)) return false;
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state)['delete'](key);
          return data && has(data, state.id) && delete data[state.id];
        },
        // 23.3.3.4 WeakMap.prototype.has(key)
        // 23.4.3.4 WeakSet.prototype.has(value)
        has: function has$1(key) {
          var state = getInternalState(this);
          if (!isObject(key)) return false;
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).has(key);
          return data && has(data, state.id);
        }
      });

      redefineAll(C.prototype, IS_MAP ? {
        // 23.3.3.3 WeakMap.prototype.get(key)
        get: function get(key) {
          var state = getInternalState(this);
          if (isObject(key)) {
            var data = getWeakData(key);
            if (data === true) return uncaughtFrozenStore(state).get(key);
            return data ? data[state.id] : undefined;
          }
        },
        // 23.3.3.5 WeakMap.prototype.set(key, value)
        set: function set(key, value) {
          return define(this, key, value);
        }
      } : {
        // 23.4.3.1 WeakSet.prototype.add(value)
        add: function add(value) {
          return define(this, value, true);
        }
      });

      return C;
    }
  };

  var es_weakMap = createCommonjsModule(function (module) {






  var enforceIternalState = internalState.enforce;


  var IS_IE11 = !global_1.ActiveXObject && 'ActiveXObject' in global_1;
  var isExtensible = Object.isExtensible;
  var InternalWeakMap;

  var wrapper = function (get) {
    return function WeakMap() {
      return get(this, arguments.length ? arguments[0] : undefined);
    };
  };

  // `WeakMap` constructor
  // https://tc39.github.io/ecma262/#sec-weakmap-constructor
  var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak, true, true);

  // IE11 WeakMap frozen keys fix
  // We can't use feature detection because it crash some old IE builds
  // https://github.com/zloirock/core-js/issues/485
  if (nativeWeakMap && IS_IE11) {
    InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
    internalMetadata.REQUIRED = true;
    var WeakMapPrototype = $WeakMap.prototype;
    var nativeDelete = WeakMapPrototype['delete'];
    var nativeHas = WeakMapPrototype.has;
    var nativeGet = WeakMapPrototype.get;
    var nativeSet = WeakMapPrototype.set;
    redefineAll(WeakMapPrototype, {
      'delete': function (key) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeDelete.call(this, key) || state.frozen['delete'](key);
        } return nativeDelete.call(this, key);
      },
      has: function has(key) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeHas.call(this, key) || state.frozen.has(key);
        } return nativeHas.call(this, key);
      },
      get: function get(key) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
        } return nativeGet.call(this, key);
      },
      set: function set(key, value) {
        if (isObject(key) && !isExtensible(key)) {
          var state = enforceIternalState(this);
          if (!state.frozen) state.frozen = new InternalWeakMap();
          nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
        } else nativeSet.call(this, key, value);
        return this;
      }
    });
  }
  });

  // `WeakSet` constructor
  // https://tc39.github.io/ecma262/#sec-weakset-constructor
  collection('WeakSet', function (get) {
    return function WeakSet() { return get(this, arguments.length ? arguments[0] : undefined); };
  }, collectionWeak, false, true);

  var defineProperty$7 = objectDefineProperty.f;





  var DataView = global_1.DataView;
  var DataViewPrototype = DataView && DataView.prototype;
  var Int8Array$1 = global_1.Int8Array;
  var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
  var Uint8ClampedArray = global_1.Uint8ClampedArray;
  var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
  var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
  var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
  var ObjectPrototype$3 = Object.prototype;
  var isPrototypeOf = ObjectPrototype$3.isPrototypeOf;

  var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
  var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
  var NATIVE_ARRAY_BUFFER = !!(global_1.ArrayBuffer && DataView);
  // Fixing native typed arrays in Opera Presto crashes the browser, see #595
  var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
  var TYPED_ARRAY_TAG_REQIRED = false;
  var NAME$1;

  var TypedArrayConstructorsList = {
    Int8Array: 1,
    Uint8Array: 1,
    Uint8ClampedArray: 1,
    Int16Array: 2,
    Uint16Array: 2,
    Int32Array: 4,
    Uint32Array: 4,
    Float32Array: 4,
    Float64Array: 8
  };

  var isView = function isView(it) {
    var klass = classof(it);
    return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
  };

  var isTypedArray = function (it) {
    return isObject(it) && has(TypedArrayConstructorsList, classof(it));
  };

  var aTypedArray = function (it) {
    if (isTypedArray(it)) return it;
    throw TypeError('Target is not a typed array');
  };

  var aTypedArrayConstructor = function (C) {
    if (objectSetPrototypeOf) {
      if (isPrototypeOf.call(TypedArray, C)) return C;
    } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME$1)) {
      var TypedArrayConstructor = global_1[ARRAY];
      if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
        return C;
      }
    } throw TypeError('Target is not a typed array constructor');
  };

  var exportProto = function (KEY, property, forced) {
    if (!descriptors) return;
    if (forced) for (var ARRAY in TypedArrayConstructorsList) {
      var TypedArrayConstructor = global_1[ARRAY];
      if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
        delete TypedArrayConstructor.prototype[KEY];
      }
    }
    if (!TypedArrayPrototype[KEY] || forced) {
      redefine(TypedArrayPrototype, KEY, forced ? property
        : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
    }
  };

  var exportStatic = function (KEY, property, forced) {
    var ARRAY, TypedArrayConstructor;
    if (!descriptors) return;
    if (objectSetPrototypeOf) {
      if (forced) for (ARRAY in TypedArrayConstructorsList) {
        TypedArrayConstructor = global_1[ARRAY];
        if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
          delete TypedArrayConstructor[KEY];
        }
      }
      if (!TypedArray[KEY] || forced) {
        // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
        try {
          return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
        } catch (error) { /* empty */ }
      } else return;
    }
    for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global_1[ARRAY];
      if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
        redefine(TypedArrayConstructor, KEY, property);
      }
    }
  };

  for (NAME$1 in TypedArrayConstructorsList) {
    if (!global_1[NAME$1]) NATIVE_ARRAY_BUFFER_VIEWS = false;
  }

  // WebKit bug - typed arrays constructors prototype is Object.prototype
  if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
    // eslint-disable-next-line no-shadow
    TypedArray = function TypedArray() {
      throw TypeError('Incorrect invocation');
    };
    if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
      if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1], TypedArray);
    }
  }

  if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$3) {
    TypedArrayPrototype = TypedArray.prototype;
    if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
      if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1].prototype, TypedArrayPrototype);
    }
  }

  // WebKit bug - one more object in Uint8ClampedArray prototype chain
  if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
    objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
  }

  if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$3)) {
    TYPED_ARRAY_TAG_REQIRED = true;
    defineProperty$7(TypedArrayPrototype, TO_STRING_TAG$3, { get: function () {
      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
    } });
    for (NAME$1 in TypedArrayConstructorsList) if (global_1[NAME$1]) {
      hide(global_1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
    }
  }

  // WebKit bug - the same parent prototype for typed arrays and data view
  if (NATIVE_ARRAY_BUFFER && objectSetPrototypeOf && objectGetPrototypeOf(DataViewPrototype) !== ObjectPrototype$3) {
    objectSetPrototypeOf(DataViewPrototype, ObjectPrototype$3);
  }

  var arrayBufferViewCore = {
    NATIVE_ARRAY_BUFFER: NATIVE_ARRAY_BUFFER,
    NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
    TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
    aTypedArray: aTypedArray,
    aTypedArrayConstructor: aTypedArrayConstructor,
    exportProto: exportProto,
    exportStatic: exportStatic,
    isView: isView,
    isTypedArray: isTypedArray,
    TypedArray: TypedArray,
    TypedArrayPrototype: TypedArrayPrototype
  };

  // `ToIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-toindex
  var toIndex = function (it) {
    if (it === undefined) return 0;
    var number = toInteger(it);
    var length = toLength(number);
    if (number !== length) throw RangeError('Wrong length or index');
    return length;
  };

  var arrayBuffer = createCommonjsModule(function (module, exports) {


  var NATIVE_ARRAY_BUFFER = arrayBufferViewCore.NATIVE_ARRAY_BUFFER;







  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
  var defineProperty = objectDefineProperty.f;




  var getInternalState = internalState.get;
  var setInternalState = internalState.set;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var DATA_VIEW = 'DataView';
  var PROTOTYPE = 'prototype';
  var WRONG_LENGTH = 'Wrong length';
  var WRONG_INDEX = 'Wrong index';
  var NativeArrayBuffer = global_1[ARRAY_BUFFER];
  var $ArrayBuffer = NativeArrayBuffer;
  var $DataView = global_1[DATA_VIEW];
  var Math = global_1.Math;
  var RangeError = global_1.RangeError;
  // eslint-disable-next-line no-shadow-restricted-names
  var Infinity = 1 / 0;
  var abs = Math.abs;
  var pow = Math.pow;
  var floor = Math.floor;
  var log = Math.log;
  var LN2 = Math.LN2;

  // IEEE754 conversions based on https://github.com/feross/ieee754
  var packIEEE754 = function (number, mantissaLength, bytes) {
    var buffer = new Array(bytes);
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
    var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
    var index = 0;
    var exponent, mantissa, c;
    number = abs(number);
    // eslint-disable-next-line no-self-compare
    if (number != number || number === Infinity) {
      // eslint-disable-next-line no-self-compare
      mantissa = number != number ? 1 : 0;
      exponent = eMax;
    } else {
      exponent = floor(log(number) / LN2);
      if (number * (c = pow(2, -exponent)) < 1) {
        exponent--;
        c *= 2;
      }
      if (exponent + eBias >= 1) {
        number += rt / c;
      } else {
        number += rt * pow(2, 1 - eBias);
      }
      if (number * c >= 2) {
        exponent++;
        c /= 2;
      }
      if (exponent + eBias >= eMax) {
        mantissa = 0;
        exponent = eMax;
      } else if (exponent + eBias >= 1) {
        mantissa = (number * c - 1) * pow(2, mantissaLength);
        exponent = exponent + eBias;
      } else {
        mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
        exponent = 0;
      }
    }
    for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
    exponent = exponent << mantissaLength | mantissa;
    exponentLength += mantissaLength;
    for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
    buffer[--index] |= sign * 128;
    return buffer;
  };

  var unpackIEEE754 = function (buffer, mantissaLength) {
    var bytes = buffer.length;
    var exponentLength = bytes * 8 - mantissaLength - 1;
    var eMax = (1 << exponentLength) - 1;
    var eBias = eMax >> 1;
    var nBits = exponentLength - 7;
    var index = bytes - 1;
    var sign = buffer[index--];
    var exponent = sign & 127;
    var mantissa;
    sign >>= 7;
    for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
    mantissa = exponent & (1 << -nBits) - 1;
    exponent >>= -nBits;
    nBits += mantissaLength;
    for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
    if (exponent === 0) {
      exponent = 1 - eBias;
    } else if (exponent === eMax) {
      return mantissa ? NaN : sign ? -Infinity : Infinity;
    } else {
      mantissa = mantissa + pow(2, mantissaLength);
      exponent = exponent - eBias;
    } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
  };

  var unpackInt32 = function (buffer) {
    return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
  };

  var packInt8 = function (number) {
    return [number & 0xFF];
  };

  var packInt16 = function (number) {
    return [number & 0xFF, number >> 8 & 0xFF];
  };

  var packInt32 = function (number) {
    return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
  };

  var packFloat32 = function (number) {
    return packIEEE754(number, 23, 4);
  };

  var packFloat64 = function (number) {
    return packIEEE754(number, 52, 8);
  };

  var addGetter = function (Constructor, key) {
    defineProperty(Constructor[PROTOTYPE], key, { get: function () { return getInternalState(this)[key]; } });
  };

  var get = function (view, count, index, isLittleEndian) {
    var numIndex = +index;
    var intIndex = toIndex(numIndex);
    var store = getInternalState(view);
    if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
    var bytes = getInternalState(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = bytes.slice(start, start + count);
    return isLittleEndian ? pack : pack.reverse();
  };

  var set = function (view, count, index, conversion, value, isLittleEndian) {
    var numIndex = +index;
    var intIndex = toIndex(numIndex);
    var store = getInternalState(view);
    if (intIndex + count > store.byteLength) throw RangeError(WRONG_INDEX);
    var bytes = getInternalState(store.buffer).bytes;
    var start = intIndex + store.byteOffset;
    var pack = conversion(+value);
    for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
  };

  if (!NATIVE_ARRAY_BUFFER) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
      var byteLength = toIndex(length);
      setInternalState(this, {
        bytes: arrayFill.call(new Array(byteLength), 0),
        byteLength: byteLength
      });
      if (!descriptors) this.byteLength = byteLength;
    };

    $DataView = function DataView(buffer, byteOffset, byteLength) {
      anInstance(this, $DataView, DATA_VIEW);
      anInstance(buffer, $ArrayBuffer, DATA_VIEW);
      var bufferLength = getInternalState(buffer).byteLength;
      var offset = toInteger(byteOffset);
      if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset');
      byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
      if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
      setInternalState(this, {
        buffer: buffer,
        byteLength: byteLength,
        byteOffset: offset
      });
      if (!descriptors) {
        this.buffer = buffer;
        this.byteLength = byteLength;
        this.byteOffset = offset;
      }
    };

    if (descriptors) {
      addGetter($ArrayBuffer, 'byteLength');
      addGetter($DataView, 'buffer');
      addGetter($DataView, 'byteLength');
      addGetter($DataView, 'byteOffset');
    }

    redefineAll($DataView[PROTOTYPE], {
      getInt8: function getInt8(byteOffset) {
        return get(this, 1, byteOffset)[0] << 24 >> 24;
      },
      getUint8: function getUint8(byteOffset) {
        return get(this, 1, byteOffset)[0];
      },
      getInt16: function getInt16(byteOffset /* , littleEndian */) {
        var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
      },
      getUint16: function getUint16(byteOffset /* , littleEndian */) {
        var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
        return bytes[1] << 8 | bytes[0];
      },
      getInt32: function getInt32(byteOffset /* , littleEndian */) {
        return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
      },
      getUint32: function getUint32(byteOffset /* , littleEndian */) {
        return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
      },
      getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
      },
      getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
        return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
      },
      setInt8: function setInt8(byteOffset, value) {
        set(this, 1, byteOffset, packInt8, value);
      },
      setUint8: function setUint8(byteOffset, value) {
        set(this, 1, byteOffset, packInt8, value);
      },
      setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
        set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
        set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
        set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
        set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
        set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
      },
      setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
        set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
      }
    });
  } else {
    if (!fails(function () {
      NativeArrayBuffer(1);
    }) || !fails(function () {
      new NativeArrayBuffer(-1); // eslint-disable-line no-new
    }) || fails(function () {
      new NativeArrayBuffer(); // eslint-disable-line no-new
      new NativeArrayBuffer(1.5); // eslint-disable-line no-new
      new NativeArrayBuffer(NaN); // eslint-disable-line no-new
      return NativeArrayBuffer.name != ARRAY_BUFFER;
    })) {
      $ArrayBuffer = function ArrayBuffer(length) {
        anInstance(this, $ArrayBuffer);
        return new NativeArrayBuffer(toIndex(length));
      };
      var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE] = NativeArrayBuffer[PROTOTYPE];
      for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
        if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, NativeArrayBuffer[key]);
      }
      ArrayBufferPrototype.constructor = $ArrayBuffer;
    }
    // iOS Safari 7.x bug
    var testView = new $DataView(new $ArrayBuffer(2));
    var nativeSetInt8 = $DataView[PROTOTYPE].setInt8;
    testView.setInt8(0, 2147483648);
    testView.setInt8(1, 2147483649);
    if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
      setInt8: function setInt8(byteOffset, value) {
        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
      },
      setUint8: function setUint8(byteOffset, value) {
        nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
      }
    }, { unsafe: true });
  }

  setToStringTag($ArrayBuffer, ARRAY_BUFFER);
  setToStringTag($DataView, DATA_VIEW);
  exports[ARRAY_BUFFER] = $ArrayBuffer;
  exports[DATA_VIEW] = $DataView;
  });

  var ARRAY_BUFFER = 'ArrayBuffer';
  var ArrayBuffer = arrayBuffer[ARRAY_BUFFER];
  var NativeArrayBuffer = global_1[ARRAY_BUFFER];

  // `ArrayBuffer` constructor
  // https://tc39.github.io/ecma262/#sec-arraybuffer-constructor
  _export({ global: true, forced: NativeArrayBuffer !== ArrayBuffer }, {
    ArrayBuffer: ArrayBuffer
  });

  setSpecies(ARRAY_BUFFER);

  var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

  // `ArrayBuffer.isView` method
  // https://tc39.github.io/ecma262/#sec-arraybuffer.isview
  _export({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS$1 }, {
    isView: arrayBufferViewCore.isView
  });

  var ArrayBuffer$1 = arrayBuffer.ArrayBuffer;
  var DataView$1 = arrayBuffer.DataView;
  var nativeArrayBufferSlice = ArrayBuffer$1.prototype.slice;

  var INCORRECT_SLICE = fails(function () {
    return !new ArrayBuffer$1(2).slice(1, undefined).byteLength;
  });

  // `ArrayBuffer.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
  _export({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
    slice: function slice(start, end) {
      if (nativeArrayBufferSlice !== undefined && end === undefined) {
        return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
      }
      var length = anObject(this).byteLength;
      var first = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === undefined ? length : end, length);
      var result = new (speciesConstructor(this, ArrayBuffer$1))(toLength(fin - first));
      var viewSource = new DataView$1(this);
      var viewTarget = new DataView$1(result);
      var index = 0;
      while (first < fin) {
        viewTarget.setUint8(index++, viewSource.getUint8(first++));
      } return result;
    }
  });

  var NATIVE_ARRAY_BUFFER$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER;

  // `DataView` constructor
  // https://tc39.github.io/ecma262/#sec-dataview-constructor
  _export({ global: true, forced: !NATIVE_ARRAY_BUFFER$1 }, {
    DataView: arrayBuffer.DataView
  });

  /* eslint-disable no-new */



  var NATIVE_ARRAY_BUFFER_VIEWS$2 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

  var ArrayBuffer$2 = global_1.ArrayBuffer;
  var Int8Array$2 = global_1.Int8Array;

  var typedArraysConstructorsRequiresWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$2 || !fails(function () {
    Int8Array$2(1);
  }) || !fails(function () {
    new Int8Array$2(-1);
  }) || !checkCorrectnessOfIteration(function (iterable) {
    new Int8Array$2();
    new Int8Array$2(null);
    new Int8Array$2(1.5);
    new Int8Array$2(iterable);
  }, true) || fails(function () {
    // Safari 11 bug
    return new Int8Array$2(new ArrayBuffer$2(2), 1, undefined).length !== 1;
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset');
    return offset;
  };

  var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

  var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var argumentsLength = arguments.length;
    var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iteratorMethod = getIteratorMethod(O);
    var i, length, result, step, iterator;
    if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
      iterator = iteratorMethod.call(O);
      O = [];
      while (!(step = iterator.next()).done) {
        O.push(step.value);
      }
    }
    if (mapping && argumentsLength > 2) {
      mapfn = bindContext(mapfn, arguments[2], 2);
    }
    length = toLength(O.length);
    result = new (aTypedArrayConstructor$1(this))(length);
    for (i = 0; length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var typedArrayConstructor = createCommonjsModule(function (module) {


















  var getOwnPropertyNames = objectGetOwnPropertyNames.f;

  var forEach = arrayIteration.forEach;





  var getInternalState = internalState.get;
  var setInternalState = internalState.set;
  var nativeDefineProperty = objectDefineProperty.f;
  var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var round = Math.round;
  var RangeError = global_1.RangeError;
  var ArrayBuffer = arrayBuffer.ArrayBuffer;
  var DataView = arrayBuffer.DataView;
  var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
  var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
  var TypedArray = arrayBufferViewCore.TypedArray;
  var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
  var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
  var isTypedArray = arrayBufferViewCore.isTypedArray;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var WRONG_LENGTH = 'Wrong length';

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key) {
    nativeDefineProperty(it, key, { get: function () {
      return getInternalState(this)[key];
    } });
  };

  var isArrayBuffer = function (it) {
    var klass;
    return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
  };

  var isTypedArrayIndex = function (target, key) {
    return isTypedArray(target)
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };

  var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
    return isTypedArrayIndex(target, key = toPrimitive(key, true))
      ? createPropertyDescriptor(2, target[key])
      : nativeGetOwnPropertyDescriptor(target, key);
  };

  var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
    if (isTypedArrayIndex(target, key = toPrimitive(key, true))
      && isObject(descriptor)
      && has(descriptor, 'value')
      && !has(descriptor, 'get')
      && !has(descriptor, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !descriptor.configurable
      && (!has(descriptor, 'writable') || descriptor.writable)
      && (!has(descriptor, 'enumerable') || descriptor.enumerable)
    ) {
      target[key] = descriptor.value;
      return target;
    } return nativeDefineProperty(target, key, descriptor);
  };

  if (descriptors) {
    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
      objectDefineProperty.f = wrappedDefineProperty;
      addGetter(TypedArrayPrototype, 'buffer');
      addGetter(TypedArrayPrototype, 'byteOffset');
      addGetter(TypedArrayPrototype, 'byteLength');
      addGetter(TypedArrayPrototype, 'length');
    }

    _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
      getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
      defineProperty: wrappedDefineProperty
    });

    // eslint-disable-next-line max-statements
    module.exports = function (TYPE, BYTES, wrapper, CLAMPED) {
      var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
      var GETTER = 'get' + TYPE;
      var SETTER = 'set' + TYPE;
      var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
      var TypedArrayConstructor = NativeTypedArrayConstructor;
      var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
      var exported = {};

      var getter = function (that, index) {
        var data = getInternalState(that);
        return data.view[GETTER](index * BYTES + data.byteOffset, true);
      };

      var setter = function (that, index, value) {
        var data = getInternalState(that);
        if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
        data.view[SETTER](index * BYTES + data.byteOffset, value, true);
      };

      var addElement = function (that, index) {
        nativeDefineProperty(that, index, {
          get: function () {
            return getter(this, index);
          },
          set: function (value) {
            return setter(this, index, value);
          },
          enumerable: true
        });
      };

      if (!NATIVE_ARRAY_BUFFER_VIEWS) {
        TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
          anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
          var index = 0;
          var byteOffset = 0;
          var buffer, byteLength, length;
          if (!isObject(data)) {
            length = toIndex(data);
            byteLength = length * BYTES;
            buffer = new ArrayBuffer(byteLength);
          } else if (isArrayBuffer(data)) {
            buffer = data;
            byteOffset = toOffset(offset, BYTES);
            var $len = data.byteLength;
            if ($length === undefined) {
              if ($len % BYTES) throw RangeError(WRONG_LENGTH);
              byteLength = $len - byteOffset;
              if (byteLength < 0) throw RangeError(WRONG_LENGTH);
            } else {
              byteLength = toLength($length) * BYTES;
              if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
            }
            length = byteLength / BYTES;
          } else if (isTypedArray(data)) {
            return fromList(TypedArrayConstructor, data);
          } else {
            return typedArrayFrom.call(TypedArrayConstructor, data);
          }
          setInternalState(that, {
            buffer: buffer,
            byteOffset: byteOffset,
            byteLength: byteLength,
            length: length,
            view: new DataView(buffer)
          });
          while (index < length) addElement(that, index++);
        });

        if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
        TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
      } else if (typedArraysConstructorsRequiresWrappers) {
        TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
          anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
            : typedArrayOffset !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
              : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return typedArrayFrom.call(TypedArrayConstructor, data);
        });

        if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
        forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
          if (!(key in TypedArrayConstructor)) hide(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        });
        TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
      }

      if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
        hide(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
      }

      if (TYPED_ARRAY_TAG) hide(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);

      exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

      _export({
        global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
      }, exported);

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
        hide(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
      }

      if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
        hide(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
      }

      setSpecies(CONSTRUCTOR_NAME);
    };
  } else module.exports = function () { /* empty */ };
  });

  // `Int8Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Int8', 1, function (init) {
    return function Int8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Uint8Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint8', 1, function (init) {
    return function Uint8Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Uint8ClampedArray` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint8', 1, function (init) {
    return function Uint8ClampedArray(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  }, true);

  // `Int16Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Int16', 2, function (init) {
    return function Int16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Uint16Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint16', 2, function (init) {
    return function Uint16Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Int32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Int32', 4, function (init) {
    return function Int32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Uint32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Uint32', 4, function (init) {
    return function Uint32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Float32Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Float32', 4, function (init) {
    return function Float32Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `Float64Array` constructor
  // https://tc39.github.io/ecma262/#sec-typedarray-objects
  typedArrayConstructor('Float64', 8, function (init) {
    return function Float64Array(data, byteOffset, length) {
      return init(this, data, byteOffset, length);
    };
  });

  // `%TypedArray%.from` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.from
  arrayBufferViewCore.exportStatic('from', typedArrayFrom, typedArraysConstructorsRequiresWrappers);

  var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;

  // `%TypedArray%.of` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.of
  arrayBufferViewCore.exportStatic('of', function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = new (aTypedArrayConstructor$2(this))(length);
    while (length > index) result[index] = arguments[index++];
    return result;
  }, typedArraysConstructorsRequiresWrappers);

  var aTypedArray$1 = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.copyWithin` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
  arrayBufferViewCore.exportProto('copyWithin', function copyWithin(target, start /* , end */) {
    return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
  });

  var $every$1 = arrayIteration.every;

  var aTypedArray$2 = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
  arrayBufferViewCore.exportProto('every', function every(callbackfn /* , thisArg */) {
    return $every$1(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$3 = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.fill` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
  // eslint-disable-next-line no-unused-vars
  arrayBufferViewCore.exportProto('fill', function fill(value /* , start, end */) {
    return arrayFill.apply(aTypedArray$3(this), arguments);
  });

  var $filter$1 = arrayIteration.filter;


  var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;

  // `%TypedArray%.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
  arrayBufferViewCore.exportProto('filter', function filter(callbackfn /* , thisArg */) {
    var list = $filter$1(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var C = speciesConstructor(this, this.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$3(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  });

  var $find$1 = arrayIteration.find;

  var aTypedArray$5 = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
  arrayBufferViewCore.exportProto('find', function find(predicate /* , thisArg */) {
    return $find$1(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $findIndex$1 = arrayIteration.findIndex;

  var aTypedArray$6 = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
  arrayBufferViewCore.exportProto('findIndex', function findIndex(predicate /* , thisArg */) {
    return $findIndex$1(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $forEach$2 = arrayIteration.forEach;

  var aTypedArray$7 = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
  arrayBufferViewCore.exportProto('forEach', function forEach(callbackfn /* , thisArg */) {
    $forEach$2(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $includes$1 = arrayIncludes.includes;

  var aTypedArray$8 = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
  arrayBufferViewCore.exportProto('includes', function includes(searchElement /* , fromIndex */) {
    return $includes$1(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $indexOf$1 = arrayIncludes.indexOf;

  var aTypedArray$9 = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
  arrayBufferViewCore.exportProto('indexOf', function indexOf(searchElement /* , fromIndex */) {
    return $indexOf$1(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
  });

  var ITERATOR$5 = wellKnownSymbol('iterator');
  var Uint8Array = global_1.Uint8Array;
  var arrayValues = es_array_iterator.values;
  var arrayKeys = es_array_iterator.keys;
  var arrayEntries = es_array_iterator.entries;
  var aTypedArray$a = arrayBufferViewCore.aTypedArray;
  var exportProto$1 = arrayBufferViewCore.exportProto;
  var nativeTypedArrayIterator = Uint8Array && Uint8Array.prototype[ITERATOR$5];

  var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
    && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

  var typedArrayValues = function values() {
    return arrayValues.call(aTypedArray$a(this));
  };

  // `%TypedArray%.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
  exportProto$1('entries', function entries() {
    return arrayEntries.call(aTypedArray$a(this));
  });
  // `%TypedArray%.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
  exportProto$1('keys', function keys() {
    return arrayKeys.call(aTypedArray$a(this));
  });
  // `%TypedArray%.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
  exportProto$1('values', typedArrayValues, !CORRECT_ITER_NAME);
  // `%TypedArray%.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
  exportProto$1(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME);

  var aTypedArray$b = arrayBufferViewCore.aTypedArray;
  var $join = [].join;

  // `%TypedArray%.prototype.join` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
  // eslint-disable-next-line no-unused-vars
  arrayBufferViewCore.exportProto('join', function join(separator) {
    return $join.apply(aTypedArray$b(this), arguments);
  });

  var aTypedArray$c = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.lastIndexOf` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
  // eslint-disable-next-line no-unused-vars
  arrayBufferViewCore.exportProto('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
    return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
  });

  var $map$1 = arrayIteration.map;


  var aTypedArray$d = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;

  // `%TypedArray%.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
  arrayBufferViewCore.exportProto('map', function map(mapfn /* , thisArg */) {
    return $map$1(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
      return new (aTypedArrayConstructor$4(speciesConstructor(O, O.constructor)))(length);
    });
  });

  var $reduce$1 = arrayReduce.left;

  var aTypedArray$e = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
  arrayBufferViewCore.exportProto('reduce', function reduce(callbackfn /* , initialValue */) {
    return $reduce$1(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var $reduceRight$1 = arrayReduce.right;

  var aTypedArray$f = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.reduceRicht` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
  arrayBufferViewCore.exportProto('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
    return $reduceRight$1(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$g = arrayBufferViewCore.aTypedArray;
  var floor$6 = Math.floor;

  // `%TypedArray%.prototype.reverse` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
  arrayBufferViewCore.exportProto('reverse', function reverse() {
    var that = this;
    var length = aTypedArray$g(that).length;
    var middle = floor$6(length / 2);
    var index = 0;
    var value;
    while (index < middle) {
      value = that[index];
      that[index++] = that[--length];
      that[length] = value;
    } return that;
  });

  var aTypedArray$h = arrayBufferViewCore.aTypedArray;

  var FORCED$f = fails(function () {
    // eslint-disable-next-line no-undef
    new Int8Array(1).set({});
  });

  // `%TypedArray%.prototype.set` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
  arrayBufferViewCore.exportProto('set', function set(arrayLike /* , offset */) {
    aTypedArray$h(this);
    var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError('Wrong length');
    while (index < len) this[offset + index] = src[index++];
  }, FORCED$f);

  var aTypedArray$i = arrayBufferViewCore.aTypedArray;
  var aTypedArrayConstructor$5 = arrayBufferViewCore.aTypedArrayConstructor;
  var $slice = [].slice;

  var FORCED$g = fails(function () {
    // eslint-disable-next-line no-undef
    new Int8Array(1).slice();
  });

  // `%TypedArray%.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
  arrayBufferViewCore.exportProto('slice', function slice(start, end) {
    var list = $slice.call(aTypedArray$i(this), start, end);
    var C = speciesConstructor(this, this.constructor);
    var index = 0;
    var length = list.length;
    var result = new (aTypedArrayConstructor$5(C))(length);
    while (length > index) result[index] = list[index++];
    return result;
  }, FORCED$g);

  var $some$1 = arrayIteration.some;

  var aTypedArray$j = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
  arrayBufferViewCore.exportProto('some', function some(callbackfn /* , thisArg */) {
    return $some$1(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  });

  var aTypedArray$k = arrayBufferViewCore.aTypedArray;
  var $sort = [].sort;

  // `%TypedArray%.prototype.sort` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
  arrayBufferViewCore.exportProto('sort', function sort(comparefn) {
    return $sort.call(aTypedArray$k(this), comparefn);
  });

  var aTypedArray$l = arrayBufferViewCore.aTypedArray;

  // `%TypedArray%.prototype.subarray` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
  arrayBufferViewCore.exportProto('subarray', function subarray(begin, end) {
    var O = aTypedArray$l(this);
    var length = O.length;
    var beginIndex = toAbsoluteIndex(begin, length);
    return new (speciesConstructor(O, O.constructor))(
      O.buffer,
      O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
      toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
    );
  });

  var Int8Array$3 = global_1.Int8Array;
  var aTypedArray$m = arrayBufferViewCore.aTypedArray;
  var $toLocaleString = [].toLocaleString;
  var $slice$1 = [].slice;

  // iOS Safari 6.x fails here
  var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails(function () {
    $toLocaleString.call(new Int8Array$3(1));
  });

  var FORCED$h = fails(function () {
    return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
  }) || !fails(function () {
    Int8Array$3.prototype.toLocaleString.call([1, 2]);
  });

  // `%TypedArray%.prototype.toLocaleString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
  arrayBufferViewCore.exportProto('toLocaleString', function toLocaleString() {
    return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
  }, FORCED$h);

  var Uint8Array$1 = global_1.Uint8Array;
  var Uint8ArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype;
  var arrayToString = [].toString;
  var arrayJoin = [].join;

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = function toString() {
      return arrayJoin.call(this);
    };
  }

  // `%TypedArray%.prototype.toString` method
  // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
  arrayBufferViewCore.exportProto('toString', arrayToString, (Uint8ArrayPrototype || {}).toString != arrayToString);

  var nativeApply = getBuiltIn('Reflect', 'apply');
  var functionApply = Function.apply;

  // MS Edge argumentsList argument is optional
  var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
    nativeApply(function () { /* empty */ });
  });

  // `Reflect.apply` method
  // https://tc39.github.io/ecma262/#sec-reflect.apply
  _export({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
    apply: function apply(target, thisArgument, argumentsList) {
      aFunction$1(target);
      anObject(argumentsList);
      return nativeApply
        ? nativeApply(target, thisArgument, argumentsList)
        : functionApply.call(target, thisArgument, argumentsList);
    }
  });

  var nativeConstruct = getBuiltIn('Reflect', 'construct');

  // `Reflect.construct` method
  // https://tc39.github.io/ecma262/#sec-reflect.construct
  // MS Edge supports only 2 arguments and argumentsList argument is optional
  // FF Nightly sets third argument as `new.target`, but does not create `this` from it
  var NEW_TARGET_BUG = fails(function () {
    function F() { /* empty */ }
    return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
  });
  var ARGS_BUG = !fails(function () {
    nativeConstruct(function () { /* empty */ });
  });
  var FORCED$i = NEW_TARGET_BUG || ARGS_BUG;

  _export({ target: 'Reflect', stat: true, forced: FORCED$i, sham: FORCED$i }, {
    construct: function construct(Target, args /* , newTarget */) {
      aFunction$1(Target);
      anObject(args);
      var newTarget = arguments.length < 3 ? Target : aFunction$1(arguments[2]);
      if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
      if (Target == newTarget) {
        // w/o altered newTarget, optimization for 0-4 arguments
        switch (args.length) {
          case 0: return new Target();
          case 1: return new Target(args[0]);
          case 2: return new Target(args[0], args[1]);
          case 3: return new Target(args[0], args[1], args[2]);
          case 4: return new Target(args[0], args[1], args[2], args[3]);
        }
        // w/o altered newTarget, lot of arguments case
        var $args = [null];
        $args.push.apply($args, args);
        return new (functionBind.apply(Target, $args))();
      }
      // with altered newTarget, not support built-in constructors
      var proto = newTarget.prototype;
      var instance = objectCreate(isObject(proto) ? proto : Object.prototype);
      var result = Function.apply.call(Target, instance, args);
      return isObject(result) ? result : instance;
    }
  });

  // MS Edge has broken Reflect.defineProperty - throwing instead of returning false
  var ERROR_INSTEAD_OF_FALSE = fails(function () {
    // eslint-disable-next-line no-undef
    Reflect.defineProperty(objectDefineProperty.f({}, 1, { value: 1 }), 1, { value: 2 });
  });

  // `Reflect.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-reflect.defineproperty
  _export({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !descriptors }, {
    defineProperty: function defineProperty(target, propertyKey, attributes) {
      anObject(target);
      var key = toPrimitive(propertyKey, true);
      anObject(attributes);
      try {
        objectDefineProperty.f(target, key, attributes);
        return true;
      } catch (error) {
        return false;
      }
    }
  });

  var getOwnPropertyDescriptor$6 = objectGetOwnPropertyDescriptor.f;

  // `Reflect.deleteProperty` method
  // https://tc39.github.io/ecma262/#sec-reflect.deleteproperty
  _export({ target: 'Reflect', stat: true }, {
    deleteProperty: function deleteProperty(target, propertyKey) {
      var descriptor = getOwnPropertyDescriptor$6(anObject(target), propertyKey);
      return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
    }
  });

  // `Reflect.get` method
  // https://tc39.github.io/ecma262/#sec-reflect.get
  function get$1(target, propertyKey /* , receiver */) {
    var receiver = arguments.length < 3 ? target : arguments[2];
    var descriptor, prototype;
    if (anObject(target) === receiver) return target[propertyKey];
    if (descriptor = objectGetOwnPropertyDescriptor.f(target, propertyKey)) return has(descriptor, 'value')
      ? descriptor.value
      : descriptor.get === undefined
        ? undefined
        : descriptor.get.call(receiver);
    if (isObject(prototype = objectGetPrototypeOf(target))) return get$1(prototype, propertyKey, receiver);
  }

  _export({ target: 'Reflect', stat: true }, {
    get: get$1
  });

  // `Reflect.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-reflect.getownpropertydescriptor
  _export({ target: 'Reflect', stat: true, sham: !descriptors }, {
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
      return objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
    }
  });

  // `Reflect.getPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-reflect.getprototypeof
  _export({ target: 'Reflect', stat: true, sham: !correctPrototypeGetter }, {
    getPrototypeOf: function getPrototypeOf(target) {
      return objectGetPrototypeOf(anObject(target));
    }
  });

  // `Reflect.has` method
  // https://tc39.github.io/ecma262/#sec-reflect.has
  _export({ target: 'Reflect', stat: true }, {
    has: function has(target, propertyKey) {
      return propertyKey in target;
    }
  });

  var objectIsExtensible = Object.isExtensible;

  // `Reflect.isExtensible` method
  // https://tc39.github.io/ecma262/#sec-reflect.isextensible
  _export({ target: 'Reflect', stat: true }, {
    isExtensible: function isExtensible(target) {
      anObject(target);
      return objectIsExtensible ? objectIsExtensible(target) : true;
    }
  });

  // `Reflect.ownKeys` method
  // https://tc39.github.io/ecma262/#sec-reflect.ownkeys
  _export({ target: 'Reflect', stat: true }, {
    ownKeys: ownKeys$1
  });

  // `Reflect.preventExtensions` method
  // https://tc39.github.io/ecma262/#sec-reflect.preventextensions
  _export({ target: 'Reflect', stat: true, sham: !freezing }, {
    preventExtensions: function preventExtensions(target) {
      anObject(target);
      try {
        var objectPreventExtensions = getBuiltIn('Object', 'preventExtensions');
        if (objectPreventExtensions) objectPreventExtensions(target);
        return true;
      } catch (error) {
        return false;
      }
    }
  });

  // `Reflect.set` method
  // https://tc39.github.io/ecma262/#sec-reflect.set
  function set$2(target, propertyKey, V /* , receiver */) {
    var receiver = arguments.length < 4 ? target : arguments[3];
    var ownDescriptor = objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
    var existingDescriptor, prototype;
    if (!ownDescriptor) {
      if (isObject(prototype = objectGetPrototypeOf(target))) {
        return set$2(prototype, propertyKey, V, receiver);
      }
      ownDescriptor = createPropertyDescriptor(0);
    }
    if (has(ownDescriptor, 'value')) {
      if (ownDescriptor.writable === false || !isObject(receiver)) return false;
      if (existingDescriptor = objectGetOwnPropertyDescriptor.f(receiver, propertyKey)) {
        if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
        existingDescriptor.value = V;
        objectDefineProperty.f(receiver, propertyKey, existingDescriptor);
      } else objectDefineProperty.f(receiver, propertyKey, createPropertyDescriptor(0, V));
      return true;
    }
    return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
  }

  _export({ target: 'Reflect', stat: true }, {
    set: set$2
  });

  // `Reflect.setPrototypeOf` method
  // https://tc39.github.io/ecma262/#sec-reflect.setprototypeof
  if (objectSetPrototypeOf) _export({ target: 'Reflect', stat: true }, {
    setPrototypeOf: function setPrototypeOf(target, proto) {
      anObject(target);
      aPossiblePrototype(proto);
      try {
        objectSetPrototypeOf(target, proto);
        return true;
      } catch (error) {
        return false;
      }
    }
  });

  // iterable DOM collections
  // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
  var domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0
  };

  for (var COLLECTION_NAME in domIterables) {
    var Collection = global_1[COLLECTION_NAME];
    var CollectionPrototype = Collection && Collection.prototype;
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
      hide(CollectionPrototype, 'forEach', arrayForEach);
    } catch (error) {
      CollectionPrototype.forEach = arrayForEach;
    }
  }

  var ITERATOR$6 = wellKnownSymbol('iterator');
  var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
  var ArrayValues = es_array_iterator.values;

  for (var COLLECTION_NAME$1 in domIterables) {
    var Collection$1 = global_1[COLLECTION_NAME$1];
    var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
    if (CollectionPrototype$1) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype$1[ITERATOR$6] !== ArrayValues) try {
        hide(CollectionPrototype$1, ITERATOR$6, ArrayValues);
      } catch (error) {
        CollectionPrototype$1[ITERATOR$6] = ArrayValues;
      }
      if (!CollectionPrototype$1[TO_STRING_TAG$4]) hide(CollectionPrototype$1, TO_STRING_TAG$4, COLLECTION_NAME$1);
      if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
        // some Chrome versions have non-configurable methods on DOMTokenList
        if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
          hide(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
        } catch (error) {
          CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
        }
      }
    }
  }

  var FORCED$j = !global_1.setImmediate || !global_1.clearImmediate;

  // http://w3c.github.io/setImmediate/
  _export({ global: true, bind: true, enumerable: true, forced: FORCED$j }, {
    // `setImmediate` method
    // http://w3c.github.io/setImmediate/#si-setImmediate
    setImmediate: task.set,
    // `clearImmediate` method
    // http://w3c.github.io/setImmediate/#si-clearImmediate
    clearImmediate: task.clear
  });

  var process$3 = global_1.process;
  var isNode = classofRaw(process$3) == 'process';

  // `queueMicrotask` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
  _export({ global: true, enumerable: true, noTargetGet: true }, {
    queueMicrotask: function queueMicrotask(fn) {
      var domain = isNode && process$3.domain;
      microtask(domain ? domain.bind(fn) : fn);
    }
  });

  var slice$1 = [].slice;
  var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

  var wrap$1 = function (scheduler) {
    return function (handler, timeout /* , ...arguments */) {
      var boundArgs = arguments.length > 2;
      var args = boundArgs ? slice$1.call(arguments, 2) : undefined;
      return scheduler(boundArgs ? function () {
        // eslint-disable-next-line no-new-func
        (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
      } : handler, timeout);
    };
  };

  // ie9- setTimeout & setInterval additional parameters fix
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
  _export({ global: true, bind: true, forced: MSIE }, {
    // `setTimeout` method
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
    setTimeout: wrap$1(global_1.setTimeout),
    // `setInterval` method
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
    setInterval: wrap$1(global_1.setInterval)
  });

  var ITERATOR$7 = wellKnownSymbol('iterator');

  var nativeUrl = !fails(function () {
    var url = new URL('b?e=1', 'http://a');
    var searchParams = url.searchParams;
    url.pathname = 'c%20d';
    return (isPure && !url.toJSON)
      || !searchParams.sort
      || url.href !== 'http://a/c%20d?e=1'
      || searchParams.get('e') !== '1'
      || String(new URLSearchParams('?a=1')) !== 'a=1'
      || !searchParams[ITERATOR$7]
      // throws in Edge
      || new URL('https://a@b').username !== 'a'
      || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
      // not punycoded in Edge
      || new URL('http://тест').host !== 'xn--e1aybc'
      // not escaped in Chrome 62-
      || new URL('http://a#б').hash !== '#%D0%B1';
  });

  // based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
  var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128; // 0x80
  var delimiter = '-'; // '\x2D'
  var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
  var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
  var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
  var baseMinusTMin = base - tMin;
  var floor$7 = Math.floor;
  var stringFromCharCode = String.fromCharCode;

  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   */
  var ucs2decode = function (string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    while (counter < length) {
      var value = string.charCodeAt(counter++);
      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // It's a high surrogate, and there is a next character.
        var extra = string.charCodeAt(counter++);
        if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // It's an unmatched surrogate; only append this code unit, in case the
          // next code unit is the high surrogate of a surrogate pair.
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  };

  /**
   * Converts a digit/integer into a basic code point.
   */
  var digitToBasic = function (digit) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26);
  };

  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   */
  var adapt = function (delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor$7(delta / damp) : delta >> 1;
    delta += floor$7(delta / numPoints);
    for (; delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor$7(delta / baseMinusTMin);
    }
    return floor$7(k + (baseMinusTMin + 1) * delta / (delta + skew));
  };

  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   */
  // eslint-disable-next-line  max-statements
  var encode = function (input) {
    var output = [];

    // Convert the input in UCS-2 to an array of Unicode code points.
    input = ucs2decode(input);

    // Cache the length.
    var inputLength = input.length;

    // Initialize the state.
    var n = initialN;
    var delta = 0;
    var bias = initialBias;
    var i, currentValue;

    // Handle the basic code points.
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < 0x80) {
        output.push(stringFromCharCode(currentValue));
      }
    }

    var basicLength = output.length; // number of basic code points.
    var handledCPCount = basicLength; // number of code points that have been handled;

    // Finish the basic string with a delimiter unless it's empty.
    if (basicLength) {
      output.push(delimiter);
    }

    // Main encoding loop:
    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next larger one:
      var m = maxInt;
      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      }

      // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
      var handledCPCountPlusOne = handledCPCount + 1;
      if (m - n > floor$7((maxInt - delta) / handledCPCountPlusOne)) {
        throw RangeError(OVERFLOW_ERROR);
      }

      delta += (m - n) * handledCPCountPlusOne;
      n = m;

      for (i = 0; i < input.length; i++) {
        currentValue = input[i];
        if (currentValue < n && ++delta > maxInt) {
          throw RangeError(OVERFLOW_ERROR);
        }
        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer.
          var q = delta;
          for (var k = base; /* no condition */; k += base) {
            var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
            if (q < t) break;
            var qMinusT = q - t;
            var baseMinusT = base - t;
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
            q = floor$7(qMinusT / baseMinusT);
          }

          output.push(stringFromCharCode(digitToBasic(q)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }

      ++delta;
      ++n;
    }
    return output.join('');
  };

  var punycodeToAscii = function (input) {
    var encoded = [];
    var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
    var i, label;
    for (i = 0; i < labels.length; i++) {
      label = labels[i];
      encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
    }
    return encoded.join('.');
  };

  var getIterator = function (it) {
    var iteratorMethod = getIteratorMethod(it);
    if (typeof iteratorMethod != 'function') {
      throw TypeError(String(it) + ' is not iterable');
    } return anObject(iteratorMethod.call(it));
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

















  var ITERATOR$8 = wellKnownSymbol('iterator');
  var URL_SEARCH_PARAMS = 'URLSearchParams';
  var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
  var setInternalState$7 = internalState.set;
  var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
  var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

  var plus = /\+/g;
  var sequences = Array(4);

  var percentSequence = function (bytes) {
    return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
  };

  var percentDecode = function (sequence) {
    try {
      return decodeURIComponent(sequence);
    } catch (error) {
      return sequence;
    }
  };

  var deserialize = function (it) {
    var result = it.replace(plus, ' ');
    var bytes = 4;
    try {
      return decodeURIComponent(result);
    } catch (error) {
      while (bytes) {
        result = result.replace(percentSequence(bytes--), percentDecode);
      }
      return result;
    }
  };

  var find$1 = /[!'()~]|%20/g;

  var replace = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+'
  };

  var replacer = function (match) {
    return replace[match];
  };

  var serialize = function (it) {
    return encodeURIComponent(it).replace(find$1, replacer);
  };

  var parseSearchParams = function (result, query) {
    if (query) {
      var attributes = query.split('&');
      var index = 0;
      var attribute, entry;
      while (index < attributes.length) {
        attribute = attributes[index++];
        if (attribute.length) {
          entry = attribute.split('=');
          result.push({
            key: deserialize(entry.shift()),
            value: deserialize(entry.join('='))
          });
        }
      }
    }
  };

  var updateSearchParams = function (query) {
    this.entries.length = 0;
    parseSearchParams(this.entries, query);
  };

  var validateArgumentsLength = function (passed, required) {
    if (passed < required) throw TypeError('Not enough arguments');
  };

  var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
    setInternalState$7(this, {
      type: URL_SEARCH_PARAMS_ITERATOR,
      iterator: getIterator(getInternalParamsState(params).entries),
      kind: kind
    });
  }, 'Iterator', function next() {
    var state = getInternalIteratorState(this);
    var kind = state.kind;
    var step = state.iterator.next();
    var entry = step.value;
    if (!step.done) {
      step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
    } return step;
  });

  // `URLSearchParams` constructor
  // https://url.spec.whatwg.org/#interface-urlsearchparams
  var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
    anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
    var init = arguments.length > 0 ? arguments[0] : undefined;
    var that = this;
    var entries = [];
    var iteratorMethod, iterator, step, entryIterator, first, second, key;

    setInternalState$7(that, {
      type: URL_SEARCH_PARAMS,
      entries: entries,
      updateURL: function () { /* empty */ },
      updateSearchParams: updateSearchParams
    });

    if (init !== undefined) {
      if (isObject(init)) {
        iteratorMethod = getIteratorMethod(init);
        if (typeof iteratorMethod === 'function') {
          iterator = iteratorMethod.call(init);
          while (!(step = iterator.next()).done) {
            entryIterator = getIterator(anObject(step.value));
            if (
              (first = entryIterator.next()).done ||
              (second = entryIterator.next()).done ||
              !entryIterator.next().done
            ) throw TypeError('Expected sequence with length 2');
            entries.push({ key: first.value + '', value: second.value + '' });
          }
        } else for (key in init) if (has(init, key)) entries.push({ key: key, value: init[key] + '' });
      } else {
        parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
      }
    }
  };

  var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

  redefineAll(URLSearchParamsPrototype, {
    // `URLSearchParams.prototype.appent` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-append
    append: function append(name, value) {
      validateArgumentsLength(arguments.length, 2);
      var state = getInternalParamsState(this);
      state.entries.push({ key: name + '', value: value + '' });
      state.updateURL();
    },
    // `URLSearchParams.prototype.delete` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
    'delete': function (name) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var key = name + '';
      var index = 0;
      while (index < entries.length) {
        if (entries[index].key === key) entries.splice(index, 1);
        else index++;
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.get` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-get
    get: function get(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) return entries[index].value;
      }
      return null;
    },
    // `URLSearchParams.prototype.getAll` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
    getAll: function getAll(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var result = [];
      var index = 0;
      for (; index < entries.length; index++) {
        if (entries[index].key === key) result.push(entries[index].value);
      }
      return result;
    },
    // `URLSearchParams.prototype.has` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-has
    has: function has(name) {
      validateArgumentsLength(arguments.length, 1);
      var entries = getInternalParamsState(this).entries;
      var key = name + '';
      var index = 0;
      while (index < entries.length) {
        if (entries[index++].key === key) return true;
      }
      return false;
    },
    // `URLSearchParams.prototype.set` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-set
    set: function set(name, value) {
      validateArgumentsLength(arguments.length, 1);
      var state = getInternalParamsState(this);
      var entries = state.entries;
      var found = false;
      var key = name + '';
      var val = value + '';
      var index = 0;
      var entry;
      for (; index < entries.length; index++) {
        entry = entries[index];
        if (entry.key === key) {
          if (found) entries.splice(index--, 1);
          else {
            found = true;
            entry.value = val;
          }
        }
      }
      if (!found) entries.push({ key: key, value: val });
      state.updateURL();
    },
    // `URLSearchParams.prototype.sort` method
    // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
    sort: function sort() {
      var state = getInternalParamsState(this);
      var entries = state.entries;
      // Array#sort is not stable in some engines
      var slice = entries.slice();
      var entry, entriesIndex, sliceIndex;
      entries.length = 0;
      for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
        entry = slice[sliceIndex];
        for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
          if (entries[entriesIndex].key > entry.key) {
            entries.splice(entriesIndex, 0, entry);
            break;
          }
        }
        if (entriesIndex === sliceIndex) entries.push(entry);
      }
      state.updateURL();
    },
    // `URLSearchParams.prototype.forEach` method
    forEach: function forEach(callback /* , thisArg */) {
      var entries = getInternalParamsState(this).entries;
      var boundFunction = bindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
      var index = 0;
      var entry;
      while (index < entries.length) {
        entry = entries[index++];
        boundFunction(entry.value, entry.key, this);
      }
    },
    // `URLSearchParams.prototype.keys` method
    keys: function keys() {
      return new URLSearchParamsIterator(this, 'keys');
    },
    // `URLSearchParams.prototype.values` method
    values: function values() {
      return new URLSearchParamsIterator(this, 'values');
    },
    // `URLSearchParams.prototype.entries` method
    entries: function entries() {
      return new URLSearchParamsIterator(this, 'entries');
    }
  }, { enumerable: true });

  // `URLSearchParams.prototype[@@iterator]` method
  redefine(URLSearchParamsPrototype, ITERATOR$8, URLSearchParamsPrototype.entries);

  // `URLSearchParams.prototype.toString` method
  // https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
  redefine(URLSearchParamsPrototype, 'toString', function toString() {
    var entries = getInternalParamsState(this).entries;
    var result = [];
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      result.push(serialize(entry.key) + '=' + serialize(entry.value));
    } return result.join('&');
  }, { enumerable: true });

  setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

  _export({ global: true, forced: !nativeUrl }, {
    URLSearchParams: URLSearchParamsConstructor
  });

  var web_urlSearchParams = {
    URLSearchParams: URLSearchParamsConstructor,
    getState: getInternalParamsState
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











  var codeAt$1 = stringMultibyte.codeAt;





  var NativeURL = global_1.URL;
  var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
  var getInternalSearchParamsState = web_urlSearchParams.getState;
  var setInternalState$8 = internalState.set;
  var getInternalURLState = internalState.getterFor('URL');
  var floor$8 = Math.floor;
  var pow$3 = Math.pow;

  var INVALID_AUTHORITY = 'Invalid authority';
  var INVALID_SCHEME = 'Invalid scheme';
  var INVALID_HOST = 'Invalid host';
  var INVALID_PORT = 'Invalid port';

  var ALPHA = /[A-Za-z]/;
  var ALPHANUMERIC = /[\d+\-.A-Za-z]/;
  var DIGIT = /\d/;
  var HEX_START = /^(0x|0X)/;
  var OCT = /^[0-7]+$/;
  var DEC = /^\d+$/;
  var HEX = /^[\dA-Fa-f]+$/;
  // eslint-disable-next-line no-control-regex
  var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
  // eslint-disable-next-line no-control-regex
  var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
  // eslint-disable-next-line no-control-regex
  var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
  // eslint-disable-next-line no-control-regex
  var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
  var EOF;

  var parseHost = function (url, input) {
    var result, codePoints, index;
    if (input.charAt(0) == '[') {
      if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
      result = parseIPv6(input.slice(1, -1));
      if (!result) return INVALID_HOST;
      url.host = result;
    // opaque host
    } else if (!isSpecial(url)) {
      if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
      result = '';
      codePoints = arrayFrom(input);
      for (index = 0; index < codePoints.length; index++) {
        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
      }
      url.host = result;
    } else {
      input = punycodeToAscii(input);
      if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
      result = parseIPv4(input);
      if (result === null) return INVALID_HOST;
      url.host = result;
    }
  };

  var parseIPv4 = function (input) {
    var parts = input.split('.');
    var partsLength, numbers, index, part, radix, number, ipv4;
    if (parts.length && parts[parts.length - 1] == '') {
      parts.pop();
    }
    partsLength = parts.length;
    if (partsLength > 4) return input;
    numbers = [];
    for (index = 0; index < partsLength; index++) {
      part = parts[index];
      if (part == '') return input;
      radix = 10;
      if (part.length > 1 && part.charAt(0) == '0') {
        radix = HEX_START.test(part) ? 16 : 8;
        part = part.slice(radix == 8 ? 1 : 2);
      }
      if (part === '') {
        number = 0;
      } else {
        if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
        number = parseInt(part, radix);
      }
      numbers.push(number);
    }
    for (index = 0; index < partsLength; index++) {
      number = numbers[index];
      if (index == partsLength - 1) {
        if (number >= pow$3(256, 5 - partsLength)) return null;
      } else if (number > 255) return null;
    }
    ipv4 = numbers.pop();
    for (index = 0; index < numbers.length; index++) {
      ipv4 += numbers[index] * pow$3(256, 3 - index);
    }
    return ipv4;
  };

  // eslint-disable-next-line max-statements
  var parseIPv6 = function (input) {
    var address = [0, 0, 0, 0, 0, 0, 0, 0];
    var pieceIndex = 0;
    var compress = null;
    var pointer = 0;
    var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

    var char = function () {
      return input.charAt(pointer);
    };

    if (char() == ':') {
      if (input.charAt(1) != ':') return;
      pointer += 2;
      pieceIndex++;
      compress = pieceIndex;
    }
    while (char()) {
      if (pieceIndex == 8) return;
      if (char() == ':') {
        if (compress !== null) return;
        pointer++;
        pieceIndex++;
        compress = pieceIndex;
        continue;
      }
      value = length = 0;
      while (length < 4 && HEX.test(char())) {
        value = value * 16 + parseInt(char(), 16);
        pointer++;
        length++;
      }
      if (char() == '.') {
        if (length == 0) return;
        pointer -= length;
        if (pieceIndex > 6) return;
        numbersSeen = 0;
        while (char()) {
          ipv4Piece = null;
          if (numbersSeen > 0) {
            if (char() == '.' && numbersSeen < 4) pointer++;
            else return;
          }
          if (!DIGIT.test(char())) return;
          while (DIGIT.test(char())) {
            number = parseInt(char(), 10);
            if (ipv4Piece === null) ipv4Piece = number;
            else if (ipv4Piece == 0) return;
            else ipv4Piece = ipv4Piece * 10 + number;
            if (ipv4Piece > 255) return;
            pointer++;
          }
          address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
          numbersSeen++;
          if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
        }
        if (numbersSeen != 4) return;
        break;
      } else if (char() == ':') {
        pointer++;
        if (!char()) return;
      } else if (char()) return;
      address[pieceIndex++] = value;
    }
    if (compress !== null) {
      swaps = pieceIndex - compress;
      pieceIndex = 7;
      while (pieceIndex != 0 && swaps > 0) {
        swap = address[pieceIndex];
        address[pieceIndex--] = address[compress + swaps - 1];
        address[compress + --swaps] = swap;
      }
    } else if (pieceIndex != 8) return;
    return address;
  };

  var findLongestZeroSequence = function (ipv6) {
    var maxIndex = null;
    var maxLength = 1;
    var currStart = null;
    var currLength = 0;
    var index = 0;
    for (; index < 8; index++) {
      if (ipv6[index] !== 0) {
        if (currLength > maxLength) {
          maxIndex = currStart;
          maxLength = currLength;
        }
        currStart = null;
        currLength = 0;
      } else {
        if (currStart === null) currStart = index;
        ++currLength;
      }
    }
    if (currLength > maxLength) {
      maxIndex = currStart;
      maxLength = currLength;
    }
    return maxIndex;
  };

  var serializeHost = function (host) {
    var result, index, compress, ignore0;
    // ipv4
    if (typeof host == 'number') {
      result = [];
      for (index = 0; index < 4; index++) {
        result.unshift(host % 256);
        host = floor$8(host / 256);
      } return result.join('.');
    // ipv6
    } else if (typeof host == 'object') {
      result = '';
      compress = findLongestZeroSequence(host);
      for (index = 0; index < 8; index++) {
        if (ignore0 && host[index] === 0) continue;
        if (ignore0) ignore0 = false;
        if (compress === index) {
          result += index ? ':' : '::';
          ignore0 = true;
        } else {
          result += host[index].toString(16);
          if (index < 7) result += ':';
        }
      }
      return '[' + result + ']';
    } return host;
  };

  var C0ControlPercentEncodeSet = {};
  var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
    ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
  });
  var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
    '#': 1, '?': 1, '{': 1, '}': 1
  });
  var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
    '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
  });

  var percentEncode = function (char, set) {
    var code = codeAt$1(char, 0);
    return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
  };

  var specialSchemes = {
    ftp: 21,
    file: null,
    gopher: 70,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
  };

  var isSpecial = function (url) {
    return has(specialSchemes, url.scheme);
  };

  var includesCredentials = function (url) {
    return url.username != '' || url.password != '';
  };

  var cannotHaveUsernamePasswordPort = function (url) {
    return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
  };

  var isWindowsDriveLetter = function (string, normalized) {
    var second;
    return string.length == 2 && ALPHA.test(string.charAt(0))
      && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
  };

  var startsWithWindowsDriveLetter = function (string) {
    var third;
    return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
      string.length == 2 ||
      ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
    );
  };

  var shortenURLsPath = function (url) {
    var path = url.path;
    var pathSize = path.length;
    if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
      path.pop();
    }
  };

  var isSingleDot = function (segment) {
    return segment === '.' || segment.toLowerCase() === '%2e';
  };

  var isDoubleDot = function (segment) {
    segment = segment.toLowerCase();
    return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
  };

  // States:
  var SCHEME_START = {};
  var SCHEME = {};
  var NO_SCHEME = {};
  var SPECIAL_RELATIVE_OR_AUTHORITY = {};
  var PATH_OR_AUTHORITY = {};
  var RELATIVE = {};
  var RELATIVE_SLASH = {};
  var SPECIAL_AUTHORITY_SLASHES = {};
  var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
  var AUTHORITY = {};
  var HOST = {};
  var HOSTNAME = {};
  var PORT = {};
  var FILE = {};
  var FILE_SLASH = {};
  var FILE_HOST = {};
  var PATH_START = {};
  var PATH = {};
  var CANNOT_BE_A_BASE_URL_PATH = {};
  var QUERY = {};
  var FRAGMENT = {};

  // eslint-disable-next-line max-statements
  var parseURL = function (url, input, stateOverride, base) {
    var state = stateOverride || SCHEME_START;
    var pointer = 0;
    var buffer = '';
    var seenAt = false;
    var seenBracket = false;
    var seenPasswordToken = false;
    var codePoints, char, bufferCodePoints, failure;

    if (!stateOverride) {
      url.scheme = '';
      url.username = '';
      url.password = '';
      url.host = null;
      url.port = null;
      url.path = [];
      url.query = null;
      url.fragment = null;
      url.cannotBeABaseURL = false;
      input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
    }

    input = input.replace(TAB_AND_NEW_LINE, '');

    codePoints = arrayFrom(input);

    while (pointer <= codePoints.length) {
      char = codePoints[pointer];
      switch (state) {
        case SCHEME_START:
          if (char && ALPHA.test(char)) {
            buffer += char.toLowerCase();
            state = SCHEME;
          } else if (!stateOverride) {
            state = NO_SCHEME;
            continue;
          } else return INVALID_SCHEME;
          break;

        case SCHEME:
          if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
            buffer += char.toLowerCase();
          } else if (char == ':') {
            if (stateOverride && (
              (isSpecial(url) != has(specialSchemes, buffer)) ||
              (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
              (url.scheme == 'file' && !url.host)
            )) return;
            url.scheme = buffer;
            if (stateOverride) {
              if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
              return;
            }
            buffer = '';
            if (url.scheme == 'file') {
              state = FILE;
            } else if (isSpecial(url) && base && base.scheme == url.scheme) {
              state = SPECIAL_RELATIVE_OR_AUTHORITY;
            } else if (isSpecial(url)) {
              state = SPECIAL_AUTHORITY_SLASHES;
            } else if (codePoints[pointer + 1] == '/') {
              state = PATH_OR_AUTHORITY;
              pointer++;
            } else {
              url.cannotBeABaseURL = true;
              url.path.push('');
              state = CANNOT_BE_A_BASE_URL_PATH;
            }
          } else if (!stateOverride) {
            buffer = '';
            state = NO_SCHEME;
            pointer = 0;
            continue;
          } else return INVALID_SCHEME;
          break;

        case NO_SCHEME:
          if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
          if (base.cannotBeABaseURL && char == '#') {
            url.scheme = base.scheme;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            url.cannotBeABaseURL = true;
            state = FRAGMENT;
            break;
          }
          state = base.scheme == 'file' ? FILE : RELATIVE;
          continue;

        case SPECIAL_RELATIVE_OR_AUTHORITY:
          if (char == '/' && codePoints[pointer + 1] == '/') {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            pointer++;
          } else {
            state = RELATIVE;
            continue;
          } break;

        case PATH_OR_AUTHORITY:
          if (char == '/') {
            state = AUTHORITY;
            break;
          } else {
            state = PATH;
            continue;
          }

        case RELATIVE:
          url.scheme = base.scheme;
          if (char == EOF) {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '/' || (char == '\\' && isSpecial(url))) {
            state = RELATIVE_SLASH;
          } else if (char == '?') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = base.path.slice();
            url.path.pop();
            state = PATH;
            continue;
          } break;

        case RELATIVE_SLASH:
          if (isSpecial(url) && (char == '/' || char == '\\')) {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          } else if (char == '/') {
            state = AUTHORITY;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            state = PATH;
            continue;
          } break;

        case SPECIAL_AUTHORITY_SLASHES:
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
          pointer++;
          break;

        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
          if (char != '/' && char != '\\') {
            state = AUTHORITY;
            continue;
          } break;

        case AUTHORITY:
          if (char == '@') {
            if (seenAt) buffer = '%40' + buffer;
            seenAt = true;
            bufferCodePoints = arrayFrom(buffer);
            for (var i = 0; i < bufferCodePoints.length; i++) {
              var codePoint = bufferCodePoints[i];
              if (codePoint == ':' && !seenPasswordToken) {
                seenPasswordToken = true;
                continue;
              }
              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
              if (seenPasswordToken) url.password += encodedCodePoints;
              else url.username += encodedCodePoints;
            }
            buffer = '';
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url))
          ) {
            if (seenAt && buffer == '') return INVALID_AUTHORITY;
            pointer -= arrayFrom(buffer).length + 1;
            buffer = '';
            state = HOST;
          } else buffer += char;
          break;

        case HOST:
        case HOSTNAME:
          if (stateOverride && url.scheme == 'file') {
            state = FILE_HOST;
            continue;
          } else if (char == ':' && !seenBracket) {
            if (buffer == '') return INVALID_HOST;
            failure = parseHost(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PORT;
            if (stateOverride == HOSTNAME) return;
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url))
          ) {
            if (isSpecial(url) && buffer == '') return INVALID_HOST;
            if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
            failure = parseHost(url, buffer);
            if (failure) return failure;
            buffer = '';
            state = PATH_START;
            if (stateOverride) return;
            continue;
          } else {
            if (char == '[') seenBracket = true;
            else if (char == ']') seenBracket = false;
            buffer += char;
          } break;

        case PORT:
          if (DIGIT.test(char)) {
            buffer += char;
          } else if (
            char == EOF || char == '/' || char == '?' || char == '#' ||
            (char == '\\' && isSpecial(url)) ||
            stateOverride
          ) {
            if (buffer != '') {
              var port = parseInt(buffer, 10);
              if (port > 0xFFFF) return INVALID_PORT;
              url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
              buffer = '';
            }
            if (stateOverride) return;
            state = PATH_START;
            continue;
          } else return INVALID_PORT;
          break;

        case FILE:
          url.scheme = 'file';
          if (char == '/' || char == '\\') state = FILE_SLASH;
          else if (base && base.scheme == 'file') {
            if (char == EOF) {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
            } else if (char == '?') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = '';
              state = QUERY;
            } else if (char == '#') {
              url.host = base.host;
              url.path = base.path.slice();
              url.query = base.query;
              url.fragment = '';
              state = FRAGMENT;
            } else {
              if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
                url.host = base.host;
                url.path = base.path.slice();
                shortenURLsPath(url);
              }
              state = PATH;
              continue;
            }
          } else {
            state = PATH;
            continue;
          } break;

        case FILE_SLASH:
          if (char == '/' || char == '\\') {
            state = FILE_HOST;
            break;
          }
          if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
            if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
            else url.host = base.host;
          }
          state = PATH;
          continue;

        case FILE_HOST:
          if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
            if (!stateOverride && isWindowsDriveLetter(buffer)) {
              state = PATH;
            } else if (buffer == '') {
              url.host = '';
              if (stateOverride) return;
              state = PATH_START;
            } else {
              failure = parseHost(url, buffer);
              if (failure) return failure;
              if (url.host == 'localhost') url.host = '';
              if (stateOverride) return;
              buffer = '';
              state = PATH_START;
            } continue;
          } else buffer += char;
          break;

        case PATH_START:
          if (isSpecial(url)) {
            state = PATH;
            if (char != '/' && char != '\\') continue;
          } else if (!stateOverride && char == '?') {
            url.query = '';
            state = QUERY;
          } else if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            state = PATH;
            if (char != '/') continue;
          } break;

        case PATH:
          if (
            char == EOF || char == '/' ||
            (char == '\\' && isSpecial(url)) ||
            (!stateOverride && (char == '?' || char == '#'))
          ) {
            if (isDoubleDot(buffer)) {
              shortenURLsPath(url);
              if (char != '/' && !(char == '\\' && isSpecial(url))) {
                url.path.push('');
              }
            } else if (isSingleDot(buffer)) {
              if (char != '/' && !(char == '\\' && isSpecial(url))) {
                url.path.push('');
              }
            } else {
              if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                if (url.host) url.host = '';
                buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
              }
              url.path.push(buffer);
            }
            buffer = '';
            if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
              while (url.path.length > 1 && url.path[0] === '') {
                url.path.shift();
              }
            }
            if (char == '?') {
              url.query = '';
              state = QUERY;
            } else if (char == '#') {
              url.fragment = '';
              state = FRAGMENT;
            }
          } else {
            buffer += percentEncode(char, pathPercentEncodeSet);
          } break;

        case CANNOT_BE_A_BASE_URL_PATH:
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
          } break;

        case QUERY:
          if (!stateOverride && char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (char != EOF) {
            if (char == "'" && isSpecial(url)) url.query += '%27';
            else if (char == '#') url.query += '%23';
            else url.query += percentEncode(char, C0ControlPercentEncodeSet);
          } break;

        case FRAGMENT:
          if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
          break;
      }

      pointer++;
    }
  };

  // `URL` constructor
  // https://url.spec.whatwg.org/#url-class
  var URLConstructor = function URL(url /* , base */) {
    var that = anInstance(this, URLConstructor, 'URL');
    var base = arguments.length > 1 ? arguments[1] : undefined;
    var urlString = String(url);
    var state = setInternalState$8(that, { type: 'URL' });
    var baseState, failure;
    if (base !== undefined) {
      if (base instanceof URLConstructor) baseState = getInternalURLState(base);
      else {
        failure = parseURL(baseState = {}, String(base));
        if (failure) throw TypeError(failure);
      }
    }
    failure = parseURL(state, urlString, null, baseState);
    if (failure) throw TypeError(failure);
    var searchParams = state.searchParams = new URLSearchParams$1();
    var searchParamsState = getInternalSearchParamsState(searchParams);
    searchParamsState.updateSearchParams(state.query);
    searchParamsState.updateURL = function () {
      state.query = String(searchParams) || null;
    };
    if (!descriptors) {
      that.href = serializeURL.call(that);
      that.origin = getOrigin.call(that);
      that.protocol = getProtocol.call(that);
      that.username = getUsername.call(that);
      that.password = getPassword.call(that);
      that.host = getHost.call(that);
      that.hostname = getHostname.call(that);
      that.port = getPort.call(that);
      that.pathname = getPathname.call(that);
      that.search = getSearch.call(that);
      that.searchParams = getSearchParams.call(that);
      that.hash = getHash.call(that);
    }
  };

  var URLPrototype = URLConstructor.prototype;

  var serializeURL = function () {
    var url = getInternalURLState(this);
    var scheme = url.scheme;
    var username = url.username;
    var password = url.password;
    var host = url.host;
    var port = url.port;
    var path = url.path;
    var query = url.query;
    var fragment = url.fragment;
    var output = scheme + ':';
    if (host !== null) {
      output += '//';
      if (includesCredentials(url)) {
        output += username + (password ? ':' + password : '') + '@';
      }
      output += serializeHost(host);
      if (port !== null) output += ':' + port;
    } else if (scheme == 'file') output += '//';
    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
    if (query !== null) output += '?' + query;
    if (fragment !== null) output += '#' + fragment;
    return output;
  };

  var getOrigin = function () {
    var url = getInternalURLState(this);
    var scheme = url.scheme;
    var port = url.port;
    if (scheme == 'blob') try {
      return new URL(scheme.path[0]).origin;
    } catch (error) {
      return 'null';
    }
    if (scheme == 'file' || !isSpecial(url)) return 'null';
    return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
  };

  var getProtocol = function () {
    return getInternalURLState(this).scheme + ':';
  };

  var getUsername = function () {
    return getInternalURLState(this).username;
  };

  var getPassword = function () {
    return getInternalURLState(this).password;
  };

  var getHost = function () {
    var url = getInternalURLState(this);
    var host = url.host;
    var port = url.port;
    return host === null ? ''
      : port === null ? serializeHost(host)
      : serializeHost(host) + ':' + port;
  };

  var getHostname = function () {
    var host = getInternalURLState(this).host;
    return host === null ? '' : serializeHost(host);
  };

  var getPort = function () {
    var port = getInternalURLState(this).port;
    return port === null ? '' : String(port);
  };

  var getPathname = function () {
    var url = getInternalURLState(this);
    var path = url.path;
    return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  };

  var getSearch = function () {
    var query = getInternalURLState(this).query;
    return query ? '?' + query : '';
  };

  var getSearchParams = function () {
    return getInternalURLState(this).searchParams;
  };

  var getHash = function () {
    var fragment = getInternalURLState(this).fragment;
    return fragment ? '#' + fragment : '';
  };

  var accessorDescriptor = function (getter, setter) {
    return { get: getter, set: setter, configurable: true, enumerable: true };
  };

  if (descriptors) {
    objectDefineProperties(URLPrototype, {
      // `URL.prototype.href` accessors pair
      // https://url.spec.whatwg.org/#dom-url-href
      href: accessorDescriptor(serializeURL, function (href) {
        var url = getInternalURLState(this);
        var urlString = String(href);
        var failure = parseURL(url, urlString);
        if (failure) throw TypeError(failure);
        getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.origin` getter
      // https://url.spec.whatwg.org/#dom-url-origin
      origin: accessorDescriptor(getOrigin),
      // `URL.prototype.protocol` accessors pair
      // https://url.spec.whatwg.org/#dom-url-protocol
      protocol: accessorDescriptor(getProtocol, function (protocol) {
        var url = getInternalURLState(this);
        parseURL(url, String(protocol) + ':', SCHEME_START);
      }),
      // `URL.prototype.username` accessors pair
      // https://url.spec.whatwg.org/#dom-url-username
      username: accessorDescriptor(getUsername, function (username) {
        var url = getInternalURLState(this);
        var codePoints = arrayFrom(String(username));
        if (cannotHaveUsernamePasswordPort(url)) return;
        url.username = '';
        for (var i = 0; i < codePoints.length; i++) {
          url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
        }
      }),
      // `URL.prototype.password` accessors pair
      // https://url.spec.whatwg.org/#dom-url-password
      password: accessorDescriptor(getPassword, function (password) {
        var url = getInternalURLState(this);
        var codePoints = arrayFrom(String(password));
        if (cannotHaveUsernamePasswordPort(url)) return;
        url.password = '';
        for (var i = 0; i < codePoints.length; i++) {
          url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
        }
      }),
      // `URL.prototype.host` accessors pair
      // https://url.spec.whatwg.org/#dom-url-host
      host: accessorDescriptor(getHost, function (host) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        parseURL(url, String(host), HOST);
      }),
      // `URL.prototype.hostname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hostname
      hostname: accessorDescriptor(getHostname, function (hostname) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        parseURL(url, String(hostname), HOSTNAME);
      }),
      // `URL.prototype.port` accessors pair
      // https://url.spec.whatwg.org/#dom-url-port
      port: accessorDescriptor(getPort, function (port) {
        var url = getInternalURLState(this);
        if (cannotHaveUsernamePasswordPort(url)) return;
        port = String(port);
        if (port == '') url.port = null;
        else parseURL(url, port, PORT);
      }),
      // `URL.prototype.pathname` accessors pair
      // https://url.spec.whatwg.org/#dom-url-pathname
      pathname: accessorDescriptor(getPathname, function (pathname) {
        var url = getInternalURLState(this);
        if (url.cannotBeABaseURL) return;
        url.path = [];
        parseURL(url, pathname + '', PATH_START);
      }),
      // `URL.prototype.search` accessors pair
      // https://url.spec.whatwg.org/#dom-url-search
      search: accessorDescriptor(getSearch, function (search) {
        var url = getInternalURLState(this);
        search = String(search);
        if (search == '') {
          url.query = null;
        } else {
          if ('?' == search.charAt(0)) search = search.slice(1);
          url.query = '';
          parseURL(url, search, QUERY);
        }
        getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
      }),
      // `URL.prototype.searchParams` getter
      // https://url.spec.whatwg.org/#dom-url-searchparams
      searchParams: accessorDescriptor(getSearchParams),
      // `URL.prototype.hash` accessors pair
      // https://url.spec.whatwg.org/#dom-url-hash
      hash: accessorDescriptor(getHash, function (hash) {
        var url = getInternalURLState(this);
        hash = String(hash);
        if (hash == '') {
          url.fragment = null;
          return;
        }
        if ('#' == hash.charAt(0)) hash = hash.slice(1);
        url.fragment = '';
        parseURL(url, hash, FRAGMENT);
      })
    });
  }

  // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson
  redefine(URLPrototype, 'toJSON', function toJSON() {
    return serializeURL.call(this);
  }, { enumerable: true });

  // `URL.prototype.toString` method
  // https://url.spec.whatwg.org/#URL-stringification-behavior
  redefine(URLPrototype, 'toString', function toString() {
    return serializeURL.call(this);
  }, { enumerable: true });

  if (NativeURL) {
    var nativeCreateObjectURL = NativeURL.createObjectURL;
    var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
    // `URL.createObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    // eslint-disable-next-line no-unused-vars
    if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
      return nativeCreateObjectURL.apply(NativeURL, arguments);
    });
    // `URL.revokeObjectURL` method
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
    // eslint-disable-next-line no-unused-vars
    if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
      return nativeRevokeObjectURL.apply(NativeURL, arguments);
    });
  }

  setToStringTag(URLConstructor, 'URL');

  _export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
    URL: URLConstructor
  });

  // `URL.prototype.toJSON` method
  // https://url.spec.whatwg.org/#dom-url-tojson
  _export({ target: 'URL', proto: true, enumerable: true }, {
    toJSON: function toJSON() {
      return URL.prototype.toString.call(this);
    }
  });

  var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] =
      GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        prototype[method] = function(arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList)
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
     module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  // Find the next "balanced" occurrence of the token. Searches through the
  // string unit by unit. Whenever the `paired` token is encountered, the
  // stack size increases by 1. When `token` is encountered, the stack size
  // decreases by 1, and if the stack size is already 0, that's our desired
  // token.
  function balance(source, token, paired) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    options = Object.assign({
      startIndex: 0,
      stackDepth: 0,
      considerEscapes: true
    }, options);
    var lastChar;
    var _options = options,
        startIndex = _options.startIndex,
        stackDepth = _options.stackDepth,
        considerEscapes = _options.considerEscapes;
    var tl = token.length;
    var pl = paired.length;
    var length = source.length;

    for (var i = startIndex; i < length; i++) {
      if (i > 0) {
        lastChar = source.slice(i - 1, i);
      }

      var escaped = considerEscapes ? lastChar === '\\' : false;
      var candidate = source.slice(i, i + tl);
      var pairCandidate = source.slice(i, i + pl);

      if (pairCandidate === paired && !escaped) {
        stackDepth++;
      }

      if (candidate === token && !escaped) {
        stackDepth--;

        if (stackDepth === 0) {
          return i;
        }
      }
    }

    return -1;
  } // Given a multiline string, removes all space at the beginnings of lines.
  // Lets us define replacement strings with indentation, yet have all that
  // extraneous space stripped out before it gets into the replacement.


  function compact(str) {
    str = str.replace(/^[\s\t]*/mg, '');
    str = str.replace(/\n/g, '');
    return str;
  } // Wrap a string in a `span` with the given class name.


  function wrap$2(str, className) {
    if (!str) {
      return '';
    }

    return "<span class=\"".concat(className, "\">").concat(str, "</span>");
  }

  function _isEscapedHash(line, index) {
    return index === 0 ? false : line.charAt(index - 1) === '\\';
  }

  function _trimCommentsFromLine(line) {
    var hashIndex = -1;

    do {
      hashIndex = line.indexOf('#', hashIndex + 1);
    } while (hashIndex > -1 && _isEscapedHash(line, hashIndex));

    if (hashIndex > -1) {
      line = line.substring(0, hashIndex);
    }

    line = line.trim();
    return line;
  } // A tagged template literal that allows you to define a verbose regular
  // expression using backticks. Literal whitespace is ignored, and you can use
  // `#` to mark comments. This makes long regular expressions way easier for
  // humans to read and write.
  //
  // Escape sequences _do not_ need to be double-escaped, with one exception:
  // capture group backreferences like \5 need to be written as \\5, because JS
  // doesn't understand that syntax outside of a literal RegExp.


  function VerboseRegExp(str) {
    var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var raw = str.raw[0];
    var pattern = raw.split(/\n/).map(_trimCommentsFromLine).join('').replace(/\s/g, ''); // Take (e.g.) `\\5` and turn it into `\5`. For some reason we can't do
    // this with raw strings.

    pattern = pattern.replace(/(\\)(\\)(\d+)/g, function (m, _, bs, d) {
      return "".concat(bs).concat(d);
    });
    var result = new RegExp(pattern, flags);
    return result;
  }

  function _getLastToken(results) {
    for (var i = results.length - 1; i >= 0; i--) {
      var token = results[i];

      if (typeof token === 'string') {
        continue;
      }

      if (Array.isArray(token.content)) {
        return _getLastToken(token.content);
      } else {
        return token;
      }
    }

    return null;
  }

  function balanceByLexer(text, lexer) {
    var results = lexer.run(text);

    var lastToken = _getLastToken(results.tokens);

    return lastToken.index + lastToken.content.length - 1;
  }

  function resolve(value) {
    if (typeof value === 'function') {
      return value();
    }

    return value;
  }

  function determineIfFinal(rule, context) {
    var final = rule.final;

    if (typeof final === 'boolean') {
      return final;
    } else if (typeof final === 'function') {
      return final(context);
    } else if (!final) {
      return false;
    } else {
      throw new TypeError("Invalid value for rule.final!");
    }
  }

  var LexerError =
  /*#__PURE__*/
  function (_Error) {
    _inherits(LexerError, _Error);

    function LexerError(message) {
      var _this;

      _classCallCheck(this, LexerError);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(LexerError).call(this, message));
      _this.name = 'LexerError';
      return _this;
    }

    return LexerError;
  }(_wrapNativeSuper(Error)); // A token is a string fragment with contextual information. It has a name,
  // content, and an `index` value that corresponds to where it begins in the
  // original string. A token's content can be either a string or an array of
  // Tokens.


  var Token = function Token(name, content, index, lengthConsumed) {
    _classCallCheck(this, Token);

    this.name = name;
    this.content = content; // “Length consumed” refers to the number of characters that have already
    // been processed in the original source string. All our indices should be
    // relative to this value.
    // The index of the original text at which this token matched.

    this.index = lengthConsumed + index;
  };

  var Lexer =
  /*#__PURE__*/
  function () {
    function Lexer(rules) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      _classCallCheck(this, Lexer);

      this.rules = rules; // A lexer can optionally have a name; this is mainly for debugging
      // purposes.

      this.name = name;
    }

    _createClass(Lexer, [{
      key: "addRules",
      value: function addRules(rules) {
        var _this$rules;

        (_this$rules = this.rules).push.apply(_this$rules, _toConsumableArray(rules));
      } // To iterate through a lexer is to iterate through its rules.

    }, {
      key: Symbol.iterator,
      value:
      /*#__PURE__*/
      regeneratorRuntime.mark(function value() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, rule, lexer, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, subrule;

        return regeneratorRuntime.wrap(function value$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 3;
                _iterator = this.rules[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 42;
                  break;
                }

                rule = _step.value;

                if (!rule.include) {
                  _context.next = 37;
                  break;
                }

                lexer = resolve(rule.include);
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context.prev = 12;
                _iterator2 = lexer[Symbol.iterator]();

              case 14:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context.next = 21;
                  break;
                }

                subrule = _step2.value;
                _context.next = 18;
                return subrule;

              case 18:
                _iteratorNormalCompletion2 = true;
                _context.next = 14;
                break;

              case 21:
                _context.next = 27;
                break;

              case 23:
                _context.prev = 23;
                _context.t0 = _context["catch"](12);
                _didIteratorError2 = true;
                _iteratorError2 = _context.t0;

              case 27:
                _context.prev = 27;
                _context.prev = 28;

                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }

              case 30:
                _context.prev = 30;

                if (!_didIteratorError2) {
                  _context.next = 33;
                  break;
                }

                throw _iteratorError2;

              case 33:
                return _context.finish(30);

              case 34:
                return _context.finish(27);

              case 35:
                _context.next = 39;
                break;

              case 37:
                _context.next = 39;
                return rule;

              case 39:
                _iteratorNormalCompletion = true;
                _context.next = 5;
                break;

              case 42:
                _context.next = 48;
                break;

              case 44:
                _context.prev = 44;
                _context.t1 = _context["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context.t1;

              case 48:
                _context.prev = 48;
                _context.prev = 49;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 51:
                _context.prev = 51;

                if (!_didIteratorError) {
                  _context.next = 54;
                  break;
                }

                throw _iteratorError;

              case 54:
                return _context.finish(51);

              case 55:
                return _context.finish(48);

              case 56:
              case "end":
                return _context.stop();
            }
          }
        }, value, this, [[3, 44, 48, 56], [12, 23, 27, 35], [28,, 30, 34], [49,, 51, 55]]);
      })
    }, {
      key: "run",
      value: function run(text) {
        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref$startIndex = _ref.startIndex,
            startIndex = _ref$startIndex === void 0 ? 0 : _ref$startIndex;
        var tokens = [];

        if (!context) {
          context = new Map();
        }

        var lastText = null;
        var lengthConsumed = startIndex;

        while (text) {
          // console.groupCollapsed(`${this.name ? `[${this.name}] ` : ''}Trying new match:`, text);
          // `cMatch` and `cRule` refer to a candidate match and a candidate rule,
          // respectively.
          var rule = void 0,
              match = void 0,
              cMatch = void 0;
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var cRule = _step3.value;

              if (cRule.test) {
                cMatch = cRule.test(cRule.pattern, text, context);
              }

              cMatch = cRule.pattern.exec(text);

              if (cMatch) {
                // This rule matched, but it's still only a _candidate_ for the right
                // match. We choose the one that matches as near to the beginning of
                // the string as possible.
                if (cMatch.index === 0) {
                  // This pattern matched without skipping any text. It's the winner.
                  match = cMatch;
                  rule = cRule;
                  break;
                } else if (!match || cMatch.index < match.index) {
                  // This is the match that has skipped the least text so far. But
                  // keep going to see if we can find a better one.
                  match = cMatch;
                  rule = cRule;
                }
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          if (!match) {
            // Failing to match anything will cause the Lexer to return and report its results. // console.groupEnd();

            break;
          }

          var matchIndex = match.index;
          var newStartIndex = match.index + match[0].length;

          if (match.index > 0) {
            var skipped = text.slice(0, match.index);
            tokens.push(skipped);
            lengthConsumed += skipped.length; // Now that we've consumed all the skipped text, the match's index
            // should be reset to zero, as if that skipped text had already been
            // processed before the call to `exec`.

            matchIndex = 0;
          }

          text = text.slice(newStartIndex); // A rule with `final: true` will cause the lexer to stop parsing once
          // the current match has been processed.
          //
          // If we're inside a sub-lexer, this means that it will cede to its
          // parent, and the parent will continue parsing with its own rules.
          //
          // If we're not inside a sub-lexer, this means that it will cede to the
          // code that called it, even if the entire string hasn't been parsed yet.
          //
          // The `final` property can be a boolean or a function. If it's a
          // function, it'll get called with the current `context` as its only
          // argument. This lets us decide dynamically whether the lexer should
          // terminate based on state.
          //
          // An additional property, `skipSubRulesIfFinal`, determines what happens
          // when a final rule also has a sub-lexer (via the `after` or
          // `inside`properties). If `false` (the default), `final` acts _after_
          // the sub-lexer has a chance to parse the remaining portion of the
          // string. If `true`, the lexer skips the sub-lexing phase even if
          // `inside` or `after` is present.

          var ruleIsFinal = determineIfFinal(rule, context);
          var shouldSkipSubRules = ruleIsFinal && rule.skipSubRulesIfFinal;

          if (rule.raw) {
            // Sometimes we write rules to match a string just to prevent it from
            // being matched by another rule. In these cases, we can use `raw:
            // true` to pass along the raw string rather than wrap it in a Token.
            tokens.push(match[0]);
            lengthConsumed += match[0].length;
          } else if ((rule.inside || rule.after) && !shouldSkipSubRules) {
            var lexerName = void 0,
                lexer = void 0,
                mode = void 0; // Often, when we encounter a certain pattern, we want to have a
            // different lexer parse some successive portion of the string before
            // we act again. This is how we apply context-aware parsing rules.
            //
            // We specify these "sub-lexers" via `inside` or `after`. The two
            // properties have identical shapes: they take a `name` property and a
            // `lexer` property, the values of which are a string and a Lexer
            // instance, respectively.
            //
            // Sub-lexing produces a token whose content is an array, rather than a
            // string, and which contains all the Tokens parsed by the sub-lexer,
            // in order. Its name will be the `name` value you specified in your
            // `after` or `inside` rule.
            //
            // The difference between `inside` and `after` is whether the rule that
            // prompted the sub-lexing is placed _within_ that Token (as the first
            // item in its `content` array) or just _before_ that token.
            //
            // Any `context` set inside your lexer will also be available to
            // sub-lexers. It's up to the sub-lexer to decide when to stop parsing,
            // but that decision can be made dynamically depending on the values
            // inside of the `context` store.

            if (rule.inside) {
              mode = 'inside';
              lexerName = rule.inside.name;
              lexer = resolve(rule.inside.lexer);
            } else {
              mode = 'after';
              lexerName = rule.after.name;
              lexer = resolve(rule.after.lexer);
            }

            if (!lexer || !(lexer instanceof Lexer)) {
              throw new LexerError("Invalid lexer!");
            }

            var initialToken = new Token(rule.name, match[0], matchIndex, lengthConsumed);
            var subLexerStartIndex = lengthConsumed + match[0].length - matchIndex;
            var subTokens = [];

            if (mode === 'inside') {
              // In 'inside' mode, this initial token is part of the subtokens
              // collection.
              subTokens.push(initialToken);
            } else {
              // In 'after' mode, this initial token is not part of the subtokens
              // collection.
              tokens.push(initialToken);
            } // To ensure accurate `index` values on Tokens, we need to tell the
            // sub-lexer how much of the string we've already consumed.

            var lexerResult = lexer.run(text, context, {
              startIndex: subLexerStartIndex
            });
            subTokens.push.apply(subTokens, _toConsumableArray(lexerResult.tokens)); // Build the container token.

            var token = new Token(lexerName, subTokens, matchIndex, lengthConsumed);
            tokens.push(token);
            lengthConsumed = lexerResult.lengthConsumed;
            text = lexerResult.text;
          } else {
            var _token = new Token(rule.name, match[0], matchIndex, lengthConsumed);

            tokens.push(_token);
            lengthConsumed += match[0].length;
          }

          if (ruleIsFinal) { // console.groupEnd();

            break;
          } // If we get this far without having consumed any more of the string than
          // the last iteration, then we should consider ourselves to be done. This
          // is in place to prevent accidental infinite loops, though it does
          // prevent us from using patterns that end up consuming zero characters.
          // In the future I might want this to behave differently.


          if (text === lastText) { // console.groupEnd();

            break;
          }

          lastText = text; // console.groupEnd();
        } // end the gigantic `while` loop.
        // Lexer#run returns three values: an array of tokens, the leftover text
        // that could not be parsed (if any), and the number of characters that
        // were able to be parsed.


        return {
          tokens: tokens,
          text: text,
          lengthConsumed: lengthConsumed
        };
      }
    }]);

    return Lexer;
  }();

  function _regexToString(re) {
    var str = re.toString();
    str = str.replace(/^\//, '');
    str = str.replace(/\/[mgiy]*$/, '');
    return str;
  } // Coerces `null` and `undefined` to empty strings; uses default coercion on
  // everything else.


  function _interpretString(value) {
    return value == null ? '' : String(value);
  }

  function _escapeRegex(str) {
    return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  function _regexWithoutGlobalFlag(re) {
    var flags = re.flags.replace('g', '');
    return new RegExp(_regexToString(re), flags);
  } // Like String#replace, but with some enhancements:
  //
  // * Understands Templates and Template-style strings.
  // * Allows the handler to retroactively match _less_ than what it was
  //   given, tossing the rest back into the queue for matching.
  //


  function gsub(source, pattern, replacement) {
    var result = '';

    if (typeof replacement !== 'function') {
      var template = new Template(replacement);

      replacement = function replacement(match) {
        return template.evaluate(match);
      };
    }

    if (pattern.flags && pattern.flags.indexOf('g') > -1) {
      pattern = _regexWithoutGlobalFlag(pattern);
    } else if (typeof pattern === 'string') {
      pattern = _escapeRegex(pattern);
    }

    if (!pattern) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    } // The original string is the 'inbox'; the result string is the 'outbox.'
    // While the inbox still has stuff in it, keep applying the pattern against
    // the source.


    while (source.length > 0) {
      var origLength = source.length;
      var match = source.match(pattern);

      if (match) {
        var replaced = replacement(match, source);
        var newLength = void 0;

        if (Array.isArray(replaced)) {
          // The replacement function can optionally return _two_ values: the
          // replacement string and an index representing the length of the
          // string it actually acted on. In other words, it decided it wanted to
          // claim only some of the string we gave it, and we should consider
          // _only_ that substring to have been matched in the first place.
          //
          // The index returned represents the last character of the _matched_
          // string that the handler cared about. So later on we'll have to
          // account for the length of the portion _before_ the match.
          var _replaced = replaced;

          var _replaced2 = _slicedToArray(_replaced, 2);

          replaced = _replaced2[0];
          newLength = _replaced2[1];
        } // Copy over the part that comes before the match.


        result += source.slice(0, match.index); // Copy over the string that is meant to replace the matched string.

        result += _interpretString(replaced); // Now we can remove everything from `source` up to the end of what was
        // matched.

        if (typeof newLength !== 'undefined') {
          // Remove only the portion that the replacement function actually
          // consumed.
          source = source.slice(match.index + newLength);
        } else {
          source = source.slice(match.index + match[0].length);
        }

        if (source.length === origLength) {
          throw new Error('Infinite loop detected; none of the string was consumed.');
        }
      } else {
        // No more matches. The rest of the string gets moved to the outbox.
        // We're done.
        result += source;
        source = '';
      }
    }

    return result;
  }

  var Context =
  /*#__PURE__*/
  function () {
    function Context(options) {
      _classCallCheck(this, Context);

      if (options.highlighter) {
        this.highlighter = options.highlighter;
      }

      this.storage = new Map();
    }

    _createClass(Context, [{
      key: "set",
      value: function set(key, value) {
        this.storage.set(key, value);
      }
    }, {
      key: "get",
      value: function get(key, defaultValue) {
        if (!this.storage.has(key)) {
          this.storage.set(key, defaultValue);
          return defaultValue;
        }

        return this.storage.get(key);
      }
    }]);

    return Context;
  }();

  var Template =
  /*#__PURE__*/
  function () {
    function Template(template, pattern) {
      _classCallCheck(this, Template);

      this.template = String(template);
      this.pattern = pattern || Template.DEFAULT_PATTERN;
    }

    _createClass(Template, [{
      key: "evaluate",
      value: function evaluate(object) {
        return gsub(this.template, this.pattern, function (match) {
          if (object == null) return '';
          var before = match[1] || '';
          if (before == '\\') return match[2];
          var ctx = object,
              expr = match[3];
          var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
          match = pattern.exec(expr);
          if (match == null) return before;

          while (match != null) {
            var comp = match[1].charAt(0) === '[' ? match[2].replace(/\\]/, ']') : match[1];
            ctx = ctx[comp];

            if (ctx == null || match[3] === '') {
              break;
            }

            expr = expr.substring('[' === match[3] ? match[1].length : match[0].length);
            match = pattern.exec(expr);
          }

          return before + _interpretString(ctx);
        });
      }
    }]);

    return Template;
  }();

  Template.DEFAULT_PATTERN = /(^|.|\r|\n)(#\{(.*?)\})/;

  Template.interpolate = function (string, object) {
    return new Template(string).evaluate(object);
  };

  var Highlighter =
  /*#__PURE__*/
  function () {
    function Highlighter() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Highlighter);

      this.grammars = [];
      this._grammarTable = {};
      this.elements = [];
      this.options = Object.assign({}, Highlighter.DEFAULT_OPTIONS, options);
    }

    _createClass(Highlighter, [{
      key: "addElement",
      value: function addElement(element) {
        if (this.elements.indexOf(element) > -1) {
          return;
        }

        this.elements.push(element);
      }
    }, {
      key: "addGrammar",
      value: function addGrammar(grammar) {
        if (!grammar.name) {
          throw new Error("Can't register a grammar without a name.'");
        }

        if (this.grammars.indexOf(grammar) > -1) {
          return;
        }

        this.grammars.push(grammar);

        if (grammar.name) {
          this._grammarTable[grammar.name] = grammar;
        }
      }
    }, {
      key: "scan",
      value: function scan(node) {
        var _this = this;

        this.grammars.forEach(function (grammar) {
          var selector = grammar.names.map(function (n) {
            var cls = _this.options.classPrefix + n;
            return "code.".concat(cls, ":not([data-highlighted])");
          }).join(', ');
          var nodes = node.querySelectorAll(selector);
          nodes = Array.from(nodes);

          if (!nodes || !nodes.length) {
            return;
          }

          nodes.forEach(function (el) {
            if (el.hasAttribute('data-daub-highlighted')) {
              return;
            }

            var context = new Context({
              highlighter: _this
            });
            var source = el.innerHTML;

            if (grammar.options.encode) {
              source = source.replace(/</g, '&lt;');
            }

            var parsed = _this.parse(source, grammar, context);

            _this._updateElement(el, parsed, grammar);

            el.setAttribute('data-daub-highlighted', 'true');
            var meta = {
              element: el,
              grammar: grammar
            };

            _this._fire('highlighted', el, meta, {
              cancelable: false
            });
          });
        });
      }
    }, {
      key: "highlight",
      value: function highlight() {
        var _this2 = this;

        this.elements.forEach(function (el) {
          return _this2.scan(el);
        });
      }
    }, {
      key: "_updateElement",
      value: function _updateElement(element, text, grammar) {
        var doc = element.ownerDocument,
            range = doc.createRange(); // Turn the string into a DOM fragment so that it can more easily be
        // acted on by plugins.

        var fragment = range.createContextualFragment(text);
        var meta = {
          element: element,
          grammar: grammar,
          fragment: fragment
        };

        var event = this._fire('will-highlight', element, meta); // Allow event handlers to cancel the highlight.


        if (event.defaultPrevented) {
          return;
        } // Allow event handlers to mutate the fragment.


        if (event.detail.fragment) {
          fragment = event.detail.fragment;
        }

        element.innerHTML = '';
        element.appendChild(fragment);
      }
    }, {
      key: "_fire",
      value: function _fire(name, element, detail) {
        var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        Object.assign(detail, {
          highlighter: this
        });
        var options = Object.assign({
          bubbles: true,
          cancelable: true
        }, opts, {
          detail: detail
        });
        var event = new CustomEvent("daub-".concat(name), options);
        element.dispatchEvent(event);
        return event;
      }
    }, {
      key: "parse",
      value: function parse(text) {
        var grammar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        if (typeof grammar === 'string') {
          // If the user passes a string and we can't find the grammar, we should
          // fail silently instead of throwing an error.
          grammar = this._grammarTable[grammar];

          if (!grammar) {
            return text;
          }
        } else if (!grammar) {
          throw new Error("Must specify a grammar!");
        }

        if (!context) {
          context = new Context({
            highlighter: this
          });
        }

        var parsed = grammar.parse(text, context);
        return parsed;
      }
    }]);

    return Highlighter;
  }();

  Highlighter.DEFAULT_OPTIONS = {
    classPrefix: ''
  };

  var ParseError =
  /*#__PURE__*/
  function (_Error) {
    _inherits(ParseError, _Error);

    function ParseError(message) {
      var _this3;

      _classCallCheck(this, ParseError);

      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(ParseError).call(this, message));
      _this3.name = 'ParseError';
      return _this3;
    }

    return ParseError;
  }(_wrapNativeSuper(Error));

  var Grammar =
  /*#__PURE__*/
  function () {
    function Grammar(name, rules) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, Grammar);

      if (_typeof(name) === 'object' && !rules) {
        // Anonymous grammar.
        this.name = null;
        options = rules || options;
        rules = name;
      } else {
        this.name = name;
        this.names = [name].concat(_toConsumableArray(options.alias || []));
        this._classNamePattern = new RegExp('\\b(?:' + this.names.join('|') + ')\\b');
      }

      this.options = options;
      this.rules = [];
      this._originalRules = rules;
      this.extend(rules);
    }

    _createClass(Grammar, [{
      key: "_toObject",
      value: function _toObject() {
        return _objectSpread2({}, this._originalRules);
      }
    }, {
      key: "parse",
      value: function parse(text) {
        var _this4 = this;

        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var pattern = this.pattern;
        pattern.lastIndex = 0; // eslint-disable-next-line

        if (!pattern.test(text)) {
          return text;
        }

        var parsed = gsub(text, pattern, function (match, source) {
          var i = 0,
              j = 1,
              rule,
              index,
              actualLength; // Find the rule that matched.

          while (rule = _this4.rules[i++]) {
            if (!match[j]) {
              j += rule.length;
              continue;
            }

            if (rule.index) {
              // The rule is saying that it might decide that it wants to parse
              // less than what it was given. In that case it'll return an index
              // representing the last character it's actually interested in.
              //
              // We'll return this index as a second return parameter from this
              // handler in order to let gsub know what's up.
              actualLength = rule.index(match[0], context);

              if (actualLength <= 0) {
                // -1 is your standard "string not found" index, and 0 is invalid
                // because we need to consume at least some of the string to
                // avoid an infinite loop. In both cases, ignore the result.
                actualLength = undefined;
              }

              if (typeof actualLength !== 'undefined') {
                // Trim the string down to the portion that we retroactively
                // decided we care about.
                index = actualLength + 1;
                source = source.slice(0, match.index + index);
                match = pattern.exec(source);

                if (!match || !match[j]) {
                  var err = new ParseError("Bad \"index\" callback; requested substring did not match original rule.");
                  Object.assign(err, {
                    rule: rule,
                    source: source,
                    match: match,
                    index: actualLength
                  });
                  throw err;
                }
              }
            }

            var replacements = [];

            for (var k = 0; k <= rule.length; k++) {
              replacements.push(match[j + k]);
            }

            replacements.name = rule.name;

            if (rule.captures) {
              for (var _i = 0; _i < replacements.length; _i++) {
                if (!(_i in rule.captures)) {
                  continue;
                }

                var captureValue = rule.captures[_i];

                if (typeof captureValue === 'function') {
                  captureValue = captureValue();
                }

                if (typeof captureValue === 'string') {
                  // A string capture just specifies the class name(s) this token
                  // should have. We'll wrap it in a `span` tag.
                  replacements[_i] = wrap$2(replacements[_i], captureValue);
                } else if (captureValue instanceof Grammar) {
                  // A grammar capture tells us to parse this string with the
                  // grammar in question.
                  replacements[_i] = captureValue.parse(replacements[_i], context);
                }
              }
            }

            if (rule.before) {
              var beforeResult = rule.before(replacements, context);

              if (typeof beforeResult !== 'undefined') {
                replacements = beforeResult;
              }
            }

            var replacer = rule.replacement;

            if (!replacements.name) {
              // Only assign the name if it isn't already there. The `before`
              // callback might have changed the name.
              replacements.name = rule.name;
            }

            replacements.index = match.index;
            var result = replacer.evaluate(replacements);

            if (rule.after) {
              var afterResult = rule.after(result, context);

              if (typeof afterResult !== 'undefined') {
                result = afterResult;
              }
            }

            if (typeof actualLength !== 'undefined') {
              return [result, index];
            }

            return result;
          } // No matches, so let's return an empty string.


          return '';
        });
        return parsed;
      }
    }, {
      key: "_makeRules",
      value: function _makeRules(rules) {
        var prevCaptures = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var results = [];

        for (var ruleName in rules) {
          var rule = new Rule(ruleName, rules[ruleName], prevCaptures);
          results.push(rule);
          prevCaptures += rule.length;
        }

        return results;
      }
    }, {
      key: "match",
      value: function match(className) {
        return this._classNamePattern.test(className);
      }
    }, {
      key: "extend",
      value: function extend() {
        var _this5 = this,
            _this$rules;

        var grammar;

        for (var _len = arguments.length, grammars = new Array(_len), _key = 0; _key < _len; _key++) {
          grammars[_key] = arguments[_key];
        }

        if (grammars.length === 1) {
          grammar = grammars[0];
        } else {
          grammars.forEach(function (g) {
            return _this5.extend(g);
          });
          return this;
        }

        if (grammar instanceof Grammar) {
          grammar = grammar.toObject();
        }

        if (!grammar) {
          throw new Error('Nonexistent grammar!');
        }

        var prevCaptures = 0;

        if (this.rules.length) {
          prevCaptures = this.rules.map(function (r) {
            return r.length;
          }).reduce(function (a, b) {
            return a + b;
          });
        }

        var rules = grammar;

        var instances = this._makeRules(rules, prevCaptures);

        (_this$rules = this.rules).push.apply(_this$rules, _toConsumableArray(instances));

        this.pattern = new RegExp(this.rules.map(function (r) {
          return r.pattern;
        }).join('|'), this.options.ignoreCase ? 'mi' : 'm');
        return this;
      }
    }, {
      key: "toObject",
      value: function toObject() {
        var result = {};
        this.rules.forEach(function (r) {
          result[r.name] = r.toObject();
        });
        return result;
      }
    }]);

    return Grammar;
  }();

  var Rule =
  /*#__PURE__*/
  function () {
    function Rule(name, rule, prevCaptures) {
      _classCallCheck(this, Rule);

      this.name = name;
      var r = rule.replacement;

      if (r) {
        this.replacement = r instanceof Template ? r : new Template(r);
      } else if (rule.captures) {
        // If captures are defined, that means this pattern defines groups. We
        // want a different default template that breaks those groups out. But we
        // won't actually make it until we know how many groups the pattern has.
        this.replacement = null;
      } else {
        this.replacement = Rule.DEFAULT_TEMPLATE;
      }

      this.debug = rule.debug;
      this.before = rule.before;
      this.after = rule.after;
      this.index = rule.index;
      this.captures = rule.captures;
      var originalPattern = rule.pattern;
      var pattern = rule.pattern;

      if (typeof pattern !== 'string') {
        pattern = _regexToString(pattern);
      } // Alter backreferences so that they point to the right thing. Yes,
      // this is ridiculous.


      pattern = pattern.replace(/\\(\d+)/g, function (m, d) {
        var group = Number(d);
        var newGroup = prevCaptures + group + 1; // Adjust for the number of groups that already exist, plus the
        // surrounding set of parentheses.

        return "\\".concat(newGroup);
      }); // Count all open parentheses.

      var parens = (pattern.match(/\(/g) || '').length; // Subtract the ones that begin non-capturing groups.

      var nonCapturing = (pattern.match(/\(\?[:!=]/g) || '').length; // Subtract the ones that are literal open-parens.

      var escaped = (pattern.match(/\\\(/g) || '').length; // Add back the ones that match the literal pattern `\(?`, because they
      // were counted twice instead of once.

      var nonCapturingEscaped = (pattern.match(/\\\(\?[:!=]/g) || '').length;
      var exceptions = nonCapturing + escaped - nonCapturingEscaped; // Add one because we're about to surround the whole thing in a
      // capturing group.

      this.length = parens + 1 - exceptions;
      this.pattern = "(".concat(pattern, ")");
      this.originalPattern = originalPattern;

      if (!this.replacement) {
        this.replacement = Rule.makeReplacement(this.length, rule.wrapReplacement);
      }
    }

    _createClass(Rule, [{
      key: "toObject",
      value: function toObject() {
        return {
          // Export the original pattern, not the one we transformed. It'll need to
          // be re-transformed in its new context.
          pattern: this.originalPattern,
          replacement: this.replacement,
          before: this.before,
          after: this.after,
          index: this.index,
          captures: this.captures
        };
      }
    }]);

    return Rule;
  }();

  Rule.DEFAULT_TEMPLATE = new Template('<span class="#{name}">#{0}</span>');

  Rule.makeReplacement = function (length, wrap) {
    var arr = [];

    for (var i = 1; i < length; i++) {
      arr.push(i);
    }

    var captures = arr.join("}#{");
    captures = "#{".concat(captures, "}");
    var contents = wrap ? "<span class=\"#{name}\">".concat(captures, "</span>") : captures;
    return new Template(contents);
  };

  function _templateObject11() {
    var data = _taggedTemplateLiteral(["\n      (#(?:ifdef|ifndef|undef|if)) # 1: macro keyword\n      (s+)                     # 2: whitespace\n      (w+)                     # 3: token\n    "], ["\n      (\\#(?:ifdef|ifndef|undef|if)) # 1: macro keyword\n      (\\s+)                     # 2: whitespace\n      (\\w+)                     # 3: token\n    "]);

    _templateObject11 = function _templateObject11() {
      return data;
    };

    return data;
  }

  function _templateObject10() {
    var data = _taggedTemplateLiteral(["\n      ^(#include) # 1: include\n      (s+)        # 2: whitespace\n      (\"|<|&lt;)   # 3: punctuation\n      (.*?)        # 4: import name\n      (\"|>|&gt;)   # 5: punctuation\n      (?=\n|$)     # end of line\n    "], ["\n      ^(\\#include) # 1: include\n      (\\s+)        # 2: whitespace\n      (\"|<|&lt;)   # 3: punctuation\n      (.*?)        # 4: import name\n      (\"|>|&gt;)   # 5: punctuation\n      (?=\\n|$)     # end of line\n    "]);

    _templateObject10 = function _templateObject10() {
      return data;
    };

    return data;
  }

  function _templateObject9() {
    var data = _taggedTemplateLiteral(["\n      ^(#define)  # 1: define\n      (s+)        # 2: whitespace\n      (w+)        # 3: any token\n      (.*?)$       # 4: any value\n    "], ["\n      ^(\\#define)  # 1: define\n      (\\s+)        # 2: whitespace\n      (\\w+)        # 3: any token\n      (.*?)$       # 4: any value\n    "]);

    _templateObject9 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8() {
    var data = _taggedTemplateLiteral(["\n      ([])     # 1: empty square brackets\n      (s*)      # 2: optional whitespace\n      (()       # 3: open paren\n      ([sS]*)  # 4: parameters\n      ())       # 5: close paren\n      (s*)      # 6: optional whitespace\n      ({)        # 7: opening brace\n      ([sS]*)  # 8: lambda contents\n      (})        # 9: closing brace\n    "], ["\n      (\\[\\])     # 1: empty square brackets\n      (\\s*)      # 2: optional whitespace\n      (\\()       # 3: open paren\n      ([\\s\\S]*)  # 4: parameters\n      (\\))       # 5: close paren\n      (\\s*)      # 6: optional whitespace\n      ({)        # 7: opening brace\n      ([\\s\\S]*)  # 8: lambda contents\n      (})        # 9: closing brace\n    "]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    var data = _taggedTemplateLiteral(["\n      \b(class|enum)                # 1: keyword\n      (s+)                    # 2: whitespace\n      ([A-Za-z][A-Za-z0-9:_$]*) # 3: identifier\n      (s*)                    # 4: optional whitespace\n      ({)                      # 5: opening brace\n    "], ["\n      \\b(class|enum)                # 1: keyword\n      (\\s+)                    # 2: whitespace\n      ([A-Za-z][A-Za-z0-9:_$]*) # 3: identifier\n      (\\s*)                    # 4: optional whitespace\n      ({)                      # 5: opening brace\n    "]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    var data = _taggedTemplateLiteral(["\n      \b([A-Za-z_$][wd]*) # 1: type\n      (s+)                 # 2: whitespace\n      ([A-Za-z_$][wd]*)   # 3: identifier\n      (s*)                 # 4: optional whitespace\n      (()                  # 5: open paren\n      ([sS]*)             # 6: arguments\n      ())                  # 7: close paren\n      (;)                   # 8: semicolon\n    "], ["\n      \\b([A-Za-z_$][\\w\\d]*) # 1: type\n      (\\s+)                 # 2: whitespace\n      ([A-Za-z_$][\\w\\d]*)   # 3: identifier\n      (\\s*)                 # 4: optional whitespace\n      (\\()                  # 5: open paren\n      ([\\s\\S]*)             # 6: arguments\n      (\\))                  # 7: close paren\n      (;)                   # 8: semicolon\n    "]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    var data = _taggedTemplateLiteral(["\n      \b([A-Za-z_$][wd]*) # 1: type\n      (s+)                 # 2: whitespace\n      ([A-Za-z_$][wd]*)   # 3: identifier\n      ([)                   # 4: open bracket\n      (d+)                 # 5: number\n      (])                   # 6: close bracket\n    "], ["\n      \\b([A-Za-z_$][\\w\\d]*) # 1: type\n      (\\s+)                 # 2: whitespace\n      ([A-Za-z_$][\\w\\d]*)   # 3: identifier\n      (\\[)                   # 4: open bracket\n      (\\d+)                 # 5: number\n      (\\])                   # 6: close bracket\n    "]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    var data = _taggedTemplateLiteral(["\n      \b([A-Za-z_$][wd]*) # 1: type\n      (s+)                 # 2: whitespace\n      ([A-Za-z_$][wd]*)   # 3: identifier\n      (s*)                 # 4: optional whitespace\n      (=)                   # 5: equals sign\n    "], ["\n      \\b([A-Za-z_$][\\w\\d]*) # 1: type\n      (\\s+)                 # 2: whitespace\n      ([A-Za-z_$][\\w\\d]*)   # 3: identifier\n      (\\s*)                 # 4: optional whitespace\n      (=)                   # 5: equals sign\n    "]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    var data = _taggedTemplateLiteral(["\n      \b([A-Za-z_$][wd]*) # 1: type\n      (s+)                 # 2: whitespace\n      ([A-Za-z_$][wd]*)   # 3: identifier\n      (s*)                 # 4: optional whitespace\n      (?=;)                 # followed by semicolon\n    "], ["\n      \\b([A-Za-z_$][\\w\\d]*) # 1: type\n      (\\s+)                 # 2: whitespace\n      ([A-Za-z_$][\\w\\d]*)   # 3: identifier\n      (\\s*)                 # 4: optional whitespace\n      (?=;)                 # followed by semicolon\n    "]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    var data = _taggedTemplateLiteral(["\n      ([A-Za-z_$]w*) # 1: return type\n      (s+)             # 2: space\n      ([a-zA-Z_$:]w*)  # 3: function name\n      (s*)             # 4: space\n      (()              # 5: open parenthesis\n      (.*)             # 6: raw params\n      ())              # 7: close parenthesis\n      (s*)             # 8: optional whitespace\n      (?={)               # 9: open brace\n    "], ["\n      ([A-Za-z_$]\\w*) # 1: return type\n      (\\s+)             # 2: space\n      ([a-zA-Z_$:]\\w*)  # 3: function name\n      (\\s*)             # 4: space\n      (\\()              # 5: open parenthesis\n      (.*)             # 6: raw params\n      (\\))              # 7: close parenthesis\n      (\\s*)             # 8: optional whitespace\n      (?={)               # 9: open brace\n    "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    var data = _taggedTemplateLiteral(["\n      (?:\b|^)\n      (\n        (?:\n          (?:[A-Za-z_$][wd]*)s\n        )*\n      )                     # 1: variable type\n      (s*)                     # 2: whitespace\n      ([a-zA-Z_$:][wd]*)      # 3: variable name\n      (?=,|$)     # 4: end of parameter/signature\n    "], ["\n      (?:\\b|^)\n      (\n        (?:\n          (?:[A-Za-z_$][\\w\\d]*)\\s\n        )*\n      )                     # 1: variable type\n      (\\s*)                     # 2: whitespace\n      ([a-zA-Z_$:][\\w\\d]*)      # 3: variable name\n      (?=,|$)     # 4: end of parameter/signature\n    "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }
  var balance$1 = balance,
      compact$1 = compact,
      VerboseRegExp$1 = VerboseRegExp,
      wrap$3 = wrap$2;
  var PARAMETERS = new Grammar({
    'parameter': {
      pattern: VerboseRegExp$1(_templateObject()),
      replacement: compact$1("\n      <span class=\"parameter\">\n        <span class=\"storage storage-type\">#{1}</span>\n        #{2}\n        <span class=\"variable\">#{3}</span>\n      </span>\n    "),
      before: function before(r) {
        r[1] = STORAGE.parse(r[1]);
      }
    }
  });
  var ESCAPES = new Grammar({
    escape: {
      pattern: /\\./
    }
  });
  var DECLARATIONS = new Grammar({
    'meta: function': {
      pattern: VerboseRegExp$1(_templateObject2()),
      index: function index(match) {
        var parenIndex = balance$1(match, ')', '(', {
          startIndex: match.indexOf('(')
        }); // Find the index just before the opening brace after the parentheses are balanced.

        return match.indexOf('{', parenIndex) - 1;
      },
      replacement: "<b><span class='storage storage-type storage-return-type'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}#{8}</b>",
      before: function before(r, context) {
        if (r[3]) r[3] = wrap$3(r[3], 'entity'); // console.log('about to parse for params:', r[6]);

        r[6] = PARAMETERS.parse(r[6], context);
        return r;
      }
    },
    'meta: bare declaration': {
      pattern: VerboseRegExp$1(_templateObject3()),
      replacement: compact$1("\n      <span class=\"storage storage-type\">#{1}</span>\n      #{2}\n      <span class=\"variable\">#{3}</span>\n      #{4}\n    ")
    },
    'meta: declaration with assignment': {
      pattern: VerboseRegExp$1(_templateObject4()),
      replacement: compact$1("\n      <span class=\"storage storage-type\">#{1}</span>\n      #{2}\n      <span class=\"variable\">#{3}</span>\n      #{4}\n      <span class=\"operator\">#{5}</span>\n    ")
    },
    'meta: array declaration': {
      pattern: VerboseRegExp$1(_templateObject5()),
      replacement: compact$1("\n      <span class=\"storage storage-type\">#{1}</span>\n      #{2}\n      <span class=\"variable\">#{3}</span>\n      <span class=\"punctuation\">#{4}</span>\n      <span class=\"number\">#{5}</span>\n      <span class=\"punctuation\">#{6}</span>\n    ")
    },
    'meta: declaration with parens': {
      pattern: VerboseRegExp$1(_templateObject6()),
      index: function index(match) {
        var balanceIndex = balance$1(match, ')', '(') + 1;
        var index = match.indexOf(';', balanceIndex);
        return index;
      },
      replacement: compact$1("\n      <span class=\"storage storage-type\">#{1}</span>\n      #{2}\n      <span class=\"variable\">#{3}</span>\n      #{4}\n      <span class=\"punctuation\">#{5}</span>\n      #{6}\n      <span class=\"punctuation\">#{7}</span>\n      #{8}\n    "),
      before: function before(r, context) {
        r[6] = VALUES$1.parse(r[6], context);
      }
    },
    'meta: class declaration': {
      pattern: VerboseRegExp$1(_templateObject7()),
      replacement: compact$1("\n      <span class=\"storage storage-type\">#{1}</span>\n      #{2}\n      <span class=\"entity entity-class\">#{3}</span>\n      #{4}#{5}\n    ")
    }
  });
  var VALUES$1 = new Grammar({
    'constant': {
      pattern: /\b[A-Z_]+\b/
    },
    'meta: lambda': {
      pattern: VerboseRegExp$1(_templateObject8()),
      index: function index(match) {
        return balance$1(match, '}', '{', {
          startIndex: match.indexOf('{')
        });
      },
      replacement: compact$1("\n      <span class=\"lambda\">\n        <span class=\"punctuation\">#{1}</span>#{2}\n        <span class=\"punctuation\">#{3}</span>\n        #{4}\n        <span class=\"punctuation\">#{5}</span>\n        #{6}\n        <span class=\"punctuation\">#{7}</span>\n        #{8}\n        <span class=\"punctuation\">#{9}</span>\n      </span>\n    "),
      before: function before(r, context) {
        r[4] = PARAMETERS.parse(r[4], context);
        r[8] = MAIN.parse(r[8], context);
      }
    },
    'constant constant-boolean': {
      pattern: /\b(?:true|false)\b/
    },
    'string string-single-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-apostrophes and non-backslashes OR
      // * an even number of consecutive backslashes OR
      // * any backslash-plus-apostrophe pair.
      pattern: /(')((?:[^'\\]|\\\\|\\')*)(')/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = ESCAPES.parse(r[2], context);
      }
    },
    'string string-double-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-quotes and non-backslashes OR
      // * an even number of consecutive backslashes OR
      // * any backslash-plus-quote pair.
      pattern: /(")((?:[^"\\]|\\\\|\\")*)(")/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = ESCAPES.parse(r[2], context);
      }
    },
    'number': {
      pattern: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i
    }
  });
  var COMMENTS = new Grammar({
    comment: {
      pattern: /(\/\/[^\n]*(?=\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
    }
  });
  var STORAGE = new Grammar({
    'storage storage-type': {
      pattern: /\b(?:u?int(?:8|16|36|64)_t|int|long|float|double|char(?:16|32)_t|char|class|bool|wchar_t|volatile|virtual|extern|mutable|const|unsigned|signed|static|struct|template|private|protected|public|mutable|volatile|namespace|struct|void|short|enum)/
    }
  });
  var MACRO_VALUES = new Grammar({}).extend(COMMENTS, VALUES$1);
  var MACROS = new Grammar({
    'macro macro-define': {
      pattern: VerboseRegExp$1(_templateObject9()),
      replacement: compact$1("\n      <span class=\"keyword keyword-macro\">#{1}</span>#{2}\n      <span class=\"entity entity-macro\">#{3}</span>\n      #{4}\n    "),
      before: function before(r, context) {
        r[4] = MACRO_VALUES.parse(r[4], context);
      }
    },
    'macro macro-include': {
      pattern: VerboseRegExp$1(_templateObject10()),
      replacement: compact$1("\n      <span class=\"keyword keyword-macro\">#{1}</span>#{2}\n      <span class=\"string string-include\">\n        <span class=\"punctuation\">#{3}</span>\n        #{4}\n        <span class=\"punctuation\">#{5}</span>\n      </span>\n    ")
    },
    'macro macro-with-one-argument': {
      pattern: VerboseRegExp$1(_templateObject11()),
      replacement: compact$1("\n      <span class=\"keyword keyword-macro\">#{1}</span>\n      #{2}\n      <span class=\"entity entity-macro\">#{3}</span>\n    ")
    },
    'macro macro-error': {
      pattern: /(#error)(\s*)(")(.*)(")/,
      replacement: compact$1("\n      <span class=\"keyword keyword-macro\">#{1}</span>\n      #{2}\n      <span class=\"string string-quoted\">#{3}#{4}#{5}</span>\n    ")
    },
    'keyword keyword-macro': {
      pattern: /#(endif|else)/
    }
  });
  var MAIN = new Grammar('arduino', {
    'keyword keyword-control': {
      pattern: /\b(?:alignas|alignof|asm|auto|break|case|catch|compl|constexpr|const_cast|continue|decltype|default|delete|do|dynamic_cast|else|explicit|export|for|friend|goto|if|inline|new|noexcept|nullptr|operator|register|reinterpret_cast|return|sizeof|static_assert|static_cast|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|using|while)\b/
    }
  }).extend(COMMENTS, DECLARATIONS);
  MAIN.extend(MACROS, VALUES$1, STORAGE, {
    'operator': {
      pattern: /--?|\+\+?|!=?|(?:<|&lt;){1,2}=?|(&gt;|>){1,2}=?|-(?:>|&gt;)|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|\|?|\?|\*|\/|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
    }
  });

  function _templateObject$1() {
    var data = _taggedTemplateLiteral(["\n      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element\n      (s+.*?)?               # 3: space and optional attributes\n      (&gt;|>)                # 4: end opening element\n      ([sS]*?)              # 5: contents\n      ((?:&lt;|<)/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element\n    "], ["\n      (&lt;|<)(script|SCRIPT) # 1, 2: opening script element\n      (\\s+.*?)?               # 3: space and optional attributes\n      (&gt;|>)                # 4: end opening element\n      ([\\s\\S]*?)              # 5: contents\n      ((?:&lt;|<)\\/)(script|SCRIPT)(&gt;|>) # 6, 7, 8: closing script element\n    "]);

    _templateObject$1 = function _templateObject() {
      return data;
    };

    return data;
  }
  var balanceByLexer$1 = balanceByLexer,
      compact$2 = compact,
      VerboseRegExp$2 = VerboseRegExp;
  var LEXER_STRING = new Lexer([{
    name: 'string-escape',
    pattern: /\\./
  }, {
    name: 'string-end',
    pattern: /('|")/,
    test: function test(pattern, text, context) {
      var char = context.get('string-begin');
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      if (match[1] !== char) {
        return false;
      }

      context.set('string-begin', null);
      return match;
    },
    final: true
  }]);
  var LEXER_ATTRIBUTE_VALUE = new Lexer([{
    name: 'string-begin',
    pattern: /^\s*('|")/,
    test: function test(pattern, text, context) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      context.set('string-begin', match[1]);
      return match;
    },
    inside: {
      name: 'string',
      lexer: LEXER_STRING
    }
  }]);
  var LEXER_ATTRIBUTE_SEPARATOR = new Lexer([{
    name: "punctuation",
    pattern: /^=/,
    after: {
      name: 'attribute-value',
      lexer: LEXER_ATTRIBUTE_VALUE
    }
  }]);
  var LEXER_TAG = new Lexer([{
    name: 'tag tag-html',
    pattern: /^[a-z]+(?=\s)/
  }, {
    name: 'attribute-name',
    pattern: /^\s*(?:\/)?[a-z]+(?=\=)/,
    after: {
      name: 'attribute-separator',
      lexer: LEXER_ATTRIBUTE_SEPARATOR
    }
  }, {
    // Self-closing tag.
    name: 'punctuation',
    pattern: /\/(?:>|&gt;)/,
    final: true
  }, {
    // Opening tag end with middle-of-tag context.
    name: 'punctuation',
    pattern: /(>|&gt;)/,
    final: true
  }]);
  var LEXER_TAG_START = new Lexer([{
    name: 'punctuation',
    pattern: /^(?:<|&lt;)/,
    after: {
      name: 'tag',
      lexer: LEXER_TAG
    }
  }]);
  var ATTRIBUTES = new Grammar({
    string: {
      pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
    },
    attribute: {
      pattern: /\b([a-zA-Z-:]+)(=)/,
      replacement: compact$2("\n      <span class='attribute'>\n        <span class='#{name}'>#{1}</span>\n        <span class='punctuation'>#{2}</span>\n      </span>\n    ")
    }
  });
  var MAIN$1 = new Grammar('html', {
    doctype: {
      pattern: /&lt;!DOCTYPE([^&]|&[^g]|&g[^t])*&gt;/
    },
    'embedded embedded-javascript': {
      pattern: VerboseRegExp$2(_templateObject$1()),
      replacement: compact$2("\n      <span class='element element-opening'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag'>#{2}</span>#{3}\n        <span class='punctuation'>#{4}</span>\n      </span>\n        #{5}\n      <span class='element element-closing'>\n        <span class='punctuation'>#{6}</span>\n        <span class='tag'>#{7}</span>\n        <span class='punctuation'>#{8}</span>\n      </span>\n    "),
      before: function before(r, context) {
        if (r[3]) {
          r[3] = ATTRIBUTES.parse(r[3], context);
        }

        r[5] = context.highlighter.parse(r[5], 'javascript', context);
      }
    },
    'tag tag-open': {
      pattern: /((?:<|&lt;))([a-zA-Z0-9:]+\s*)([\s\S]*)(\/)?(&gt;|>)/,
      index: function index(match) {
        return balanceByLexer$1(match, LEXER_TAG_START);
      },
      replacement: compact$2("\n      <span class='element element-opening'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag'>#{2}</span>#{3}\n        <span class='punctuation'>#{4}#{5}</span>\n      </span>#{6}\n    "),
      before: function before(r, context) {
        r[3] = ATTRIBUTES.parse(r[3], context);
      }
    },
    'tag tag-close': {
      pattern: /(&lt;\/)([a-zA-Z0-9:]+)(&gt;)/,
      replacement: compact$2("\n      <span class='element element-closing'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag'>#{2}</span>\n        <span class='punctuation'>#{3}</span>\n      </span>\n    ")
    },
    comment: {
      pattern: /&lt;!\s*(--([^-]|[\r\n]|-[^-])*--\s*)&gt;/
    }
  }, {
    encode: true
  });

  function _templateObject5$1() {
    var data = _taggedTemplateLiteral(["\n      (class)                # 1: storage\n      (?:                    # begin optional class name\n        (s+)                # 2: space\n        ([A-Z][A-Za-z0-9_]*) # 3: class name\n      )?                     # end optional class name\n      (?:                    # begin optional 'extends' keyword\n        (s+)                # 4: space\n        (extends)            # 5: storage\n        (s+)                # 6: space\n        ([A-Z][A-Za-z0-9_$.]*) # 7: superclass name\n      )?                     # end optional 'extends' keyword\n      (s*)                  # 8: space\n      ({)                    # 9: opening brace\n    "], ["\n      (class)                # 1: storage\n      (?:                    # begin optional class name\n        (\\s+)                # 2: space\n        ([A-Z][A-Za-z0-9_]*) # 3: class name\n      )?                     # end optional class name\n      (?:                    # begin optional 'extends' keyword\n        (\\s+)                # 4: space\n        (extends)            # 5: storage\n        (\\s+)                # 6: space\n        ([A-Z][A-Za-z0-9_$\\.]*) # 7: superclass name\n      )?                     # end optional 'extends' keyword\n      (\\s*)                  # 8: space\n      ({)                    # 9: opening brace\n    "]);

    _templateObject5$1 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4$1() {
    var data = _taggedTemplateLiteral(["\n      \b\n      ([a-zA-Z_?.$]+w*) # variable name\n      (s*)\n      (=)\n      (s*)\n      (function)\n      (s*)\n      (()\n      (.*?)       # raw params\n      ())\n    "], ["\n      \\b\n      ([a-zA-Z_?\\.$]+\\w*) # variable name\n      (\\s*)\n      (=)\n      (\\s*)\n      (function)\n      (\\s*)\n      (\\()\n      (.*?)       # raw params\n      (\\))\n    "]);

    _templateObject4$1 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3$1() {
    var data = _taggedTemplateLiteral(["\n      (^s*)\n      (get|set|static)? # 1: annotation\n      (s*)             # 2: space\n      ([a-zA-Z_$][a-zA-Z0-9$_]*) # 3: function name\n      (s*)             # 4: space\n      (()              # 5: open parenthesis\n      (.*?)             # 6: raw params\n      ())              # 7: close parenthesis\n      (s*)             # 8: space\n      ({)              # 9: opening brace\n    "], ["\n      (^\\s*)\n      (get|set|static)? # 1: annotation\n      (\\s*)             # 2: space\n      ([a-zA-Z_$][a-zA-Z0-9$_]*) # 3: function name\n      (\\s*)             # 4: space\n      (\\()              # 5: open parenthesis\n      (.*?)             # 6: raw params\n      (\\))              # 7: close parenthesis\n      (\\s*)             # 8: space\n      (\\{)              # 9: opening brace\n    "]);

    _templateObject3$1 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2$1() {
    var data = _taggedTemplateLiteral(["\n      \b(function)\n      (s*)\n      ([a-zA-Z_$]w*)? # function name (optional)\n      (s*)\n      (()             # open parenthesis\n      (.*?)            # raw params\n      ())             # close parenthesis\n    "], ["\n      \\b(function)\n      (\\s*)\n      ([a-zA-Z_$]\\w*)? # function name (optional)\n      (\\s*)\n      (\\()             # open parenthesis\n      (.*?)            # raw params\n      (\\))             # close parenthesis\n    "]);

    _templateObject2$1 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject$2() {
    var data = _taggedTemplateLiteral(["\n      (()            # 1: open paren\n      ([^)]*?)       # 2: raw params\n      ())            # 3: close paren\n      (s*)           # 4: space\n      (=(?:&gt;|>))   # 5: fat arrow\n    "], ["\n      (\\()            # 1: open paren\n      ([^\\)]*?)       # 2: raw params\n      (\\))            # 3: close paren\n      (\\s*)           # 4: space\n      (=(?:&gt;|>))   # 5: fat arrow\n    "]);

    _templateObject$2 = function _templateObject() {
      return data;
    };

    return data;
  }
  var balance$2 = balance,
      compact$3 = compact,
      wrap$4 = wrap$2,
      VerboseRegExp$3 = VerboseRegExp; // TODO:
  // * Generators

  var ESCAPES$1 = new Grammar({
    escape: {
      pattern: /\\./
    }
  });
  var REGEX_INTERNALS = new Grammar({
    escape: {
      pattern: /\\./
    },
    'exclude from group begin': {
      pattern: /(\\\()/,
      replacement: "#{1}"
    },
    'group-begin': {
      pattern: /(\()/,
      replacement: '<b class="group">#{1}'
    },
    'group-end': {
      pattern: /(\))/,
      replacement: '#{1}</b>'
    }
  });

  function handleParams(text, context) {
    return PARAMETERS$1.parse(text, context);
  }

  var INSIDE_TEMPLATE_STRINGS = new Grammar({
    'interpolation': {
      pattern: /(\$\{)(.*?)(\})/,
      replacement: "<span class='#{name}'><span class='punctuation'>#{1}</span><span class='interpolation-contents'>#{2}</span><span class='punctuation'>#{3}</span></span>",
      before: function before(r, context) {
        r[2] = MAIN$2.parse(r[2], context);
      }
    }
  }).extend(ESCAPES$1);
  var PARAMETERS$1 = new Grammar({
    'parameter parameter-with-default': {
      pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
      replacement: compact$3("\n      <span class=\"parameter\">\n        <span class=\"variable\">#{1}</span>\n        <span class=\"operator\">#{2}</span>\n      #{3}\n      </span>\n    "),
      before: function before(r, context) {
        r[3] = VALUES$2.parse(r[3], context);
      }
    },
    'keyword operator': {
      pattern: /\.{3}/
    },
    'variable parameter': {
      pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
    }
  });
  var STRINGS = new Grammar({
    'string string-template embedded': {
      pattern: /(`)([^`]*)(`)/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = INSIDE_TEMPLATE_STRINGS.parse(r[2], context);
      }
    },
    'string string-single-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-apostrophes and non-backslashes OR
      // * an even number of consecutive backslashes OR
      // * any backslash-plus-non-apostrophe pair.
      pattern: /(')((?:[^'\\]|\\\\|\\[^'])*)(')/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        // console.log('match:', r[2]);
        r[2] = ESCAPES$1.parse(r[2], context);
      }
    },
    'string string-double-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-quotes and non-backslashes OR
      // * an even number of consecutive backslashes OR
      // * any backslash-plus-non-quote pair.
      pattern: /(")((?:[^"\\]|\\\\|\\[^"])*)(")/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = ESCAPES$1.parse(r[2], context);
      }
    }
  });
  var VALUES$2 = new Grammar(_objectSpread2({
    constant: {
      pattern: /\b(?:arguments|this|false|true|super|null|undefined)\b/
    },
    'number number-binary-or-octal': {
      pattern: /0[bo]\d+/
    },
    number: {
      pattern: /(?:\d*\.?\d+)/
    }
  }, STRINGS.toObject(), {
    comment: {
      pattern: /(\/\/[^\n]*\n)|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
    },
    regexp: {
      // No such thing as an empty regex, so we can get away with requiring at
      // least one not-backslash character before the end delimiter.
      pattern: /(\/)(.*?[^\\])(\/)([mgiy]*)/,
      replacement: "<span class='regexp'>#{1}#{2}#{3}#{4}</span>",
      before: function before(r, context) {
        r[2] = REGEX_INTERNALS.parse(r[2], context);
        if (r[4]) r[4] = wrap$4(r[4], 'keyword regexp-flags');
      }
    }
  }));
  var DESTRUCTURING = new Grammar({
    alias: {
      pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
      replacement: "<span class='entity'>#{1}</span>#{2}#{3}#{4}"
    },
    variable: {
      pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
    }
  });
  var MAIN$2 = new Grammar('javascript', {}, {
    alias: ['js']
  });
  MAIN$2.extend(VALUES$2);
  MAIN$2.extend({
    'meta: digits in the middle of identifiers': {
      pattern: /\$\d/,
      replacement: "#{0}"
    },
    // So that properties with keyword names don't get treated like keywords.
    'meta: properties with keyword names': {
      pattern: /(\.)(for|if|while|switch|catch|return)\b/,
      replacement: "#{0}"
    },
    // So that keywords that are followed by `(` don't get treated like
    // functions.
    'meta: functions with keyword names': {
      pattern: /(\s*)\b(for|if|while|switch|catch)\b/,
      replacement: "#{1}<span class='keyword'>#{2}</span>"
    },
    'meta: fat arrow function, one arg, no parens': {
      pattern: /([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*)(=(?:&gt;|>))/,
      replacement: "#{1}#{2}#{3}",
      before: function before(r, context) {
        r[1] = handleParams(r[1], context);
      }
    },
    'meta: fat arrow function, args in parens': {
      pattern: VerboseRegExp$3(_templateObject$2()),
      replacement: "#{1}#{2}#{3}#{4}#{5}",
      before: function before(r, context) {
        r[2] = handleParams(r[2], context);
      }
    },
    'keyword keyword-new': {
      pattern: /new(?=\s[A-Za-z_$])/
    },
    'variable variable-declaration': {
      pattern: /\b(var|let|const)(\s+)([A-Za-z_$][_$A-Z0-9a-z]*?)(?=\s|=|;|,)/,
      replacement: "<span class='storage'>#{1}</span>#{2}<span class='#{name}'>#{3}</span>"
    },
    'variable variable-assignment': {
      pattern: /(\s+|,)([A-Za-z_$][\w\d$]*?)(\s*)(?==)/,
      replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}"
    },
    'meta: destructuring assignment': {
      pattern: /(let|var|const)(\s+)(\{|\[)([\s\S]*)(\}|\])(\s*)(?==)/,
      index: function index(matchText) {
        var pairs = {
          '{': '}',
          '[': ']'
        };
        var match = /(let|var|const|)(\s+)(\{|\[)/.exec(matchText);
        var char = match[3],
            paired = pairs[char];
        return balance$2(matchText, char, paired, {
          startIndex: matchText.indexOf(char) + 1
        });
      },
      replacement: "<span class='storage'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
      before: function before(r, context) {
        r[4] = DESTRUCTURING.parse(r[4], context);
      }
    },
    'function function-expression': {
      pattern: VerboseRegExp$3(_templateObject2$1()),
      replacement: "<span class='keyword keyword-function'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
      before: function before(r, context) {
        if (r[3]) r[3] = "<span class='entity'>".concat(r[3], "</span>");
        r[6] = handleParams(r[6], context);
        return r;
      }
    },
    'function function-literal-shorthand-style': {
      pattern: VerboseRegExp$3(_templateObject3$1()),
      replacement: "#{1}#{2}#{3}<span class='entity'>#{4}</span>#{5}#{6}#{7}#{8}#{9}#{10}",
      before: function before(r, context) {
        if (r[2]) r[2] = "<span class='storage'>".concat(r[1], "</span>");
        r[7] = handleParams(r[7], context);
      }
    },
    'function function-assigned-to-variable': {
      pattern: VerboseRegExp$3(_templateObject4$1()),
      replacement: "<span class='variable'>#{1}</span>#{2}#{3}#{4} <span class='keyword'>#{5}</span>#{6}#{7}#{8}#{9}",
      before: function before(r, context) {
        r[8] = handleParams(r[8], context);
      }
    },
    'meta: property then function': {
      pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(:)(\s*)(?=function)/,
      replacement: "<span class='entity'>#{1}</span>#{2}#{3}"
    },
    'entity': {
      pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(?=:)/
    },
    'meta: class definition': {
      pattern: VerboseRegExp$3(_templateObject5$1()),
      index: function index(match) {
        return balance$2(match, '}', '{', {
          startIndex: match.indexOf('{') + 1
        }); // return findBalancedToken('}', '{', match, match.indexOf('{') + 1);
      },
      replacement: compact$3("\n      <span class=\"storage\">#{1}</span>\n      #{2}#{3}\n      #{4}#{5}#{6}#{7}\n      #{8}#{9}\n    "),
      before: function before(r) {
        if (r[3]) r[3] = wrap$4(r[3], 'entity entity-class');
        if (r[5]) r[5] = wrap$4(r[5], 'storage');
        if (r[7]) r[7] = wrap$4(r[7], 'entity entity-class entity-superclass');
      }
    },
    storage: {
      pattern: /\b(?:var|let|const|class|extends|async)\b/
    },
    keyword: {
      pattern: /\b(?:try|catch|finally|if|else|do|while|for|break|continue|case|switch|default|return|yield|throw|await)\b/
    },
    'keyword operator': {
      pattern: /!==?|={1,3}|>=?|<=?|\+\+|\+|--|-|\*|[\*\+-\/]=|\?|\.{3}|\b(?:instanceof|in|of)\b/
    }
  });

  function _templateObject22() {
    var data = _taggedTemplateLiteral(["\n      (class)                # 1: storage\n      (?:                    # begin optional class name\n        (s+)                # 2: space\n        ([A-Z][A-Za-z0-9_]*) # 3: class name\n      )?                     # end optional class name\n      (?:                    # begin optional 'extends' keyword\n        (s+)                # 4: space\n        (extends)            # 5: storage\n        (s+)                # 6: space\n        ([A-Z][A-Za-z0-9_$.]*) # 7: superclass name\n      )?                     # end optional 'extends' keyword\n      (s*)                  # 8: space\n      ({)                    # 9: opening brace\n    "], ["\n      (class)                # 1: storage\n      (?:                    # begin optional class name\n        (\\s+)                # 2: space\n        ([A-Z][A-Za-z0-9_]*) # 3: class name\n      )?                     # end optional class name\n      (?:                    # begin optional 'extends' keyword\n        (\\s+)                # 4: space\n        (extends)            # 5: storage\n        (\\s+)                # 6: space\n        ([A-Z][A-Za-z0-9_$\\.]*) # 7: superclass name\n      )?                     # end optional 'extends' keyword\n      (\\s*)                  # 8: space\n      ({)                    # 9: opening brace\n    "]);

    _templateObject22 = function _templateObject22() {
      return data;
    };

    return data;
  }

  function _templateObject21() {
    var data = _taggedTemplateLiteral(["\n      \b\n      ([a-zA-Z_?.$]+w*) # variable name\n      (s*)\n      (=)\n      (s*)\n      (function)\n      (s*)\n      (()\n      (.*?)       # raw params\n      ())\n    "], ["\n      \\b\n      ([a-zA-Z_?\\.$]+\\w*) # variable name\n      (\\s*)\n      (=)\n      (\\s*)\n      (function)\n      (\\s*)\n      (\\()\n      (.*?)       # raw params\n      (\\))\n    "]);

    _templateObject21 = function _templateObject21() {
      return data;
    };

    return data;
  }

  function _templateObject20() {
    var data = _taggedTemplateLiteral(["\n      (]) # closing bracket signifying possible computed property name\n      (s*) # optional space\n      (() # open paren\n      (.*?) # raw params\n      ()) # close paren\n      (s*) # optional space\n      ({) # opening brace\n    "], ["\n      (]) # closing bracket signifying possible computed property name\n      (\\s*) # optional space\n      (\\() # open paren\n      (.*?) # raw params\n      (\\)) # close paren\n      (\\s*) # optional space\n      (\\{) # opening brace\n    "]);

    _templateObject20 = function _templateObject20() {
      return data;
    };

    return data;
  }

  function _templateObject19() {
    var data = _taggedTemplateLiteral(["\n      (^s*)\n      (get|set|static)? # 1: annotation\n      (s*)             # 2: space\n      ([a-zA-Z_$][a-zA-Z0-9$_]*) # 3: function name\n      (s*)             # 4: space\n      (()              # 5: open parenthesis\n      (.*?)             # 6: raw params\n      ())              # 7: close parenthesis\n      (s*)             # 8: space\n      ({)              # 9: opening brace\n    "], ["\n      (^\\s*)\n      (get|set|static)? # 1: annotation\n      (\\s*)             # 2: space\n      ([a-zA-Z_$][a-zA-Z0-9$_]*) # 3: function name\n      (\\s*)             # 4: space\n      (\\()              # 5: open parenthesis\n      (.*?)             # 6: raw params\n      (\\))              # 7: close parenthesis\n      (\\s*)             # 8: space\n      (\\{)              # 9: opening brace\n    "]);

    _templateObject19 = function _templateObject19() {
      return data;
    };

    return data;
  }

  function _templateObject18() {
    var data = _taggedTemplateLiteral(["\n      \b(function)\n      (s*)\n      ([a-zA-Z_$]w*)? # function name (optional)\n      (s*)\n      (()             # open parenthesis\n      (.*?)            # raw params\n      ())             # close parenthesis\n    "], ["\n      \\b(function)\n      (\\s*)\n      ([a-zA-Z_$]\\w*)? # function name (optional)\n      (\\s*)\n      (\\()             # open parenthesis\n      (.*?)            # raw params\n      (\\))             # close parenthesis\n    "]);

    _templateObject18 = function _templateObject18() {
      return data;
    };

    return data;
  }

  function _templateObject17() {
    var data = _taggedTemplateLiteral(["\n      (let|var|const) # storage\n      (s+) # mandatory space\n      ({|[) # opening brace or bracket\n      ([sS]*) # a bunch of stuff\n      (}|]) # closing brace or bracket\n      (s*)\n      (=) # followed by an equals sign\n    "], ["\n      (let|var|const) # storage\n      (\\s+) # mandatory space\n      (\\{|\\[) # opening brace or bracket\n      ([\\s\\S]*) # a bunch of stuff\n      (\\}|\\]) # closing brace or bracket\n      (\\s*)\n      (=) # followed by an equals sign\n    "]);

    _templateObject17 = function _templateObject17() {
      return data;
    };

    return data;
  }

  function _templateObject16() {
    var data = _taggedTemplateLiteral(["\n      (()            # 1: open paren\n      ([^)]*?)       # 2: raw params\n      ())            # 3: close paren\n      (s*)           # 4: space\n      (=(?:&gt;|>))   # 5: fat arrow\n    "], ["\n      (\\()            # 1: open paren\n      ([^\\)]*?)       # 2: raw params\n      (\\))            # 3: close paren\n      (\\s*)           # 4: space\n      (=(?:&gt;|>))   # 5: fat arrow\n    "]);

    _templateObject16 = function _templateObject16() {
      return data;
    };

    return data;
  }

  function _templateObject15() {
    var data = _taggedTemplateLiteral(["\n      ( # EITHER:\n        (? # optional opening paren\n        [^)] # contents of params\n        )? # optional closing paren\n        | # OR:\n       [a-zA-Z_$][a-zA-Z0-9_$]* # any single identifier\n      )\n      (s*) # optional space\n      (=(?:>|&gt;)) # arrow function operator!\n      (s*) # optional space\n    "], ["\n      ( # EITHER:\n        \\(? # optional opening paren\n        [^)] # contents of params\n        \\)? # optional closing paren\n        | # OR:\n       [a-zA-Z_$][a-zA-Z0-9_$]* # any single identifier\n      )\n      (\\s*) # optional space\n      (=(?:>|&gt;)) # arrow function operator!\n      (\\s*) # optional space\n    "]);

    _templateObject15 = function _templateObject15() {
      return data;
    };

    return data;
  }

  function _templateObject14() {
    var data = _taggedTemplateLiteral(["\n      ( # EITHER:\n        (? # optional opening paren\n        [^)] # contents of params\n        )? # optional closing paren\n        | # OR:\n       [a-zA-Z_$][a-zA-Z0-9_$]* # any single identifier\n      )\n      (s*) # optional space\n      (=(?:>|&gt;)) # arrow function operator!\n      (s*) # optional space\n      (() # opening paren\n      ([sS]*) # contents of function\n      ()) # closing paren\n    "], ["\n      ( # EITHER:\n        \\(? # optional opening paren\n        [^)] # contents of params\n        \\)? # optional closing paren\n        | # OR:\n       [a-zA-Z_$][a-zA-Z0-9_$]* # any single identifier\n      )\n      (\\s*) # optional space\n      (=(?:>|&gt;)) # arrow function operator!\n      (\\s*) # optional space\n      (\\() # opening paren\n      ([\\s\\S]*) # contents of function\n      (\\)) # closing paren\n    "]);

    _templateObject14 = function _templateObject14() {
      return data;
    };

    return data;
  }

  function _templateObject13() {
    var data = _taggedTemplateLiteral(["\n      ( # EITHER:\n        (? # optional opening paren\n        [^)] # contents of params\n        )? # optional closing paren\n        | # OR:\n       [a-zA-Z_$][a-zA-Z0-9_$]* # any single identifier\n      )\n      (s*) # optional space\n      (=(?:>|&gt;)) # arrow function operator!\n      (s*) # optional space\n      ({) # opening brace\n    "], ["\n      ( # EITHER:\n        \\(? # optional opening paren\n        [^)] # contents of params\n        \\)? # optional closing paren\n        | # OR:\n       [a-zA-Z_$][a-zA-Z0-9_$]* # any single identifier\n      )\n      (\\s*) # optional space\n      (=(?:>|&gt;)) # arrow function operator!\n      (\\s*) # optional space\n      (\\{) # opening brace\n    "]);

    _templateObject13 = function _templateObject13() {
      return data;
    };

    return data;
  }

  function _templateObject12() {
    var data = _taggedTemplateLiteral(["\n      (() # opening paren\n      ([^)]) # contents of params\n      ()) # closing paren\n    "], ["\n      (\\() # opening paren\n      ([^)]) # contents of params\n      (\\)) # closing paren\n    "]);

    _templateObject12 = function _templateObject12() {
      return data;
    };

    return data;
  }

  function _templateObject11$1() {
    var data = _taggedTemplateLiteral(["\n      (^s*)\n      (import)(s*)\n      (?=`|'|\")\n      (.*?)\n      (?=;|\n)\n    "], ["\n      (^\\s*)\n      (import)(\\s*)\n      (?=\\`|'|\")\n      (.*?)\n      (?=;|\\n)\n    "]);

    _templateObject11$1 = function _templateObject11() {
      return data;
    };

    return data;
  }

  function _templateObject10$1() {
    var data = _taggedTemplateLiteral(["\n      (^s*)\n      (import)(s*)\n      (.*?)(s*)\n      (from)(s*)\n      (.*?)\n      (?=;|\n) # ending with a newline or semicolon\n    "], ["\n      (^\\s*)\n      (import)(\\s*)\n      (.*?)(\\s*)\n      (from)(\\s*)\n      (.*?)\n      (?=;|\\n) # ending with a newline or semicolon\n    "]);

    _templateObject10$1 = function _templateObject10() {
      return data;
    };

    return data;
  }

  function _templateObject9$1() {
    var data = _taggedTemplateLiteral(["\n      (^s*)\n      (import)(s*)\n      (?={) # lookahead: opening brace\n      ([sS]*?)(s*)\n      (from)(s*)\n      (.*?)\n      (?=;|\n) # ending with a newline or semicolon\n    "], ["\n      (^\\s*)\n      (import)(\\s*)\n      (?=\\{) # lookahead: opening brace\n      ([\\s\\S]*?)(\\s*)\n      (from)(\\s*)\n      (.*?)\n      (?=;|\\n) # ending with a newline or semicolon\n    "]);

    _templateObject9$1 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8$1() {
    var data = _taggedTemplateLiteral(["\n      ({)(s*) # opening brace\n      ([^}]+) # stuff in the middle\n      (}) # closing brace\n    "], ["\n      (\\{)(\\s*) # opening brace\n      ([^}]+) # stuff in the middle\n      (}) # closing brace\n    "]);

    _templateObject8$1 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7$1() {
    var data = _taggedTemplateLiteral(["\n      ^(s*) # 1: optional space anchored to beginning of import\n      ([A-Za-z_$][A-Za-z_$0-9]*) # 2: identifier\n      (s*)\n      (?=,|$) # followed by comma or end of string\n    "], ["\n      ^(\\s*) # 1: optional space anchored to beginning of import\n      ([A-Za-z_$][A-Za-z_$0-9]*) # 2: identifier\n      (\\s*)\n      (?=,|$) # followed by comma or end of string\n    "]);

    _templateObject7$1 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6$1() {
    var data = _taggedTemplateLiteral(["\n      (^|,) # 1: beginning of string or comma\n      (s*) # 2: space\n      (default) # 3: \"default\"\n      (s*) # 4: space\n      (as) # 5: \"as\"\n      (s*) # 6: space\n      ([A-Za-z_$][A-Za-z_$0-9]*) # 7: identifier\n      (s*)\n      (?=$|,) # followed by end of string or comma\n    "], ["\n      (^|,) # 1: beginning of string or comma\n      (\\s*) # 2: space\n      (default) # 3: \"default\"\n      (\\s*) # 4: space\n      (as) # 5: \"as\"\n      (\\s*) # 6: space\n      ([A-Za-z_$][A-Za-z_$0-9]*) # 7: identifier\n      (\\s*)\n      (?=$|,) # followed by end of string or comma\n    "]);

    _templateObject6$1 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5$2() {
    var data = _taggedTemplateLiteral(["\n      (^|,)(s*) # 1: beginning of string or comma\n      ([A-Za-z_$][A-Za-z_$0-9]*) # 2: identifier\n      (s*)\n      (?=$|,) # followed by end of string or comma\n    "], ["\n      (^|,)(\\s*) # 1: beginning of string or comma\n      ([A-Za-z_$][A-Za-z_$0-9]*) # 2: identifier\n      (\\s*)\n      (?=$|,) # followed by end of string or comma\n    "]);

    _templateObject5$2 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4$2() {
    var data = _taggedTemplateLiteral(["\n      ((?:<|&lt;)/) # opening angle bracket and slash\n      ([a-zA-Z_$][a-zA-Z0-9_$.]*s*) # any valid identifier as a tag name\n      (&gt;|>) # closing angle bracket\n    "], ["\n      ((?:<|&lt;)\\/) # opening angle bracket and slash\n      ([a-zA-Z_$][a-zA-Z0-9_$\\.]*\\s*) # any valid identifier as a tag name\n      (&gt;|>) # closing angle bracket\n    "]);

    _templateObject4$2 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3$2() {
    var data = _taggedTemplateLiteral(["\n      (<|&lt;) # 1: opening angle bracket\n      ([a-zA-Z_$][a-zA-Z0-9_$.]*) # 2: any valid identifier as a tag name\n      (s+) # 3: space after the tag name\n      ([sS]*) # 4: middle-of-tag content (will be parsed later)\n      (.) # 5: the last character before the closing bracket\n      (&gt;|>)\n    "], ["\n      (<|&lt;) # 1: opening angle bracket\n      ([a-zA-Z_$][a-zA-Z0-9_$\\.]*) # 2: any valid identifier as a tag name\n      (\\s+) # 3: space after the tag name\n      ([\\s\\S]*) # 4: middle-of-tag content (will be parsed later)\n      (.) # 5: the last character before the closing bracket\n      (&gt;|>)\n    "]);

    _templateObject3$2 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2$2() {
    var data = _taggedTemplateLiteral(["\n      (<|&lt;) # 1: opening angle bracket\n      ([a-zA-Z_$][a-zA-Z0-9_$.]*) # 2: any valid identifier as a tag name\n      (&gt;|>) # 3: closing bracket\n    "], ["\n      (<|&lt;) # 1: opening angle bracket\n      ([a-zA-Z_$][a-zA-Z0-9_$\\.]*) # 2: any valid identifier as a tag name\n      (&gt;|>) # 3: closing bracket\n    "]);

    _templateObject2$2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject$3() {
    var data = _taggedTemplateLiteral(["\n      (<|&lt;) # opening angle bracket\n      ([a-zA-Z_$][a-zA-Z0-9_$.]*s*) # any valid identifier as a tag name\n      ([sS]*) # middle-of-tag content (will be parsed later)\n      (&gt;|>)\n    "], ["\n      (<|&lt;) # opening angle bracket\n      ([a-zA-Z_$][a-zA-Z0-9_$\\.]*\\s*) # any valid identifier as a tag name\n      ([\\s\\S]*) # middle-of-tag content (will be parsed later)\n      (&gt;|>)\n    "]);

    _templateObject$3 = function _templateObject() {
      return data;
    };

    return data;
  }
  var balance$3 = balance,
      balanceByLexer$2 = balanceByLexer,
      compact$4 = compact,
      wrap$5 = wrap$2,
      VerboseRegExp$4 = VerboseRegExp;
   // LEXERS
  // ======

  var LEXER_STRING$1 = new Lexer([{
    name: 'string-escape',
    pattern: /\\./
  }, {
    name: 'string-end',
    pattern: /('|")/,
    test: function test(pattern, text, context) {
      var char = context.get('string-begin');
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      if (match[1] !== char) {
        return false;
      }

      context.set('string-begin', null);
      return match;
    },
    final: true
  }], 'string');
  var LEXER_BALANCE_BRACES = new Lexer([{
    name: 'punctuation',
    pattern: /\{/,
    inside: {
      lexer: LEXER_BALANCE_BRACES
    }
  }, {
    name: 'punctuation',
    pattern: /\}/,
    final: true
  }], 'balance-braces');
  var LEXER_JSX_INTERPOLATION = new Lexer([{
    name: 'punctuation',
    pattern: /\{/,
    inside: {
      lexer: LEXER_BALANCE_BRACES
    }
  }, {
    name: 'interpolation-end',
    pattern: /\}/,
    final: true
  }], 'jsx-interpolation');
  var LEXER_ATTRIBUTE_VALUE$1 = new Lexer([{
    name: 'interpolation-begin',
    pattern: /^\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    },
    final: true
  }, {
    name: 'string-begin',
    pattern: /^\s*('|")/,
    test: function test(pattern, text, context) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      context.set('string-begin', match[1]);
      return match;
    },
    inside: {
      name: 'string',
      lexer: LEXER_STRING$1
    }
  }], 'attribute-value');
  var LEXER_ATTRIBUTE_SEPARATOR$1 = new Lexer([{
    name: "punctuation",
    pattern: /^=/,
    after: {
      name: 'attribute-value',
      lexer: LEXER_ATTRIBUTE_VALUE$1
    }
  }], 'attribute-separator');
  var LEXER_JSX_CLOSING_TAG = new Lexer([{
    name: 'tag tag-html',
    pattern: /^[a-z]+(?=&gt;|>)/
  }, {
    name: 'tag tag-jsx',
    pattern: /^[A-Z][A-Za-z0-9_$\.]*(?=&gt;|>)/
  }, {
    name: 'punctuation',
    pattern: /^\s*(?:>|&gt;)/,
    test: function test(pattern, text, context) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      var depth = context.get('jsx-tag-depth');

      if (depth < 1) {
        throw new Error("Depth error!");
      }

      depth--;
      context.set('jsx-tag-depth', depth); // console.warn(`[depth] Depth set to`, depth);
    },
    final: true
  }], 'jsx-closing-tag'); // Define the "inside" of a tag as the part after the name and before the
  // closing angle bracket.

  var LEXER_INSIDE_TAG = new Lexer([{
    name: 'punctuation',
    pattern: /^\s*\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    }
  }, {
    name: 'attribute-name',
    pattern: /^\s*[a-zA-Z][a-zA-Z0-9_$]+(?=\=)/,
    after: {
      name: 'attribute-separator',
      lexer: LEXER_ATTRIBUTE_SEPARATOR$1
    }
  }, {
    // Self-closing tag.
    name: 'punctuation',
    pattern: /^\s*\/(?:>|&gt;)/,
    test: function test(pattern, text, context) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      if (context.get('is-root')) {
        return false;
      }

      context.set('is-opening-tag', null); // Don't increment the tag depth.
    },
    final: function final(context) {
      return !context.get('is-root');
    }
  }, {
    // The end of a tag (opening or closing).
    name: 'punctuation',
    pattern: /^\s*(>|&gt;)/,
    test: function test(pattern, text, context) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      if (context.get('only-opening-tag')) {
        return false;
      }

      var wasOpeningTag = context.get('is-opening-tag');
      var depth = context.get('jsx-tag-depth');
      depth += wasOpeningTag ? 1 : -1; // This rule is designed to match situations where we're inside at least
      // one JSX tag, because in those cases we're still in JSX mode. So return
      // false if the new depth is now zero. The next rule will catch this.

      if (depth === 0) {
        return false;
      } // console.warn(`[depth] Depth is now`, depth);


      context.set('jsx-tag-depth', depth);
      context.set('is-opening-tag', null);
    },
    final: function final(context) {
      var depth = context.get('jsx-tag-depth');
      return context.get('only-opening-tag') || depth === 0;
    },
    skipSubRulesIfFinal: true,
    after: {
      name: 'jsx-contents',
      lexer: function lexer() {
        return LEXER_WITHIN_TAG;
      }
    }
  }], 'inside-tag');
  var LEXER_WITHIN_TAG = new Lexer([{
    include: function include() {
      return LEXER_TAG_START$1;
    }
  }, {
    include: function include() {
      return LEXER_TAG_END;
    }
  }, {
    name: 'punctuation',
    pattern: /\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    }
  }], 'within-tag');
  var LEXER_TAG_NAME = new Lexer([{
    name: 'tag tag-html',
    pattern: /^[a-z]+(?=\s|(?:>|&gt;))/,
    test: function test(pattern, text, context) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      context.set('is-opening-tag', true);
      var depth = context.get('jsx-tag-depth');

      if (typeof depth !== 'number') {
        // console.warn(`[depth] Depth set to`, 0);
        context.set('jsx-tag-depth', 0);
      }
    },
    after: {
      name: 'jsx-tag-contents',
      lexer: LEXER_INSIDE_TAG
    },
    final: function final(context) {
      return context.get('only-opening-tag');
    }
  }, {
    name: 'tag tag-jsx',
    pattern: /^[A-Z][A-Za-z0-9_$\.]*(?=\s|(?:>|&gt;))/,
    test: function test(pattern, text, context) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      context.set('is-opening-tag', true);
      var depth = context.get('jsx-tag-depth');

      if (typeof depth !== 'number') {
        // console.warn(`[depth] Depth set to`, 0);
        context.set('jsx-tag-depth', 0);
      }
    },
    after: {
      name: 'jsx-tag-contents',
      lexer: LEXER_INSIDE_TAG
    }
  }], 'tag-name');
  var LEXER_TAG_END = new Lexer([// The start of a closing tag. Final.
  {
    name: 'punctuation',
    pattern: /(?:<|&lt;)\/(?=[A-Za-z])/,
    test: function test(pattern, text, context) {
      var depth = context.get('jsx-tag-depth');
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }
    },
    inside: {
      name: 'element jsx-element',
      lexer: LEXER_JSX_CLOSING_TAG
    },
    final: true
  }], 'tag-end');
  var LEXER_TAG$1 = new Lexer([{
    name: 'punctuation',
    pattern: /^\s*\{/,
    inside: {
      name: 'interpolation',
      lexer: LEXER_JSX_INTERPOLATION
    }
  }, {
    include: function include() {
      return LEXER_TAG_END;
    }
  }, // The start of an opening tag.
  {
    name: 'punctuation punctuation-wtf',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    after: {
      name: 'tag',
      lexer: function lexer() {
        return LEXER_TAG_NAME;
      }
    }
  }], 'tag');
  var LEXER_TAG_START$1 = new Lexer([{
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    after: {
      name: 'tag',
      lexer: LEXER_TAG_NAME
    }
  }], 'tag-start');
  var LEXER_TAG_OPEN_START = new Lexer([{
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    test: function test(pattern, text, context) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      context.set('only-opening-tag', true);
    },
    after: {
      name: 'tag',
      lexer: LEXER_TAG_NAME
    },
    final: true
  }], 'tag-open-start');
  var LEXER_TAG_ROOT = new Lexer([{
    name: 'punctuation',
    pattern: /^\s*(?:<|&lt;)(?!\/)/,
    test: function test(pattern, text, context) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      context.set('is-root', true);
    },
    after: {
      name: 'tag',
      lexer: LEXER_TAG_NAME
    }
  }], 'tag-root'); // TODO:
  // * Generators

  var ESCAPES$2 = new Grammar({
    escape: {
      pattern: /\\./
    }
  });
  var REGEX_INTERNALS$1 = new Grammar({
    escape: {
      pattern: /\\./
    },
    'exclude from group begin': {
      pattern: /(\\\()/,
      replacement: "#{1}"
    },
    'group-begin': {
      pattern: /(\()/,
      replacement: '<b class="group">#{1}'
    },
    'group-end': {
      pattern: /(\))/,
      replacement: '#{1}</b>'
    }
  });
  var INSIDE_TEMPLATE_STRINGS$1 = new Grammar({
    'interpolation': {
      pattern: /(\$\{)(.*?)(\})/,
      // replacement: "<span class='#{name}'><span class='punctuation interpolation-start'>#{1}</span><span class='interpolation-contents'>#{2}</span><span class='punctuation interpolation-end'>#{3}</span></span>",
      captures: {
        '1': 'punctuation interpolation-start',
        '2': MAIN$3,
        '3': 'punctuation interpolation-end'
      },
      wrapReplacement: true // before: (r, context) => {
      //   r[2] = MAIN.parse(r[2], context);
      // }

    }
  }).extend(ESCAPES$2);
  var PARAMETERS$2 = new Grammar({
    'parameter parameter-with-default': {
      pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*=\s*)(.*?)(?=,|\)|\n|$)/,
      // replacement: compact(`
      //   <span class="parameter">#{1}#{2}#{3}</span>
      // `),
      captures: {
        '1': 'variable',
        '2': 'operator',
        '3': function _() {
          return VALUES$3;
        }
      }
    },
    'keyword operator': {
      pattern: /\.{3}/
    },
    'variable parameter': {
      pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
    }
  });
  var STRINGS$1 = new Grammar({
    'string string-template embedded': {
      pattern: /(`)((?:[^`\\]|\\\\|\\.)*)(`)/,
      captures: {
        '2': INSIDE_TEMPLATE_STRINGS$1
      },
      wrapReplacement: true
    },
    'string string-single-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-apostrophes and non-backslashes OR
      // * an even number of consecutive backslashes OR
      // * any backslash-plus-character pair.
      pattern: /(')((?:[^'\\]|\\\\|\\.)*)(')/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      captures: {
        '2': ESCAPES$2
      } // wrapReplacement: true,
      // before: (r, context) => {
      //   console.log('uhhh:', r);
      //   r[2] = ESCAPES.parse(r[2], context);
      // }

    },
    'string string-double-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-quotes and non-backslashes OR
      // * an even number of consecutive backslashes OR
      // * any backslash-plus-non-quote pair.
      pattern: /(")((?:[^"\\]|\\\\|\\[^"])*)(")/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      // captures: {
      //   '2': ESCAPES
      // },
      // wrapReplacement: true,
      before: function before(r, context) {
        r[2] = ESCAPES$2.parse(r[2], context);
      }
    }
  });
  var JSX_INTERPOLATION = new Grammar({
    'embedded jsx-interpolation': {
      pattern: /(\{)([\s\S]*)(\})/,
      index: function index(match) {
        return balance$3(match, '}', '{');
      },
      // replacement: compact(`
      //   <span class='#{name}'>
      //     <span class='punctuation embedded-start'>#{1}</span>
      //     #{2}
      //     <span class='punctuation embedded-end'>#{3}</span>
      //   </span>
      // `),
      captures: {
        '1': 'punctuation embedded-start',
        '2': function _() {
          return JSX_EXPRESSIONS;
        },
        '3': 'punctuation embedded-end'
      },
      wrapReplacement: true // before (r, context) {
      //   r[2] = JSX_EXPRESSIONS.parse(r[2], context);
      //   // r[2] = context.highlighter.parse(r[2], 'javascript-jsx', context);
      //   console.log('[ic] parsed:', r[2]);
      // }

    }
  });
  var JSX_ATTRIBUTES = new Grammar({
    string: {
      pattern: /('[^']*[^\\]'|"[^"]*[^\\]")/
    },
    attribute: {
      pattern: /\b([a-zA-Z-:]+)(=)/,
      replacement: compact$4("\n      <span class='attribute'>\n        <span class='#{name}'>#{1}</span>\n        <span class='punctuation'>#{2}</span>\n      </span>\n    ")
    }
  }).extend(JSX_INTERPOLATION);
  var JSX_TAG_CONTENTS = new Grammar({});
  JSX_TAG_CONTENTS.extend(JSX_ATTRIBUTES);
  JSX_TAG_CONTENTS.extend(JSX_INTERPOLATION);
  JSX_TAG_CONTENTS.extend({
    'punctuation punctuation-tag-close': {
      pattern: />|\/>/
    }
  });
  var JSX_TAG_ROOT = new Grammar({
    'jsx': {
      // This one is tricky. Most of the lexer machinery above is dedicated to
      // finding the balanced end to a JSX tag. That merely tells us _how much_
      // of the string we need to highlight. Then we invoke the JSX_CONTENTS
      // grammar to parse that substring.
      pattern: VerboseRegExp$4(_templateObject$3()),
      index: function index(text) {
        return balanceByLexer$2(text, LEXER_TAG_ROOT);
      },
      replacement: compact$4("\n      <span class='jsx'>#{0}</span>\n    "),
      before: function before(m) {
        m[0] = JSX_CONTENTS.parse(m[0]);
      }
    }
  });

  function handleJsxOrHtmlTag(tagName) {
    if (tagName.match(/^[A-Z]/)) {
      return wrap$5(tagName, 'tag tag-jsx');
    } else {
      return wrap$5(tagName, 'tag tag-html');
    }
  }

  var JSX_TAGS = new Grammar({
    'opening tag without attributes': {
      pattern: VerboseRegExp$4(_templateObject2$2()),
      replacement: compact$4("\n      <span class='jsx-element element element-opening'>\n        <span class='punctuation'>#{1}</span>\n        #{2}\n        <span class='punctuation'>#{3}</span>\n      </span>\n    "),
      before: function before(r, context) {
        r[2] = handleJsxOrHtmlTag(r[2]);
      }
    },
    'tag tag-open': {
      pattern: VerboseRegExp$4(_templateObject3$2()),
      replacement: compact$4("\n      <span class='#{name}'>\n        <span class='punctuation'>#{1}</span>\n        #{2}#{3}#{4}#{5}\n        <span class='punctuation'>#{6}</span>\n      </span>\n    "),
      index: function index(text) {
        var index = balanceByLexer$2(text, LEXER_TAG_OPEN_START);
        return index;
      },
      before: function before(r, context) {
        r.name = "jsx-element element element-opening"; // We grab the last character before the closing angle bracket because an
        // optional match won't work correctly after the greedy content match. If
        // that last character is a slash, we keep it as a separate token;
        // otherwise, we move it back to the end of capture group 4.

        r[2] = handleJsxOrHtmlTag(r[2]);

        if (r[5]) {
          if (r[5] === '/') {
            r.name = r.name.replace('element-opening', 'element-self');
            r[5] = wrap$5(r[5], 'punctuation');
          } else {
            r[4] += r[5];
            r[5] = '';
          }
        }

        r[4] = JSX_ATTRIBUTES.parse(r[4], context);
      }
    },
    'tag tag-close': {
      pattern: VerboseRegExp$4(_templateObject4$2()),
      replacement: compact$4("\n      <span class='jsx-element element element-closing'>\n        <span class='punctuation'>#{1}</span>\n        <span class='tag'>#{2}</span>\n        <span class='punctuation'>#{3}</span>\n      </span>\n    ")
    }
  });
  var JSX_CONTENTS = new Grammar({}).extend(JSX_INTERPOLATION, JSX_TAGS);
  var VALUES$3 = new Grammar({});
  VALUES$3.extend({
    constant: {
      pattern: /\b(?:arguments|this|false|true|super|null|undefined)\b/
    },
    'number number-binary-or-octal': {
      pattern: /0[bo]\d+/
    },
    number: {
      pattern: /(?:\d*\.?\d+)/
    }
  });
  VALUES$3.extend(STRINGS$1);
  VALUES$3.extend({
    comment: {
      pattern: /(\/\/[^\n]*\n)|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
    },
    regexp: {
      // No such thing as an empty regex, so we can get away with requiring at
      // least one not-backslash character before the end delimiter.
      pattern: /(\/)(.*?[^\\])(\/)([mgiy]*)/,
      // replacement: "<span class='regexp'>#{1}#{2}#{3}#{4}</span>",
      captures: {
        '2': REGEX_INTERNALS$1,
        '4': 'keyword regexp-flags'
      },
      wrapReplacement: true // before: (r, context) => {
      //   r[2] = REGEX_INTERNALS.parse(r[2], context);
      //   if (r[4]) r[4] = wrap(r[4], 'keyword regexp-flags');
      // }

    }
  });
  var DESTRUCTURING$1 = new Grammar({
    alias: {
      pattern: /([A-Za-z$_][$_A-Za-z0-9_]*)(\s*)(:)(\s*)(?=\w|\{|\[)/,
      // replacement: "<span class='entity'>#{1}</span>#{2}#{3}#{4}",
      captures: {
        '1': 'entity'
      }
    },
    variable: {
      pattern: /[A-Za-z$_][$_A-Za-z0-9_]*/
    }
  });
  var IMPORT_SPECIFIERS = new Grammar({
    ordinary: {
      pattern: VerboseRegExp$4(_templateObject5$2()),
      // replacement: compact(`
      //   #{1}#{2}
      //   <span class='variable variable-import'>#{3}</span>
      // `),
      captures: {
        '1': 'punctuation',
        '3': 'variable variable-import'
      }
    },
    'default as': {
      pattern: VerboseRegExp$4(_templateObject6$1()),
      captures: {
        '1': 'punctuation',
        '3': 'keyword keyword-default',
        '5': 'keyword keyword-as',
        '7': 'variable variable-import' // replacement: compact(`
        //   #{1}
        //   <span class='keyword keyword-default'>#{2}</span>#{3}
        //   <span class='keyword keyword-as'>#{4}</span>#{5}
        //   <span class='variable variable-import'>#{6}</span>#{7}
        // `)

      }
    }
  });
  var IMPORT_SPECIFIER = new Grammar({
    'implicit default specifier': {
      pattern: VerboseRegExp$4(_templateObject7$1()),
      captures: {
        '2': 'variable variable-import' // replacement: compact(`
        //   #{1}<span class='variable variable-import'>#{2}</span>#{3}
        // `)

      }
    },
    specifiers: {
      pattern: VerboseRegExp$4(_templateObject8$1()),
      // replacement: "#{1}#{2}#{3}#{4}",
      captures: {
        '3': IMPORT_SPECIFIERS // before (r, context) {
        //   r[3] = IMPORT_SPECIFIERS.parse(r[3], context);
        // }

      }
    }
  });
  var IMPORTS = new Grammar({
    'import with destructuring': {
      pattern: VerboseRegExp$4(_templateObject9$1()),
      captures: {
        '2': 'keyword keyword-import',
        '4': IMPORT_SPECIFIER,
        '6': 'keyword keyword-from',
        '8': STRINGS$1
      }
    },
    'import with source': {
      pattern: VerboseRegExp$4(_templateObject10$1()),
      captures: {
        '2': 'keyword keyword-import',
        '4': function _() {
          return IMPORT_SPECIFIER;
        },
        '6': 'keyword keyword-from',
        '8': function _() {
          return STRINGS$1;
        }
      }
    },
    'import without source': {
      pattern: VerboseRegExp$4(_templateObject11$1()),
      captures: {
        '2': 'keyword keyword-import',
        '4': function _() {
          return STRINGS$1;
        }
      },
      replacement: compact$4("#{1}#{2}#{3}#{4}")
    }
  });
  var OPERATORS = new Grammar({
    'keyword operator': {
      pattern: /\|\||&&|&amp;&amp;|!==?|={1,3}|>=?|<=?|\+\+|\+|--|-|\*|[\*\+-\/]=|\?|\.{3}|\b(?:instanceof|in|of)\b/
    }
  });
  var ARROW_FUNCTION_PARAMETERS = new Grammar({
    'params within parens': {
      pattern: VerboseRegExp$4(_templateObject12()),
      replacement: compact$4("\n      <span class='params'>\n        <span class=\"punctuation\">#{1}</span>\n        #{2}\n        <span class=\"punctuation\">#{3}</span>\n      </span>\n    "),
      before: function before(m, context) {
        m[2] = PARAMETERS$2.parse(m[2], context);
      }
    },
    'variable variable-parameter': {
      pattern: /[a-zA-Z_$][a-zA-Z0-9_$]*/
    }
  });
  var ARROW_FUNCTIONS = new Grammar({
    'multiline arrow function': {
      pattern: VerboseRegExp$4(_templateObject13()),
      index: function index(text) {
        return balance$3(text, '}', '{');
      },
      before: function before(m, context) {
        m[1] = ARROW_FUNCTION_PARAMETERS.parse(m[1], context);
        m[1] = wrap$5(m[1], 'temp');
      },
      replacement: compact$4("\n      <span class=\"function function-arrow\">\n        #{1}\n        #{2}\n        <span class=\"operator\">#{3}</span>\n        #{4}\n        <span class=\"punctuation\">#{5}</span>\n      </span>\n    ")
    },
    'multiline arrow function wrapped in parens': {
      pattern: VerboseRegExp$4(_templateObject14()),
      index: function index(text) {
        return balance$3(text, ')', '(');
      },
      before: function before(m, context) {
        m[1] = ARROW_FUNCTION_PARAMETERS.parse(m[1], context);
        m[6] = MAIN$3.parse(m[6]);
      },
      replacement: compact$4("\n      <span class=\"function function-arrow\">\n        #{1}\n        #{2}\n        <span class=\"operator\">#{3}</span>\n        #{4}\n        <span class=\"punctuation\">#{5}</span>\n        #{6}\n        <span class=\"punctuation\">#{7}</span>\n      </span>\n    ")
    },
    'single line arrow function': {
      pattern: VerboseRegExp$4(_templateObject15()),
      before: function before(m, context) {
        m[1] = ARROW_FUNCTION_PARAMETERS.parse(m[1], context);
      },
      replacement: compact$4("\n      <span class=\"function function-arrow\">\n        #{1}\n        #{2}\n        <span class=\"operator\">#{3}</span>\n        #{4}\n      </span>\n    ")
    }
  });
  var JSX_EXPRESSIONS = new Grammar({});
  JSX_EXPRESSIONS.extend(JSX_TAGS);
  JSX_EXPRESSIONS.extend(VALUES$3);
  JSX_EXPRESSIONS.extend(ARROW_FUNCTIONS);
  JSX_EXPRESSIONS.extend(OPERATORS);
  var MAIN$3 = new Grammar('javascript-jsx', {}, {
    alias: ['react']
  });
  MAIN$3.extend(JSX_TAG_ROOT);
  MAIN$3.extend(IMPORTS);
  MAIN$3.extend(VALUES$3);
  MAIN$3.extend({
    'meta: digits in the middle of identifiers': {
      pattern: /\$\d/,
      replacement: "#{0}"
    },
    // So that properties with keyword names don't get treated like keywords.
    'meta: properties with keyword names': {
      pattern: /(\.)(for|if|while|switch|catch|return)\b/,
      replacement: "#{0}"
    },
    // So that keywords that are followed by `(` don't get treated like
    // functions.
    'meta: functions with keyword names': {
      pattern: /(\s*)\b(for|if|while|switch|catch)\b/,
      replacement: "#{1}<span class='keyword'>#{2}</span>"
    },
    'meta: fat arrow function, one arg, no parens': {
      pattern: /([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*)(=(?:&gt;|>))/,
      replacement: "#{1}#{2}#{3}",
      before: function before(r, context) {
        r[1] = PARAMETERS$2.parse(r[1], context);
        r[3] = wrap$5(r[3], 'keyword operator');
      }
    },
    'meta: fat arrow function, args in parens': {
      pattern: VerboseRegExp$4(_templateObject16()),
      replacement: "#{1}#{2}#{3}#{4}#{5}",
      before: function before(r, context) {
        r[2] = PARAMETERS$2.parse(r[2], context);
      }
    },
    'keyword keyword-new': {
      pattern: /new(?=\s[A-Za-z_$])/
    },
    'variable variable-declaration': {
      pattern: /\b(var|let|const)(\s+)([A-Za-z_$][_$A-Z0-9a-z]*?)(?=\s|=|;|,)/,
      replacement: "<span class='storage'>#{1}</span>#{2}<span class='#{name}'>#{3}</span>"
    },
    'variable variable-assignment': {
      pattern: /(\s+|,)([A-Za-z_$][\w\d$]*?)(\s*)(?==)(?!=(?:>|&gt;))/,
      replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}"
    },
    'meta: destructuring assignment': {
      pattern: VerboseRegExp$4(_templateObject17()),
      index: function index(text) {
        var pairs = {
          '{': '}',
          '[': ']'
        };
        var match = /(let|var|const|)(\s+)(\{|\[)/.exec(text);
        var char = match[3],
            paired = pairs[char];
        var index = balance$3(text, paired, char); // Once we've balanced braces, find the next equals sign.

        var equals = text.indexOf('=', index);
        var subset = text.slice(0, equals + 1);
        return equals;
      },
      replacement: "<span class='storage'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
      before: function before(r, context) {
        r[4] = DESTRUCTURING$1.parse(r[4], context);
        r[7] = wrap$5(r[7], 'operator');
      }
    },
    'function function-expression': {
      pattern: VerboseRegExp$4(_templateObject18()),
      replacement: "<span class='keyword keyword-function'>#{1}</span>#{2}#{3}#{4}#{5}#{6}#{7}",
      before: function before(r, context) {
        if (r[3]) r[3] = wrap$5(r[3], 'entity');
        r[6] = PARAMETERS$2.parse(r[6], context);
        return r;
      }
    },
    'function function-literal-shorthand-style': {
      pattern: VerboseRegExp$4(_templateObject19()),
      captures: {
        '2': 'storage',
        '4': 'entity',
        '7': PARAMETERS$2
      }
    },
    'meta: function shorthand with computed property name': {
      pattern: VerboseRegExp$4(_templateObject20()),
      replacement: compact$4("\n      #{1}#{2}#{3}#{4}#{5}#{6}#{7}\n    "),
      captures: {
        '3': 'punctuation',
        '4': PARAMETERS$2,
        '5': 'punctuation',
        '7': 'punctuation'
      }
    },
    'function function-assigned-to-variable': {
      pattern: VerboseRegExp$4(_templateObject21()),
      replacement: "#{1}#{2}#{3}#{4}#{5}#{6}#{7}#{8}#{9}",
      captures: {
        '1': 'variable',
        '5': 'keyword',
        '8': PARAMETERS$2
      }
    },
    'meta: property then function': {
      pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(:)(\s*)(?=function)/,
      captures: {
        '1': 'entity',
        '2': 'punctuation'
      }
    },
    'entity': {
      pattern: /([A-Za-z_$][A-Za-z0-9_$]*)(?=:)/
    },
    'meta: class definition': {
      pattern: VerboseRegExp$4(_templateObject22()),
      index: function index(match) {
        return balance$3(match, '}', '{', {
          startIndex: match.indexOf('{') + 1
        });
      },
      replacement: compact$4("\n      <span class=\"storage\">#{1}</span>\n      #{2}#{3}\n      #{4}#{5}#{6}#{7}\n      #{8}#{9}\n    "),
      captures: {
        '1': 'storage',
        '3': 'entity entity-class',
        '5': 'storage',
        '7': 'entity entity-class entity-superclass' // before (r) => {
        //   if (r[3]) r[3] = wrap(r[3], 'entity entity-class');
        //   if (r[5]) r[5] = wrap(r[5], 'storage');
        //   if (r[7]) r[7] = wrap(r[7], 'entity entity-class entity-superclass');
        // }

      }
    },
    storage: {
      pattern: /\b(?:var|let|const|class|extends|async)\b/
    },
    keyword: {
      pattern: /\b(?:try|catch|finally|if|else|do|while|for|break|continue|case|switch|default|return|yield|throw|await)\b/
    }
  }).extend(OPERATORS);

  function _templateObject3$3() {
    var data = _taggedTemplateLiteral(["\n      ([A-Za-z0-9_!?]+)  # 1: method name\n      (s*)              # 2: optional space\n      ((s*)            # 3: opening paren plus optional space\n      ([sS]*)          # 4: inside parens (greedy)\n      (s*))            # 5: closing paren\n    "], ["\n      ([A-Za-z0-9_!?]+)  # 1: method name\n      (\\s*)              # 2: optional space\n      (\\(\\s*)            # 3: opening paren plus optional space\n      ([\\s\\S]*)          # 4: inside parens (greedy)\n      (\\s*\\))            # 5: closing paren\n    "]);

    _templateObject3$3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2$3() {
    var data = _taggedTemplateLiteral(["\n      (def)             # 1: keyword\n      (s+)             # 2: space\n      ([A-Za-z0-9_!?]+) # 3: method name\n      (s*)             # 4: space\n      (()              # 5: open paren\n      (.*?)?            # 6: parameters (optional)\n      ())              # 7: close paren\n    "], ["\n      (def)             # 1: keyword\n      (\\s+)             # 2: space\n      ([A-Za-z0-9_!?]+) # 3: method name\n      (\\s*)             # 4: space\n      (\\()              # 5: open paren\n      (.*?)?            # 6: parameters (optional)\n      (\\))              # 7: close paren\n    "]);

    _templateObject2$3 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject$4() {
    var data = _taggedTemplateLiteral(["\n    \b\n    (?:if|else|elif|print|class|pass|from|import|raise|while|\n      try|finally|except|return|global|nonlocal|for|in|del|with)\n    \b\n    "], ["\n    \\b\n    (?:if|else|elif|print|class|pass|from|import|raise|while|\n      try|finally|except|return|global|nonlocal|for|in|del|with)\n    \\b\n    "]);

    _templateObject$4 = function _templateObject() {
      return data;
    };

    return data;
  }
  var balance$4 = balance,
      wrap$6 = wrap$2,
      compact$5 = compact,
      VerboseRegExp$5 = VerboseRegExp;
  var STRINGS$2 = new Grammar({
    interpolation: {
      pattern: /\{(\d*)\}/
    },
    'escape escape-hex': {
      pattern: /\\x[0-9a-fA-F]{2}/
    },
    'escape escape-octal': {
      pattern: /\\[0-7]{3}/
    },
    escape: {
      pattern: /\\./
    }
  });
  var VALUES$4 = new Grammar({
    'lambda': {
      pattern: /(lambda)(\s+)(.*?)(:)/,
      replacement: "<span class='keyword storage'>#{1}</span>#{2}#{3}#{4}",
      before: function before(r, context) {
        r[3] = PARAMETERS_WITHOUT_DEFAULT.parse(r[3], context);
      }
    },
    'string string-triple-quoted': {
      pattern: /"""[\s\S]*?"""/,
      before: function before(r, context) {
        r[0] = STRINGS$2.parse(r[0], context);
      }
    },
    'string string-raw string-single-quoted': {
      pattern: /([urb]+)(')(.*?[^\\]|[^\\]*)(')/,
      replacement: "<span class='storage string'>#{1}</span><span class='#{name}'>#{2}#{3}#{4}</span>",
      before: function before(r, context) {
        r[3] = STRINGS$2.parse(r[3], context);
      }
    },
    'string string-single-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-apostrophes and non-backslashes OR
      // * a backslash plus exactly one of any character (including backslashes)
      pattern: /([ub])?(')((?:[^'\\]|\\.)*)(')/,
      replacement: "#{1}<span class='#{name}'>#{2}#{3}#{4}</span>",
      before: function before(r, context) {
        if (r[1]) {
          r[1] = wrap$6(r[1], 'storage string');
        }

        r[3] = STRINGS$2.parse(r[3], context);
      }
    },
    'string string-double-quoted': {
      // In capture group 2 we want zero or more of:
      // * any non-quotes and non-backslashes OR
      // * a backslash plus exactly one of any character (including backslashes)
      pattern: /([ub])?(")((?:[^"\\]|\\.)*)(")/,
      replacement: "#{1}<span class='#{name}'>#{2}#{3}#{4}</span>",
      before: function before(r, context) {
        if (r[1]) {
          r[1] = wrap$6(r[1], 'storage string');
        }

        r[3] = STRINGS$2.parse(r[3], context);
      }
    },
    constant: {
      pattern: /\b(self|None|True|False)\b/
    },
    // Initial declaration of a constant.
    'constant constant-assignment': {
      pattern: /^([A-Z][A-Za-z\d_]*)(\s*)(?=\=)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}"
    },
    // Usage of a constant after assignment.
    'constant constant-named': {
      pattern: /\b([A-Z_]+)(?!\.)\b/,
      replacement: "<span class='#{name}'>#{1}</span>"
    },
    'variable variable-assignment': {
      pattern: /([a-z_][[A-Za-z\d_]*)(\s*)(?=\=)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}"
    },
    number: {
      pattern: /(\b|-)((0(x|X)[0-9a-fA-F]+)|([0-9]+(\.[0-9]+)?))\b/
    },
    'number number-binary': {
      pattern: /0b[01]+/
    },
    'number number-octal': {
      pattern: /0o[0-7]+/
    }
  });
  var ARGUMENTS = new Grammar({
    'meta: parameter with default': {
      pattern: /(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*?)(?=,|$)/,
      replacement: "#{1}<span class='variable parameter'>#{2}</span><span class='keyword punctuation'>#{3}</span>#{4}",
      before: function before(r, context) {
        r[4] = VALUES$4.parse(r[4], context);
      }
    }
  }).extend(VALUES$4);
  var PARAMETERS_WITHOUT_DEFAULT = new Grammar({
    'variable parameter': {
      pattern: /(\s*)(\*\*?)?([A-Za-z0-9_]+)(?=,|$)/,
      replacement: "#{1}#{2}<span class='#{name}'>#{3}</span>",
      before: function before(r) {
        if (r[2]) {
          r[2] = wrap$6(r[2], 'keyword operator');
        }
      }
    }
  });
  var PARAMETERS$3 = new Grammar({
    'meta: parameter with default': {
      pattern: /(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*?)(?=,|$)/,
      replacement: "#{1}<span class='variable parameter'>#{2}</span><span class='keyword punctuation'>#{3}</span>#{4}",
      before: function before(r, context) {
        r[4] = VALUES$4.parse(r[4], context);
      }
    }
  }).extend(PARAMETERS_WITHOUT_DEFAULT);
  var MAIN$4 = new Grammar('python', {
    'storage storage-type support': {
      pattern: /(int|float|bool|chr|str|bytes|list|dict|set)(?=\()/
    },
    'support support-builtin': {
      pattern: /(repr|round|print|input|len|min|max|sum|sorted|enumerate|zip|all|any|open)(?=\()/
    },
    'meta: from/import/as': {
      pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(\s+)(as)(\s+)(.*?)(?=\n|$)/,
      replacement: compact$5("\n      <span class='keyword'>#{1}</span>#{2}\n      #{3}#{4}\n      <span class='keyword'>#{5}</span>#{6}\n      #{7}#{8}\n      <span class='keyword'>#{9}</span>#{10}#{11}\n    ")
    },
    'meta: from/import': {
      pattern: /(from)(\s+)(.*?)(\s+)(import)(\s+)(.*?)(?=\n|$)/,
      replacement: compact$5("\n      <span class='keyword'>#{1}</span>#{2}\n      #{3}#{4}\n      <span class='keyword'>#{5}</span>#{6}#{7}\n    ")
    },
    'meta: subclass': {
      pattern: /(class)(\s+)([\w\d_]+)\(([\w\d_]*)\):/,
      replacement: compact$5("\n      <span class='keyword'>#{1}</span>#{2}\n      <span class='entity entity-class'>#{3}</span>\n      (<span class='entity entity-class entity-superclass'>#{4}</span>) :\n    ")
    },
    'meta: class': {
      pattern: /(class)(\s+)([\w\d_]+):/,
      replacement: "<span class='keyword'>#{1}</span>#{2}<span class='entity entity-class class'>#{3}</span>:"
    },
    comment: {
      pattern: /#[^\n]*(?=\n)/
    },
    keyword: {
      pattern: VerboseRegExp$5(_templateObject$4())
    },
    'meta: method definition': {
      pattern: VerboseRegExp$5(_templateObject2$3()),
      replacement: compact$5("\n      <span class='keyword'>#{1}</span>#{2}\n      <span class='entity'>#{3}</span>#{4}\n      #{5}#{6}#{7}\n    "),
      before: function before(r, context) {
        if (r[6]) {
          r[6] = PARAMETERS$3.parse(r[6], context);
        }
      }
    },
    'meta: method invocation': {
      pattern: VerboseRegExp$5(_templateObject3$3()),
      index: function index(text) {
        return balance$4(text, ')', '(', text.indexOf('('));
      },
      replacement: "#{1}#{2}#{3}#{4}#{5}",
      before: function before(r, context) {
        if (r[4]) {
          r[4] = ARGUMENTS.parse(r[4], context);
        }
      }
    },
    'keyword operator operator-logical': {
      pattern: /\b(and|or|not)\b/
    },
    'keyword operator operator-bitwise': {
      pattern: /(?:&|\||~|\^|>>|<<)/
    },
    'keyword operator operator-assignment': {
      pattern: /=/
    },
    'keyword operator operator-comparison': {
      pattern: /(?:>=|<=|!=|==|>|<)/
    },
    'keyword operator operator-arithmetic': {
      pattern: /(?:\+=|\-=|=|\+|\-|%|\/\/|\/|\*\*|\*)/
    }
  });
  MAIN$4.extend(VALUES$4);

  function _templateObject2$4() {
    var data = _taggedTemplateLiteral(["\n      (class)               # keyword\n      (s+)\n      ([A-Z][A-Za-z0-9_]*)  # class name\n      (s*(?:<|&lt;)s*)    # inheritance symbol, encoded or not\n      ([A-Z][A-Za-z0-9:_]*) # superclass\n    "], ["\n      (class)               # keyword\n      (\\s+)\n      ([A-Z][A-Za-z0-9_]*)  # class name\n      (\\s*(?:<|&lt;)\\s*)    # inheritance symbol, encoded or not\n      ([A-Z][A-Za-z0-9:_]*) # superclass\n    "]);

    _templateObject2$4 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject$5() {
    var data = _taggedTemplateLiteral(["\n      (do)         # keyword\n      (s*)\n      (|)         # opening pipe\n      ([^|]*?)     # params\n      (|)         # closing pipe\n    "], ["\n      (do)         # keyword\n      (\\s*)\n      (\\|)         # opening pipe\n      ([^|]*?)     # params\n      (\\|)         # closing pipe\n    "]);

    _templateObject$5 = function _templateObject() {
      return data;
    };

    return data;
  }
  var balance$5 = balance,
      compact$6 = compact,
      VerboseRegExp$6 = VerboseRegExp;

  function hasOnlyLeftBrace(part) {
    return part.includes('{') && !part.includes('}');
  }

  function findEndOfHash(allParts, startIndex) {
    var parts = allParts.slice(startIndex); // Join the parts together so we can search one string to find the balanced
    // brace.

    var str = parts.join('');
    var index = balance$5(str, '}', '{', {
      stackDepth: 1
    });

    if (index === -1) {
      return;
    } // Loop through the parts until we figure out which part that balance brace
    // belongs to.


    var totalLength = 0;

    for (var i = startIndex; i < allParts.length; i++) {
      totalLength += allParts[i].length;

      if (totalLength >= index) {
        return i;
      }
    }
  }

  function rejoinHash(parts, startIndex, endIndex) {
    var result = [];

    for (var i = startIndex; i <= endIndex; i++) {
      result.push(parts[i]);
    }

    return result.join(',');
  }

  function parseParameters(str, grammar, context) {
    if (!grammar) grammar = PARAMETERS$4;
    var rawParts = str.split(/,/),
        parameters = [];

    for (var i = 0, rawPart; i < rawParts.length; i++) {
      rawPart = rawParts[i];

      if (hasOnlyLeftBrace(rawPart)) {
        // We've split in the middle of a hash. Find the end of the hash and
        // rejoin.
        var endIndex = findEndOfHash(rawParts, i + 1);
        var rejoined = rejoinHash(rawParts, i, endIndex);
        parameters.push(rejoined);
        i = endIndex;
      } else {
        parameters.push(rawPart);
      }
    }

    return parameters.map(function (p) {
      return grammar.parse(p, context);
    });
  }

  var PARAMETERS$4 = new Grammar({
    'meta: parameter with default': {
      pattern: /^(\s*)([A-Za-z0-9_]+)(\s*=\s*)(.*)/,
      replacement: "#{1}<span class='variable parameter'>#{2}</span><span class='keyword punctuation'>#{3}</span>#{4}",
      before: function before(r, context) {
        r[4] = VALUES$5.parse(r[4], context);
      }
    },
    'variable parameter': {
      pattern: /^(\s*)([A-Za-z0-9_]+)$/,
      replacement: "#{1}<span class='#{name}'>#{2}</span>"
    }
  }); // Block parameters get a separate grammar because they can't have defaults.

  var BLOCK_PARAMETERS = new Grammar({
    'variable parameter': {
      pattern: /^(\s*)([A-Za-z0-9_]+)$/,
      replacement: "#{1}<span class='#{name}'>#{2}</span>"
    }
  }); // Values.
  // In other words, (nearly) anything that's valid on the right hand side of
  // an assignment operator.

  var VALUES$5 = new Grammar({
    // Single-quoted strings are easy; they have no escapes _or_
    // interpolation.
    'string string-single-quoted': {
      pattern: /(')([^']*?)(')/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>"
    },
    'string string-double-quoted': {
      pattern: /(")(.*?[^\\])(")/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = STRINGS$3.parse(r[2], context);
      }
    },
    // Probably could rewrite the above pattern to catch this, but this is
    // good enough for now.
    'string string-double-quoted empty': {
      pattern: /\"\"/
    },
    'string string-percent-q string-percent-q-braces': {
      // Capture group 2 is greedy because we don't know how much of this
      // pattern is ours, so we ask for everything up until the last brace in
      // the text. Then we find the balanced closing brace and act upon that
      // instead.
      pattern: /(%Q\{)([\s\S]*)(\})/,
      index: function index(text) {
        return balance$5(text, '}', '{', {
          startIndex: text.indexOf('{')
        });
      },
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      // When we receive matches here, they won't be against the entire string
      // that the pattern originally matched; they'll be against the segment of
      // the string that we later decided we cared about.
      before: function before(r, context) {
        r[2] = STRINGS$3.parse(r[2], context);
      }
    },
    'string string-percent-q string-percent-q-brackets': {
      pattern: /(%Q\[)(.*?[^\\])(\])/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = STRINGS$3.parse(r[2], context);
      }
    },
    'string embedded string-shell-command': {
      pattern: /(`)([^`]*?)(`)/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = STRINGS$3.parse(r[2], context);
      }
    },
    constant: {
      pattern: /\b(self|true|false|nil(?!\?))\b/
    },
    'number binary': {
      pattern: /\b0b[01](?:_[01]|[01])*\b/
    },
    number: {
      pattern: /\b(\d(?:[_.]\d|\d)*)\b/
    },
    // Namespace operator. We capture this so that it won't get matched by
    // the symbol rule.
    'punctuation punctuation-namespace': {
      pattern: /(::)/
    },
    symbol: {
      pattern: /:[A-Za-z0-9_!?]+/
    },
    'symbol single-quoted': {
      pattern: /:'([^']*?)'/
    },
    'symbol double-quoted': {
      pattern: /(:)(")(.*?[^\\])(")/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}#{4}</span>",
      before: function before(r, context) {
        r[3] = STRINGS$3.parse(r[3], context);
      }
    },
    regexp: {
      pattern: /(\/)(.*?)(\/)/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = REGEX_INTERNALS$2.parse(r[2], context);
      }
    },
    'variable variable-instance': {
      pattern: /(@)[a-zA-Z_]\w*/
    },
    keyword: {
      pattern: /\b(do|class|def|if|module|yield|then|else|for|until|unless|while|elsif|case|when|break|retry|redo|rescue|require|lambda)\b/
    }
  });
  var REGEX_INTERNALS$2 = new Grammar({
    escape: {
      pattern: /\\./
    },
    'meta: exclude from group begin': {
      pattern: /\\\(/,
      replacement: "#{0}"
    },
    'group-begin': {
      pattern: /(\()/,
      replacement: '<b class="group">#{1}'
    },
    'group-end': {
      pattern: /(\))/,
      replacement: '#{1}</b>'
    }
  });
  var STRINGS$3 = new Grammar({
    escape: {
      pattern: /\\./
    },
    interpolation: {
      pattern: /(#\{)(.*?)(\})/,
      replacement: "<span class='#{name}'><span class='punctuation'>#{1}</span>#{2}<span class='punctuation'>#{3}</span></span>",
      before: function before(r, context) {
        r[2] = MAIN$5.parse(r[2], context);
      } // TODO: Re-parse inside?

    }
  });
  var MAIN$5 = new Grammar('ruby', {
    'meta: method definition': {
      pattern: /(def)(\s+)([A-Za-z0-9_!?.]+)(?:\s*(\()(.*?)(\)))?/,
      replacement: "<span class='keyword'>#{1}</span>#{2}<span class='entity'>#{3}</span>#{4}#{5}#{6}",
      before: function before(r, context) {
        if (r[5]) r[5] = parseParameters(r[5], null, context);
      }
    },
    'block block-braces': {
      pattern: /(\{)(\s*)(\|)([^|]*?)(\|)/,
      replacement: compact$6("\n      <b class='#{name}'>\n        <span class='punctuation brace'>#{1}</span>#{2}\n        <span class='punctuation pipe'>#{3}</span>\n        #{4}\n        <span class='punctuation pipe'>#{5}</span>\n    "),
      before: function before(r, context) {
        // Keep a LIFO stack of block braces. When we encounter a brace that
        // we don't recognize later on, we'll pop the last scope off of the
        // stack and highlight it thusly.
        var stack = context.get('bracesStack', []);
        stack.push(r.name);
        r[4] = parseParameters(r[4], BLOCK_PARAMETERS, context);
      }
    },
    'block block-do-end': {
      pattern: VerboseRegExp$6(_templateObject$5()),
      replacement: compact$6("\n      <b class='#{name}'>\n        <span class='keyword'>#{1}</span>#{2}\n        <span class='punctuation pipe'>#{3}</span>\n        #{4}\n        <span class='punctuation pipe'>#{5}</span>\n    "),
      before: function before(r, context) {
        // Keep a LIFO stack of block braces. When we encounter a brace that
        // we don't recognize later on, we'll pop the last scope off of the
        // stack and highlight it thusly.
        var stack = context.get('bracesStack', []);
        stack.push(r.name);
        r[4] = parseParameters(r[4], null, context);
        r[6] = MAIN$5.parse(r[6], context);
      }
    },
    'meta: class definition with superclass': {
      pattern: VerboseRegExp$6(_templateObject2$4()),
      replacement: compact$6("\n      <span class='keyword'>#{1}</span>#{2}\n      <span class='class-definition-signature'>\n        <span class='class'>#{3}</span>#{4}<span class='class superclass'>#{5}</span>\n      </span>\n    ")
    },
    'meta: class or module definition': {
      pattern: /(class|module)(\s+)([A-Z][A-Za-z0-9_]*)\s*(?=$|\n)/,
      replacement: compact$6("\n      <span class='keyword'>#{1}</span>#{2}\n      <span class='class-definition-signature'>\n        <span class='class'>#{3}</span>\n      </span>\n    ")
    },
    'string heredoc-indented': {
      pattern: /(&lt;&lt;-|<<-)([_\w]+?)\b([\s\S]+?)(\2)/,
      replacement: compact$6("\n      <span class='#{name}'>\n        <span class='begin'>#{1}#{2}</span>\n        #{3}\n        <span class='end'>#{4}</span>\n      </span>\n    "),
      before: function before(r, context) {
        r[3] = STRINGS$3.parse(r[3], context);
      }
    },
    'keyword operator': {
      pattern: /(\+|-|\*|\/|>|&gt;|<|&lt;|=>|=&gt;|>>|&gt;&gt;|<<|&lt;&lt;|=~|\|\|=|==|=|\|\||&&|\+=|-=|\*=|\/=)/
    },
    'keyword special': {
      pattern: /\b(initialize|new|loop|extend|raise|attr|catch|throw|private|protected|public|module_function|attr_(?:reader|writer|accessor))\b/
    }
  });
  MAIN$5.extend(VALUES$5); // These need to be lowest possible priority, so we put them in after the
  // values grammar.

  MAIN$5.extend({
    comment: {
      pattern: /#[^\n]+/
    },
    'bracket-block-end': {
      pattern: /\}/,
      replacement: "#{0}",
      after: function after(text, context) {
        var stack = context.get('bracesStack', []);
        var scope = stack.pop();
        if (!scope) return;
        return "".concat(text, "<!-- close ").concat(scope, " --></b>");
      }
    },
    'keyword keyword-block-end': {
      pattern: /\b(end)\b/,
      after: function after(text, context) {
        var stack = context.get('bracesStack', []);
        var scope = stack.pop();
        if (!scope) return;
        return "".concat(text, "<!-- close ").concat(scope, " --></b>");
      }
    }
  });

  function _templateObject3$4() {
    var data = _taggedTemplateLiteral(["\n      (^s*)\n      (\n      (?:\n        [>+~]| # combinator (ugh)\n        .|     # class name\n        #|     # ID\n        [|     # attribute\n        (?:&|&amp;)|      # self-reference\n        %|      # abstract class name\n        *|     # wildcard\n\n        # Otherwise, see if it matches a known tag name:\n        (?:a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|eventsource|fieldset|figure|figcaption|footer|form|frame|frameset|(?:h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\b\n      )\n      .*\n      )\n      # followed by a line ending with a comma or an opening brace.\n\n      (,|{)\n    "], ["\n      (^\\s*)\n      (\n      (?:\n        [>\\+~]| # combinator (ugh)\n        \\.|     # class name\n        \\#|     # ID\n        \\[|     # attribute\n        (?:&|&amp;)|      # self-reference\n        %|      # abstract class name\n        \\*|     # wildcard\n\n        # Otherwise, see if it matches a known tag name:\n        (?:a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|eventsource|fieldset|figure|figcaption|footer|form|frame|frameset|(?:h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b\n      )\n      .*\n      )\n      # followed by a line ending with a comma or an opening brace.\n\n      (,|\\{)\n    "]);

    _templateObject3$4 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2$5() {
    var data = _taggedTemplateLiteral(["\n      (             # 1: number\n        [+|-]?    # optional sign\n        (?:s*)?    # optional space\n        (?:         # EITHER\n          [0-9]+(?:.[0-9]+)? # digits with optional decimal point and more digits\n          |           # OR\n          .[0-9]+ # decimal point plus digits\n        )\n      )            # end group 1\n      (s*)        # 2: any space btwn number and unit\n      (            # 3: unit\n        (?:ch|cm|deg|dpi|dpcm|dppx|em|ex|\n        grad|in|mm|ms|pc|pt|px|rad|rem|\n        turn|s|vh|vmin|vw)\b # EITHER a unit\n        |          # OR\n        %          # a percentage\n      )\n    "], ["\n      (             # 1: number\n        [\\+|\\-]?    # optional sign\n        (?:\\s*)?    # optional space\n        (?:         # EITHER\n          [0-9]+(?:\\.[0-9]+)? # digits with optional decimal point and more digits\n          |           # OR\n          \\.[0-9]+ # decimal point plus digits\n        )\n      )            # end group 1\n      (\\s*)        # 2: any space btwn number and unit\n      (            # 3: unit\n        (?:ch|cm|deg|dpi|dpcm|dppx|em|ex|\n        grad|in|mm|ms|pc|pt|px|rad|rem|\n        turn|s|vh|vmin|vw)\\b # EITHER a unit\n        |          # OR\n        %          # a percentage\n      )\n    "]);

    _templateObject2$5 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject$6() {
    var data = _taggedTemplateLiteral(["\n      ([)               # 1: opening bracket\n      (                  # 2: attr name\n       [A-Za-z_-]        # initial character\n       [A-Za-z0-9_-]*\n      )                  # end group 2\n      (?:                # operator-and-value non-capturing group\n        ([~.$^]?=)      # 3: operator\n        (                # 4: value\n        (['\"])(?:.*?)(?:\\5)| # 5: single/double quote, value, then same quote OR...\n        [^s]]          # any value that doesn't need to be quoted\n        )                # end group 4\n      )?                 # end operator-and-value (optional)\n      (])               # 6: closing bracket\n    "], ["\n      (\\[)               # 1: opening bracket\n      (                  # 2: attr name\n       [A-Za-z_-]        # initial character\n       [A-Za-z0-9_-]*\n      )                  # end group 2\n      (?:                # operator-and-value non-capturing group\n        ([~\\.$^]?=)      # 3: operator\n        (                # 4: value\n        (['\"])(?:.*?)(?:\\\\5)| # 5: single/double quote, value, then same quote OR...\n        [^\\s\\]]          # any value that doesn't need to be quoted\n        )                # end group 4\n      )?                 # end operator-and-value (optional)\n      (\\])               # 6: closing bracket\n    "]);

    _templateObject$6 = function _templateObject() {
      return data;
    };

    return data;
  }
  var balance$6 = balance,
      compact$7 = compact,
      VerboseRegExp$7 = VerboseRegExp;

  var findFirstThatIsNotPrecededBy = function findFirstThatIsNotPrecededBy(token, notToken, string, startIndex) {
    var lastChar;

    for (var i = startIndex; i < string.length; i++) {
      var char = string.slice(i, i + token.length);

      if (lastChar !== notToken && char === token) {
        return i;
      }

      lastChar = char.slice(-1);
    }
  };

  var FUNCTIONS = new Grammar({
    'support support-function-call support-function-call-css-builtin': {
      pattern: /(attr|counter|rgb|rgba|hsl|hsla|calc)(\()(.*)(\))/,
      replacement: "<span class='#{name}'>#{1}</span><span class='punctuation'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>",
      before: function before(r, context) {
        r[3] = VALUES$6.parse(r[3], context);
      }
    },
    'support support-function-call support-function-call-sass': {
      pattern: /(red|green|blue|mix|hue|saturation|lightness|adjust-hue|lighten|darken|saturate|desaturate|grayscale|complement|invert|alpha|opacity|opacify|transparentize|fade-in|fade-out|selector-(?:nest|replace)|unquote|quote|str-(?:length|insert|index|slice)|to-(?:upper|lower)-case|percentage|round|ceil|floor|abs|min|max|random|(?:feature|variable|global-variable|mixin)-exists|inspect|type-of|unit|unitless|comparable|call|if|unique-id)(\()(.*)(\))/,
      replacement: "<span class='#{name}'>#{1}</span><span class='punctuation'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>",
      before: function before(r, context) {
        r[3] = VALUES$6.parse(r[3], context);
      }
    },
    'support support-function-call support-function-call-url': {
      pattern: /(url)(\()(.*)(\))/,
      index: function index(match) {
        return balance$6(match, ')', '(', {
          startIndex: match.indexOf('(')
        });
      },
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
      before: function before(r, context) {
        // The sole argument to `url` can be a quoted string or an unquoted
        // string. Apply interpolations either way.
        var transformed = INSIDE_URL_FUNCTION.parse(r[3], context);

        if (!/^('|")/.test(r[3])) {
          transformed = INTERPOLATIONS.parse(r[3], context);
          transformed = "<span class='string string-unquoted'>".concat(transformed, "</span>");
        }

        r[3] = transformed;
      }
    },
    'support support-function-call support-function-call-custom': {
      pattern: /([A-Za-z_-][A-Za-z0-9_-]*)(\()(.*)(\))/,
      replacement: "<span class='#{name}'>#{1}</span><span class='punctuation'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>",
      before: function before(r, context) {
        r[3] = VALUES$6.parse(r[3], context);
      }
    }
  });
  var INTERPOLATIONS = new Grammar({
    interpolation: {
      pattern: /(\#\{)(.*?)(})/,
      replacement: "<span class='interpolation'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = VALUES$6.parse(r[2], context);
      }
    }
  });

  function variableRuleNamed(name) {
    return new Grammar(_defineProperty({}, name, {
      pattern: /\$[A-Za-z0-9_-]+/
    }));
  }

  var VARIABLE = new Grammar({
    'variable': {
      pattern: /\$[A-Za-z0-9_-]+/
    }
  });
  var VARIABLES = new Grammar({
    'variable variable-assignment': {
      // NOTE: This is multiline. Will search until it finds a semicolon, even if it's not on the same line.
      pattern: /(\s*)(\$[A-Za-z][A-Za-z0-9_-]*)\b(\s*)(\:)([\s\S]*?)(;)/,
      replacement: compact$7("\n      #{1}\n      <span class='#{name}'>#{2}</span>#{3}\n      <span class='punctuation'>#{4}</span>\n      #{5}#{6}\n    "),
      // replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}<span class='punctuation'>#{4}</span>#{5}#{6}",
      before: function before(r, context) {
        r[5] = VALUES$6.parse(r[5], context);
      }
    }
  }).extend(VARIABLE);
  var PARAMETERS$5 = new Grammar({
    'parameter parameter-with-default': {
      pattern: /(\$[A-Za-z][A-Za-z0-9_-]*)(\s*:\s*)(.*?)(?=,|\)|\n)/,
      replacement: compact$7("\n      <span class=\"parameter\">\n        <span class=\"variable\">#{1}</span>\n        <span class=\"punctuation\">#{2}</span>\n      #{3}\n      </span>\n    "),
      before: function before(r, context) {
        r[3] = VALUES$6.parse(r[3], context);
      }
    }
  }).extend(variableRuleNamed('variable parameter'));
  var SELECTORS = new Grammar({
    'selector selector-class selector-abstract-class': {
      pattern: /(%)[a-zA-Z0-9_-]+/
    },
    'selector selector-element-wildcard': {
      pattern: /\*/
    },
    'selector selector-element': {
      pattern: /\b(a|abbr|acronym|address|area|article|aside|applet|audio|b|base|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|keygen|kbd|label|legend|li|link|main|map|mark|menu|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|u|ul|var|video)\b/
    },
    'selector selector-class': {
      pattern: /\.[a-zA-Z][a-zA-Z0-9_\-]*\b/
    },
    'selector selector-id': {
      pattern: /#[a-zA-Z][a-zA-Z0-9_-]*/
    },
    'selector selector-pseudo selector-pseudo-not': {
      pattern: /(:not\()(.*)(\))/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = SELECTORS.parse(r[2], context);
        r[2] = "<span class='parameter'>".concat(r[2], "</span>");
      }
    },
    'selector selector-self-reference-bem-style': {
      pattern: /(?:&amp;|&)(?:__|--)(?:[A-Za-z0-9_-]+)?/
    },
    'selector selector-with-interpolation': {
      pattern: /(#\{)(.*)(\})/,
      index: function index(match) {
        return balance$6(match, '}', '{', {
          startIndex: match.indexOf('{')
        });
      },
      replacement: "<span class='selector interpolation'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = VALUES$6.parse(r[2], context);
      }
    },
    'selector selector-self-reference': {
      pattern: /(?:&amp;|&)/
    },
    'selector selector-pseudo selector-pseudo-with-args': {
      pattern: /((?:\:+)\b(?:lang|nth-(?:last-)?child|nth-(?:last-)?of-type))(\()(.*)(\))/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}#{4}</span>",
      before: function before(r, context) {
        r[3] = VALUES$6.parse(r[3], context);
      }
    },
    'selector selector-pseudo selector-pseudo-without-args': {
      pattern: /(:{1,2})(link|visited|hover|active|focus|targetdisabled|enabled|checked|indeterminate|root|first-child|last-child|first-of-type|last-of-type|only-child|only-of-type|empty|valid|invalid)/
    },
    'selector selector-pseudo selector-pseudo-element': {
      pattern: /(:{1,2})(-(?:webkit|moz|ms)-)?\b(after|before|first-letter|first-line|selection|any-link|local-link|(?:input-)?placeholder|focus-inner|matches|nth-match|column|nth-column)\b/
    },
    'selector selector-attribute': {
      pattern: VerboseRegExp$7(_templateObject$6()),
      // pattern: /(\[)([A-Za-z_-][A-Za-z0-9_-]*)(?:([~\.$^]?=)((['"])(?:.*?)(?:\5)|[^\s\]]))?(\])/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}#{4}#{6}</span>",
      before: function before(r, context) {
        r[4] = STRINGS$4.parse(r[4], context);
      }
    },
    'selector selector-combinator': {
      pattern: /(\s*)([>+~])(\s*)/,
      replacement: "#{1}<span class='#{name}'>#{2}</span>#{3}"
    }
  });
  var MAPS = new Grammar({
    'meta: map pair': {
      // Property, then colon, then any value. Line terminates with a comma,
      // a newline, or the end of the string (but not a semicolon).
      pattern: /([a-zA-Z_-][a-zA-Z0-9_-]*)(\s*:\s*)(.*(?:,|\)|$))/,
      replacement: "<span class='entity'>#{1}</span>#{2}#{3}",
      before: function before(r, context) {
        r[3] = VALUES$6.parse(r[3], context);
      }
    }
  });
  var OPERATOR_LOGICAL = new Grammar({
    'operator operator-logical': {
      pattern: /\b(and|or|not)\b/
    }
  });
  var OPERATORS$1 = new Grammar({
    'operator operator-arithmetic': {
      // Only a minus sign when followed by a space, a parenthesis, or a
      // digit; otherwise it's a hyphen.
      pattern: /\*|\+|\-(?=\s|\(|\d|$)|\//
    },
    'operator operator-comparison': {
      // TODO: >? (it's also a combinator)
      pattern: /!=|==|</
    }
  }).extend(OPERATOR_LOGICAL);
  var VALUES$6 = new Grammar({
    // An arbitrary grouping of parentheses could also be a list, among other
    // things. But we don't need to apply special highlighting to lists;
    // their values will get highlighted.
    'meta: possible map': {
      pattern: /(\()([\s\S]+)(\))/,
      replacement: "#{1}#{2}#{3}",
      before: function before(r, context) {
        var mapPattern = /[A-Za-z_-][A-Za-z0-9_-]*:.*(?:,|\)|$)/;
        var grammar = VALUES$6;

        if (mapPattern.test(r[2])) {
          grammar = MAPS;
        }

        r[2] = grammar.parse(r[2], context);
      }
    },
    'constant constant-boolean': {
      pattern: /\b(?:true|false)\b/
    },
    'constant': {
      pattern: /\b(?:null)\b/
    },
    'support support-property-value': {
      pattern: /inherit|initial|unset|none|auto|inline-block|block|inline|absolute|relative|solid|dotted|dashed|nowrap|normal|bold|italic|underline|overline|double|uppercase|lowercase|(?:border|content)-box/
    },
    'meta: value with unit': {
      pattern: VerboseRegExp$7(_templateObject2$5()),
      replacement: "<span class='number'>#{1}</span>#{2}<span class='unit'>#{3}</span>"
    }
  }).extend(OPERATORS$1, VARIABLE);
  var NUMBERS = new Grammar({
    'number': {
      pattern: /[\+|\-]?(\s*)?([0-9]+(\.[0-9]+)?|\.[0-9]+)/
    }
  });
  var STRINGS$4 = new Grammar({
    'string single-quoted': {
      pattern: /(')([^']*?)(')/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = INTERPOLATIONS.parse(r[2], context);
      }
    },
    'string double-quoted': {
      pattern: /(")(.*?[^\\])(")/,
      replacement: "<span class='#{name}'>#{1}#{2}#{3}</span>",
      before: function before(r, context) {
        r[2] = INTERPOLATIONS.parse(r[2], context);
      }
    },
    'string single-quoted string-empty': {
      pattern: /''/
    },
    'string double-quoted string-empty': {
      pattern: /""/
    }
  });
  var COLORS = new Grammar({
    'constant color-hex': {
      pattern: /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/
    },
    'constant color-named': {
      pattern: /\b(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow)\b/
    }
  });
  var DIRECTIVES = new Grammar({
    'keyword directive': {
      pattern: /\s+!(?:default|important|optional)/
    }
  });
  VALUES$6.extend(FUNCTIONS, STRINGS$4, COLORS, NUMBERS, DIRECTIVES);
  VALUES$6.extend({
    'support': {
      pattern: /\b([\w-]+)\b/
    }
  });
  var COMMENTS$1 = new Grammar({
    'comment comment-line': {
      pattern: /(?:\s*)\/\/(?:.*?)(?=\n)/
    },
    'comment comment-block': {
      pattern: /(?:\s*)(\/\*)([\s\S]*)(\*\/)/
    }
  });
  var PROPERTIES = new Grammar({
    'meta: property pair': {
      pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(;)/,
      replacement: "<span class=\"property\">#{1}</span>#{2}#{3}#{4}",
      before: function before(r, context) {
        r[3] = VALUES$6.parse(r[3], context);
      }
    }
  });
  var INSIDE_AT_RULE_MEDIA = new Grammar({
    'support': {
      pattern: /\b(?:only|screen)\b/
    },
    'meta: property group': {
      pattern: /(\()(.*)(\))/,
      replacement: "#{1}#{2}#{3}",
      before: function before(r, context) {
        r[2] = MEDIA_AT_RULE_PROP_PAIR.parse(r[2], context);
      }
    }
  }).extend(OPERATOR_LOGICAL);
  var INSIDE_AT_RULE_IF = new Grammar({}).extend(FUNCTIONS, OPERATORS$1, VALUES$6);
  var INSIDE_AT_RULE_INCLUDE = new Grammar({}).extend(PARAMETERS$5, VALUES$6);
  INSIDE_AT_RULE_INCLUDE.extend({
    'string string-unquoted': {
      pattern: /\b\w+\b/
    }
  });
  var INSIDE_AT_RULE_KEYFRAMES = new Grammar({
    'meta: from/to': {
      pattern: /\b(from|to)\b(\s*)(?={)/,
      replacement: "<span class='keyword'>#{1}</span>#{2}"
    },
    'meta: percentage': {
      pattern: /(\d+%)(\s*)(?={)/,
      replacement: "#{1}#{2}",
      before: function before(r, context) {
        r[1] = VALUES$6.parse(r[1], context);
      }
    }
  }).extend(PROPERTIES);
  var INSIDE_AT_RULE_SUPPORTS = new Grammar({
    'meta: property pair': {
      pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
      replacement: "<span class=\"property\">#{1}</span>#{2}#{3}#{4}",
      before: function before(r, context) {
        r[3] = VALUES$6.parse(r[3], context);
      }
    }
  }).extend(OPERATOR_LOGICAL);
  var MEDIA_AT_RULE_PROP_PAIR = new Grammar({
    'meta: property pair': {
      pattern: /([\-a-z]+)(\s*:\s*)([^;]+)(?=\)|$)/,
      replacement: "<span class=\"property\">#{1}</span>#{2}#{3}#{4}",
      before: function before(r, context) {
        r[3] = VALUES$6.parse(r[3], context);
      }
    }
  });
  var INSIDE_URL_FUNCTION = new Grammar({}).extend(STRINGS$4, VARIABLES, FUNCTIONS);
  var AT_RULES = new Grammar({
    'keyword keyword-at-rule keyword-at-rule-if': {
      pattern: /(@(?:elseif|if|else))(.*)({)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}",
      before: function before(r, context) {
        r[2] = INSIDE_AT_RULE_IF.parse(r[2], context);
      }
    },
    'keyword keyword-at-rule keyword-at-rule-keyframes': {
      pattern: /(@keyframes)(\s+)([a-z-]+)(\s*)({)([\s\S]*)(})/,
      index: function index(match) {
        return balance$6(match, '}', '{', {
          startIndex: match.indexOf('{')
        });
      },
      before: function before(r, context) {
        r[6] = INSIDE_AT_RULE_KEYFRAMES.parse(r[6], context);
      },
      replacement: compact$7("\n      <span class='#{name}'>#{1}</span>#{2}\n      <span class='entity'>#{3}</span>\n      #{4}#{5}#{6}#{7}\n    ") // replacement: "<span class='#{name}'>#{1}</span>#{2}<span class='entity'>#{3}</span>#{4}#{5}#{6}#{7}"

    },
    'keyword keyword-at-rule keyword-at-rule-log-directive': {
      pattern: /(@(?:error|warn|debug))(\s+|\()(.*)(\)?;)(\s*)(?=\n)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
      before: function before(r, context) {
        r[3] = STRINGS$4.parse(r[3], context);
      }
    },
    'keyword keyword-at-rule keyword-at-rule-each': {
      pattern: /(@each)(.*)\b(in)\b(.*)(\{)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}<span class='keyword'>#{3}</span>#{4}#{5}",
      before: function before(r, context) {
        r[2] = VARIABLES.parse(r[2], context);
        r[4] = VALUES$6.parse(r[4], context);
      }
    },
    'keyword keyword-at-rule keyword-at-rule-for': {
      pattern: /(@for)(.*)\b(from)\b(.*)(through)(.*)({)/,
      replacement: compact$7("\n      <span class='#{name}'>#{1}</span>#{2}\n      <span class='keyword'>#{3}</span>#{4}\n      <span class='keyword'>#{5}</span>#{6}#{7}\n    "),
      before: function before(r, context) {
        r[2] = VARIABLES.parse(r[2], context);
        r[4] = VALUES$6.parse(r[4], context);
        r[6] = VALUES$6.parse(r[6], context);
      }
    },
    'keyword keyword-at-rule keyword-at-rule-mixin': {
      pattern: /(@mixin)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
      replacement: compact$7("\n      <span class='#{name}'>#{1}</span>#{2}\n      <span class='function'>#{3}</span>#{4}#{5}\n    "),
      before: function before(r, context) {
        if (r[5]) {
          r[5] = PARAMETERS$5.parse(r[5], context);
        }
      }
    },
    'keyword keyword-at-rule keyword-at-rule-function': {
      pattern: /(@function)(\s+)([A-Za-z-][A-Za-z0-9\-_]+)(?:(\s*\())?(.*)(?={)/,
      replacement: compact$7("\n      <span class='#{name}'>#{1}</span>#{2}\n      <span class='function'>#{3}</span>#{4}#{5}\n    "),
      before: function before(r, context) {
        if (r[5]) {
          r[5] = PARAMETERS$5.parse(r[5], context);
        }
      }
    },
    'keyword keyword-at-rule keyword-at-rule-extend': {
      pattern: /(@extend)(\s+)(.*)(;)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
      before: function before(r, context) {
        r[3] = SELECTORS.parse(r[3], context);
        r[3] = r[3].replace(/(class=)(["'])(?:selector)\b/g, '$1$2entity parameter');

        if (/!optional$/.test(r[3])) {
          r[3] = r[3].replace(/(!optional)$/, "<span class='keyword keyword-directive'>$1</span>");
        }
      }
    },
    'keyword keyword-at-rule keyword-at-rule-include': {
      pattern: /(@include)(\s+)([A-Za-z][A-Za-z0-9\-_]+)(?:(\s*\())?([\s\S]*?)(;|\{)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}<span class='function'>#{3}</span>#{4}#{5}#{6}",
      before: function before(r, context) {
        if (r[5]) {
          r[5] = INSIDE_AT_RULE_INCLUDE.parse(r[5], context);
        }
      }
    },
    'keyword keyword-at-rule keyword-at-rule-media': {
      pattern: /(@media)(.*)({)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}",
      before: function before(r, context) {
        r[2] = INSIDE_AT_RULE_MEDIA.parse(r[2], context);
      }
    },
    'keyword keyword-at-rule keyword-at-rule-import': {
      pattern: /(@import)(.*)(;)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}",
      before: function before(r, context) {
        r[2] = STRINGS$4.parse(r[2], context);
      }
    },
    'keyword keyword-at-rule keyword-at-rule-content': {
      pattern: /(@content)(?=;)/
    },
    'keyword keyword-at-rule keyword-at-rule-charset': {
      pattern: /(@charset)(\s+)(.*)(;)(\s*)(?=\n|$)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
      before: function before(r, context) {
        r[3] = STRINGS$4.parse(r[3], context);
      }
    },
    'keyword keyword-at-rule keyword-at-rule-namespace': {
      pattern: /(@namespace)(\s+)(?:([a-zA-Z][a-zA-Z0-9]+)(\s+))?([^\s]*)(;)(?=\n|$)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}<span class='selector'>#{3}</span>#{4}#{5}#{6}",
      before: function before(r, context) {
        if (!r[3]) {
          r[4] = '';
        }

        r[5] = FUNCTIONS.parse(r[5], context);
      }
    },
    'keyword keyword-at-rule keyword-at-rule-supports': {
      pattern: /(@supports)(\s+)(.*)({)(\s*)(?=\n)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}#{5}",
      before: function before(r, context) {
        r[3] = INSIDE_AT_RULE_SUPPORTS.parse(r[3], context);
      }
    },
    'keyword keyword-at-rule keyword-at-rule-font-face': {
      pattern: /(@font-face)(\s*)({)(\s*)(?=\n)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}"
    },
    'keyword keyword-at-rule keyword-at-rule-return': {
      pattern: /(@return)(\s+)(.*)(;)/,
      replacement: "<span class='#{name}'>#{1}</span>#{2}#{3}#{4}",
      before: function before(r, context) {
        r[3] = VALUES$6.parse(r[3], context);
      }
    }
  });
  var MAIN$6 = new Grammar('scss', {});
  MAIN$6.extend(FUNCTIONS, VARIABLES, AT_RULES);
  MAIN$6.extend({
    'meta: selector line': {
      pattern: VerboseRegExp$7(_templateObject3$4()),
      index: function index(match) {
        var endIndex = findFirstThatIsNotPrecededBy('{', '#', match, 0);
        return endIndex;
      },
      replacement: "#{1}#{2}#{3}",
      before: function before(r, context) {
        // TODO: interpolations?
        r[2] = SELECTORS.parse(r[2], context);
      }
    }
  });
  MAIN$6.extend(PROPERTIES, COMMENTS$1);

  var INSIDE_STRINGS = new Grammar({
    variable: {
      pattern: /(\$[\d\w_\-]+)\b|(\$\{[\d\w_\-]+\})/
    }
  });
  var INSIDE_SHELL_COMMANDS = new Grammar({
    variable: {
      pattern: /(\$[\w_\-]+)\b/
    }
  });
  var MAIN$7 = new Grammar('shell', {
    comment: {
      pattern: /#[^\n]*(?=\n|$)/
    },
    string: {
      pattern: /(?:'[^']*'|"[^"]*")/,
      before: function before(r, context) {
        r[0] = INSIDE_STRINGS.parse(r[0], context);
      }
    },
    function: {
      pattern: /(\w[\w\d_\-]+)(?=\()/
    },
    'shell-command shell-command-backticks': {
      pattern: /`[^`]*`/,
      before: function before(r, context) {
        r[0] = INSIDE_SHELL_COMMANDS.parse(r[0], context);
      }
    },
    'shell-command': {
      pattern: /\$\(.*?\)/,
      before: function before(r, context) {
        r[0] = INSIDE_SHELL_COMMANDS.parse(r[0], context);
      }
    },
    'support support-builtin': {
      pattern: /\b(?:sudo|chmod|cd|mkdir|ls|cat|echo|touch|mv|cp|rm|ln|sed|awk|tr|xargs|yes|pbcopy|pbpaste)\b/
    },
    'support support-other': {
      pattern: /\b(?:ruby|gem|rake|python|pip|easy_install|node|npm|php|perl|bash|sh|zsh|gcc|go|mate|subl|atom)\b/
    },
    number: {
      pattern: /\b(?:[0-9]+(\.[0-9]+)?)\b/
    },
    constant: {
      pattern: /\b(?:false|true)\b/
    },
    'constant constant-home': {
      pattern: /(^|\s*|\n)~(?=\b|\/)/
    },
    keyword: {
      pattern: /\b(?:if|fi|case|esac|for|do|else|then|while|exit|done|shift)\b/
    },
    operator: {
      pattern: />|&gt;|&&|&amp;&amp;/
    },
    variable: {
      pattern: /(\$[\w_\-]+)\b/
    },
    'variable-assignment': {
      pattern: /([A-Za-z_][A-Za-z0-9_]*)(=)/,
      replacement: "<span class='variable'>#{1}</span><span class='operator'>#{2}</span>"
    },
    'variable variable-in-braces': {
      pattern: /\$\{.+?}(?=\n|\b)/
    }
  }, {
    alias: ['bash']
  });

  // Given a document fragment, find the first text node in the tree,
  // depth-first, or `null` if none is found.
  function findFirstTextNode(fragment) {
    var nodes = fragment.childNodes;

    if (nodes.length === 0) {
      return null;
    }

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];

      if (node.nodeType === Node.TEXT_NODE) {
        return node;
      }

      var descendant = findFirstTextNode(node);

      if (descendant) {
        return descendant;
      }
    }

    return null;
  }

  function findLastTextNode(fragment) {
    var nodes = fragment.childNodes;

    if (nodes.length === 0) {
      return null;
    }

    for (var i = nodes.length - 1; i >= 0; i--) {
      var node = nodes[i];

      if (node.nodeType === Node.TEXT_NODE) {
        return node;
      }

      var descendant = findFirstTextNode(node);

      if (descendant) {
        return descendant;
      }
    }

    return null;
  } // eslint-disable-next-line no-unused-vars

  document.addEventListener('daub-will-highlight', function (event) {
    var fragment = event.detail.fragment;
    var firstTextNode = findFirstTextNode(fragment);

    if (firstTextNode) {
      var value = firstTextNode.nodeValue;

      if (value && value.match(/^(\s*\n)/)) {
        value = value.replace(/^(\s*\n)/, '');
      }

      firstTextNode.parentNode.replaceChild(document.createTextNode(value), firstTextNode);
    }

    var lastTextNode = findLastTextNode(fragment);

    if (lastTextNode) {
      var _value = lastTextNode.nodeValue;

      if (_value && _value.match(/(\s*\n)+$/)) {
        _value = _value.replace(/(\s*\n)+$/, '');
      }

      lastTextNode.parentNode.replaceChild(document.createTextNode(_value), lastTextNode);
    }
  });

  // Some browsers round the line-height, others don't.
  // We need to test for it to position the elements properly.
  // let isLineHeightRounded = (function() {
  //   let res;
  //   return function() {
  //     if (typeof res === 'undefined') {
  //       var d = document.createElement('div');
  //       d.style.fontSize = '13px';
  //       d.style.lineHeight = '1.5';
  //       d.style.padding = 0;
  //       d.style.border = 0;
  //       d.innerHTML = '&nbsp;<br />&nbsp;';
  //       document.body.appendChild(d);
  //       // Browsers that round the line-height should have offsetHeight === 38
  //       // The others should have 39.
  //       res = d.offsetHeight === 38;
  //       document.body.removeChild(d);
  //     }
  //     return res;
  //   };
  // })();
  function getLineHeight(el) {
    var style = window.getComputedStyle(el);
    return parseFloat(style.lineHeight);
  }

  function getTopOffset(code, pre) {
    var dummy = document.createElement('span');
    dummy.setAttribute('class', 'daub-line-highlight-dummy');
    dummy.setAttribute('aria-hidden', 'true');
    dummy.textContent = ' ';
    code.insertBefore(dummy, code.firstChild);
    var preRect = pre.getBoundingClientRect();
    var codeRect = dummy.getBoundingClientRect();
    var delta = preRect.top - codeRect.top;
    code.removeChild(dummy);
    return Math.abs(delta);
  }

  function handleAttribute(str) {
    if (!str) {
      return null;
    }

    function handleUnit(unit) {
      var result = {};

      if (unit.indexOf('-') > -1) {
        var _unit$split$map = unit.split('-').map(function (u) {
          return Number(u);
        }),
            _unit$split$map2 = _slicedToArray(_unit$split$map, 2),
            start = _unit$split$map2[0],
            end = _unit$split$map2[1];

        result.start = start;
        result.lines = end + 1 - start;
      } else {
        result.start = Number(unit);
        result.lines = 1;
      }

      return result;
    }

    var units = str.split(/,\s*/).map(handleUnit);
    return units;
  }

  function makeLine(range, lh, topOffset) {
    var span = document.createElement('mark');
    span.setAttribute('class', 'daub-line-highlight');
    span.setAttribute('aria-hidden', 'true');
    span.textContent = new Array(range.lines).join('\n') + ' ';
    var top = topOffset + (range.start - 1) * lh - 2;
    Object.assign(span.style, {
      position: 'absolute',
      top: top + 'px',
      left: '0',
      right: '0',
      lineHeight: 'inherit'
    });
    return span;
  }

  document.addEventListener('daub-will-highlight', function (event) {
    var code = event.target,
        pre = event.target.parentNode;
    var fragment = event.detail.fragment;
    var lineAttr = code.getAttribute('data-lines') || pre.getAttribute('data-lines');

    if (!lineAttr) {
      return;
    }

    var ranges = handleAttribute(lineAttr);
    if (!ranges) return;
    pre.style.position = 'relative';
    var lh = getLineHeight(code);
    var to = getTopOffset(code, pre);
    ranges.forEach(function (r) {
      var span = makeLine(r, lh, to);
      fragment.appendChild(span);
    });
  });

  var highlighter = new Highlighter();
  highlighter.addGrammar(MAIN);
  highlighter.addGrammar(MAIN$6);
  highlighter.addGrammar(MAIN$2);
  highlighter.addGrammar(MAIN$3);
  highlighter.addGrammar(MAIN$1);
  highlighter.addGrammar(MAIN$4);
  highlighter.addGrammar(MAIN$5);
  highlighter.addGrammar(MAIN$7); // const escapeLexer = new Daub.Lexer([
  //
  // ]);

  var stringLexer = new Lexer([{
    name: 'string-open',
    pattern: /^\s*('|"|`)/,
    test: function test(pattern, text, context) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      context.set('string-open', match[1]);
      return match;
    }
  }, {
    name: 'string-escape',
    pattern: /\\./
  }, {
    name: 'string-end',
    pattern: /('|"|`)/,
    test: function test(pattern, text, context) {
      var char = context.get('string-open');
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      if (match[1] !== char) {
        return false;
      }

      context.set('string-open', null);
      return match;
    },
    final: true
  }]);
  var tagLexer = new Lexer([{
    name: 'tag-open',
    pattern: /^\s*<(?=[a-z])/
  }, {
    name: 'tag-name',
    pattern: /^[a-z][a-z\-]*(?=\s|>)/
  }, {
    name: 'attribute-name',
    pattern: /^\s*[a-z]+=/,
    after: {
      name: 'attribute-value',
      lexer: stringLexer
    }
  }, {
    name: 'tag-close',
    pattern: /^>/,
    final: true
  }]); // let js = `

  return highlighter;

}());
