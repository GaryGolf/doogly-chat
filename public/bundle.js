/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="./socket.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(2);
	var io = __webpack_require__(3);
	var constants_1 = __webpack_require__(4);
	var messagelist_1 = __webpack_require__(5);
	var input_1 = __webpack_require__(11);
	var login_1 = __webpack_require__(13);
	var DooglyChat = (function (_super) {
	    __extends(DooglyChat, _super);
	    function DooglyChat(props) {
	        var _this = _super.call(this, props) || this;
	        _this.dispatch = function (action, payload) {
	            switch (action) {
	                case constants_1.LOGIN_USER:
	                    _this.socket.emit('Login', payload);
	                    _this.name = payload;
	                    _this.login = false;
	                    _this.forceUpdate();
	                    break;
	                case constants_1.GOT_NEW_MESSAGE:
	                    var users = _this.users;
	                    _this.socket.emit('NewMessage', __assign({}, payload, { users: users }), function (message) {
	                        if (message) {
	                            var list = _this.state.list.concat([message]);
	                            _this.setState(__assign({}, _this.state, { list: list }));
	                        }
	                    });
	                    break;
	                case constants_1.ADD_RECIPIENT:
	                    if (!_this.name) {
	                        _this.login = true;
	                        _this.forceUpdate();
	                        break;
	                    }
	                    // should get iMessage
	                    // if message private new message should be private
	                    if (_this.users.indexOf(payload) != -1 || _this.name == payload)
	                        break;
	                    _this.users.push(payload);
	                    _this.forceUpdate();
	                    break;
	                case constants_1.REMOVE_RECIPIENT:
	                    _this.users = _this.users.filter(function (user) { return user != payload; });
	                    _this.forceUpdate();
	                    break;
	                case constants_1.SET_TYPYNG_STATUS:
	                    // if user is not logged in 
	                    if (!_this.name) {
	                        _this.login = true;
	                        _this.forceUpdate();
	                        break;
	                    }
	                    var message = {
	                        private: payload,
	                        users: _this.users
	                    };
	                    // this.socket.emit('Typing', message)
	                    break;
	                case constants_1.REMOVE_TYPING_STATUS:
	                    // this.socket.emit('RemoveTyping')
	                    break;
	                default:
	                    break;
	            }
	        };
	        _this.socket = Window.prototype.socket = io();
	        _this.users = [];
	        _this.login = false;
	        var list = [];
	        _this.state = { list: list };
	        return _this;
	    }
	    DooglyChat.prototype.componentWillMount = function () {
	        var _this = this;
	        // initial message load
	        this.socket.emit('LoadMessages', null);
	        this.socket.on('LoadMessages', function (list) {
	            _this.setState(__assign({}, _this.state, { list: list }));
	        });
	        this.socket.on('NewMessage', function (message) {
	            var list = _this.state.list.concat([message]);
	            _this.setState(__assign({}, _this.state, { list: list }));
	            // notify author that message has received
	            _this.socket.emit('MessageReceived', message.date);
	        });
	        this.socket.on('ChangeLoginName', function (name) {
	            console.log(name);
	            _this.login = true;
	            _this.forceUpdate();
	        });
	        this.socket.on('MessageReceived', function (date) {
	            var list = _this.state.list.map(function (msg) {
	                if (msg.date == date)
	                    switch (msg.status) {
	                        case 'sent':
	                            return __assign({}, msg, { status: 'received' });
	                        case 'received':
	                        // return {...msg, status: 'read'}
	                        default:
	                    }
	                return msg;
	            });
	            _this.setState(__assign({}, _this.state, { list: list }));
	        });
	    };
	    DooglyChat.prototype.render = function () {
	        if (this.login)
	            return React.createElement(login_1.default, { onDispatch: this.dispatch });
	        return (React.createElement("div", null,
	            React.createElement(messagelist_1.default, { list: this.state.list, onDispatch: this.dispatch }),
	            React.createElement(input_1.default, { users: this.users, onDispatch: this.dispatch })));
	    };
	    return DooglyChat;
	}(React.Component));
	ReactDOM.render(React.createElement(DooglyChat, null), document.getElementById('layout'));


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = io;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	exports.SET_TYPYNG_STATUS = 'SET_TYPYNG_STATUS';
	exports.GOT_NEW_MESSAGE = 'GOT_NEW_MESSAGE';
	exports.LOAD_LAST_MESSAGES = 'LOAD_LAST_MESSAGES';
	exports.LOGIN_USER = 'LOGIN_USER';
	exports.ADD_RECIPIENT = 'ADD_RECIPIENT';
	exports.REMOVE_RECIPIENT = 'REMOVE_RECIPIENT';
	exports.REMOVE_TYPING_STATUS = 'REMOVE_TYPING_STATUS';


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var React = __webpack_require__(1);
	var constants_1 = __webpack_require__(4);
	var message_1 = __webpack_require__(6);
	var messagelist_style_1 = __webpack_require__(10);
	var MessageList = (function (_super) {
	    __extends(MessageList, _super);
	    function MessageList(props) {
	        return _super.call(this, props) || this;
	    }
	    MessageList.prototype.clickHandler = function (author) {
	        this.props.onDispatch(constants_1.ADD_RECIPIENT, author);
	    };
	    MessageList.prototype.render = function () {
	        var _this = this;
	        var list = this.props.list.map(function (msg, idx) {
	            msg.onclick = _this.clickHandler.bind(_this);
	            return React.createElement("div", { key: idx },
	                React.createElement(message_1.default, __assign({}, msg)));
	        });
	        return (React.createElement("div", { className: messagelist_style_1.css.messagelist }, list));
	    };
	    return MessageList;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MessageList;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var message_style_1 = __webpack_require__(7);
	var Message = (function (_super) {
	    __extends(Message, _super);
	    function Message(props) {
	        var _this = _super.call(this, props) || this;
	        // this.socket = io()
	        if (props.message.length < 30)
	            _this.message = React.createElement("span", null, props.message);
	        else
	            _this.message = (React.createElement("span", null,
	                _this.props.message.substr(0, 30) + ' ... ',
	                React.createElement("span", { className: message_style_1.css.more, onClick: _this.moreHandler.bind(_this) }, "more")));
	        return _this;
	    }
	    Message.prototype.clickHandler = function (event) {
	        this.props.onclick(this.props.author);
	        // should sent this.props.date
	        // then get author and private.status from messages
	    };
	    Message.prototype.moreHandler = function (event) {
	        event.stopPropagation();
	        this.message = React.createElement("span", null, this.props.message);
	        this.forceUpdate();
	    };
	    Message.prototype.render = function () {
	        var users = this.props.users.map(function (user) { return '@' + user; }).join(',');
	        var date = new Date(this.props.date);
	        var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	        var authorcss = (this.props.private) ? message_style_1.css.private : message_style_1.css.author;
	        return (React.createElement("div", { className: message_style_1.css.message, onClick: this.clickHandler.bind(this) },
	            React.createElement("div", { className: message_style_1.css.body }, this.message),
	            React.createElement("div", { className: message_style_1.css.details },
	                React.createElement("span", { className: authorcss }, this.props.author),
	                "\u00A0\u00A0",
	                React.createElement("span", { className: message_style_1.css.users }, users),
	                "\u00A0\u00A0",
	                React.createElement("span", null, this.props.status),
	                "\u00A0\u00A0",
	                React.createElement("span", null, time)),
	            React.createElement("style", null, message_style_1.Style.getStyles())));
	    };
	    return Message;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Message;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var FreeStyle = __webpack_require__(8);
	exports.Style = FreeStyle.create();
	exports.css = {
	    message: exports.Style.registerStyle({
	        position: 'relative',
	        borderSize: 'border-box',
	        padding: '10px',
	        width: '100%'
	    }),
	    body: exports.Style.registerStyle({
	        // marginRight: '50px',
	        fontSize: '1.2rem',
	        cursor: 'pointer'
	    }),
	    details: exports.Style.registerStyle({
	        // marginRight: '50px',
	        fontSize: '.75rem',
	        cursor: 'pointer'
	    }),
	    author: exports.Style.registerStyle({}),
	    private: exports.Style.registerStyle({
	        color: 'red',
	    }),
	    users: exports.Style.registerStyle({
	        color: 'blue'
	    }),
	    more: exports.Style.registerStyle({
	        color: 'blue',
	        cursor: 'pointer'
	    }),
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/**
	 * Increment through IDs for FreeStyle, which can't generate hashed IDs.
	 */
	var instanceId = 0;
	/**
	 * The unique id is used to get a unique hash on styles (no merging).
	 */
	var uniqueId = 0;
	/**
	 * Tag styles with this string to get unique hash outputs.
	 */
	exports.IS_UNIQUE = '__DO_NOT_DEDUPE_STYLE__';
	/**
	 * CSS properties that are valid unit-less numbers.
	 */
	var CSS_NUMBER = {
	    'animation-iteration-count': true,
	    'box-flex': true,
	    'box-flex-group': true,
	    'column-count': true,
	    'counter-increment': true,
	    'counter-reset': true,
	    'flex': true,
	    'flex-grow': true,
	    'flex-positive': true,
	    'flex-shrink': true,
	    'flex-negative': true,
	    'font-weight': true,
	    'line-clamp': true,
	    'line-height': true,
	    'opacity': true,
	    'order': true,
	    'orphans': true,
	    'tab-size': true,
	    'widows': true,
	    'z-index': true,
	    'zoom': true,
	    // SVG properties.
	    'fill-opacity': true,
	    'stroke-dashoffset': true,
	    'stroke-opacity': true,
	    'stroke-width': true
	};
	// Add vendor prefixes to all unit-less properties.
	for (var _i = 0, _a = ['-webkit-', '-ms-', '-moz-', '-o-']; _i < _a.length; _i++) {
	    var prefix = _a[_i];
	    for (var _b = 0, _c = Object.keys(CSS_NUMBER); _b < _c.length; _b++) {
	        var property = _c[_b];
	        CSS_NUMBER[prefix + property] = true;
	    }
	}
	/**
	 * Transform a JavaScript property into a CSS property.
	 */
	function hyphenate(propertyName) {
	    return propertyName
	        .replace(/([A-Z])/g, '-$1')
	        .replace(/^ms-/, '-ms-') // Internet Explorer vendor prefix.
	        .toLowerCase();
	}
	/**
	 * Check if a property name should pop to the top level of CSS.
	 */
	function isAtRule(propertyName) {
	    return propertyName.charAt(0) === '@';
	}
	/**
	 * Check if a value is a nested style definition.
	 */
	function isNestedStyle(value) {
	    return value != null && typeof value === 'object' && !Array.isArray(value);
	}
	/**
	 * Generate a hash value from a string.
	 */
	function stringHash(str) {
	    var value = 5381;
	    var i = str.length;
	    while (i) {
	        value = (value * 33) ^ str.charCodeAt(--i);
	    }
	    return (value >>> 0).toString(36);
	}
	exports.stringHash = stringHash;
	/**
	 * Transform a style string to a CSS string.
	 */
	function styleToString(name, value) {
	    if (typeof value === 'number' && value !== 0 && !CSS_NUMBER[name]) {
	        value = value + "px";
	    }
	    return name + ":" + String(value).replace(/([\{\}\[\]])/g, '\\$1');
	}
	/**
	 * Sort an array of tuples by first value.
	 */
	function sortTuples(value) {
	    return value.sort(function (a, b) { return a[0] > b[0] ? 1 : -1; });
	}
	/**
	 * Categorize user styles.
	 */
	function parseUserStyles(styles, hasNestedStyles) {
	    var properties = [];
	    var nestedStyles = [];
	    var isUnique = false;
	    // Sort keys before adding to styles.
	    for (var _i = 0, _a = Object.keys(styles); _i < _a.length; _i++) {
	        var key = _a[_i];
	        var value = styles[key];
	        if (key === exports.IS_UNIQUE) {
	            isUnique = !!value;
	        }
	        else if (isNestedStyle(value)) {
	            nestedStyles.push([key.trim(), value]);
	        }
	        else {
	            properties.push([hyphenate(key.trim()), value]);
	        }
	    }
	    return {
	        properties: sortTuples(properties),
	        nestedStyles: hasNestedStyles ? nestedStyles : sortTuples(nestedStyles),
	        isUnique: isUnique
	    };
	}
	/**
	 * Stringify an array of property tuples.
	 */
	function stringifyProperties(properties) {
	    var result = [];
	    var _loop_1 = function (name_1, value) {
	        if (value != null) {
	            if (Array.isArray(value)) {
	                result.push(value.filter(function (x) { return x != null; }).map(function (x) { return styleToString(name_1, x); }).join(';'));
	            }
	            else {
	                result.push(styleToString(name_1, value));
	            }
	        }
	    };
	    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
	        var _a = properties_1[_i], name_1 = _a[0], value = _a[1];
	        _loop_1(name_1, value);
	    }
	    return result.join(';');
	}
	/**
	 * Interpolate CSS selectors.
	 */
	function interpolate(selector, parent) {
	    if (selector.indexOf('&') > -1) {
	        return selector.replace(/&/g, parent);
	    }
	    return parent + " " + selector;
	}
	/**
	 * Register all styles, but collect for post-selector correction using the hash.
	 */
	function collectHashedStyles(container, userStyles, isStyle, displayName) {
	    var styles = [];
	    function stylize(cache, userStyles, selector) {
	        var _a = parseUserStyles(userStyles, isStyle), properties = _a.properties, nestedStyles = _a.nestedStyles, isUnique = _a.isUnique;
	        var styleString = stringifyProperties(properties);
	        var pid = styleString;
	        // Only create style instances when styles exists.
	        if (styleString) {
	            var style = new Style(styleString, cache.hash, isUnique ? "u" + (++uniqueId).toString(36) : undefined);
	            cache.add(style);
	            styles.push([cache, selector, style]);
	        }
	        for (var _i = 0, nestedStyles_1 = nestedStyles; _i < nestedStyles_1.length; _i++) {
	            var _b = nestedStyles_1[_i], name_2 = _b[0], value = _b[1];
	            pid += name_2;
	            if (isAtRule(name_2)) {
	                var rule = cache.add(new Rule(name_2, undefined, cache.hash));
	                pid += stylize(rule, value, selector);
	            }
	            else {
	                pid += stylize(cache, value, isStyle ? interpolate(name_2, selector) : name_2);
	            }
	        }
	        return pid;
	    }
	    // Create a temporary cache to handle changes/mutations before re-assigning later.
	    var cache = new Cache(container.hash);
	    var pid = stylize(cache, userStyles, '&');
	    var hash = "f" + cache.hash(pid);
	    var id = displayName ? displayName + "_" + hash : hash;
	    for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
	        var _a = styles_1[_i], cache_1 = _a[0], selector = _a[1], style = _a[2];
	        var key = isStyle ? interpolate(selector, "." + id) : selector;
	        cache_1.get(style).add(new Selector(key, style.hash, undefined, pid));
	    }
	    container.merge(cache);
	    return { pid: pid, id: id };
	}
	/**
	 * Recursively register styles on a container instance.
	 */
	function registerUserStyles(container, styles, displayName) {
	    return collectHashedStyles(container, styles, true, displayName).id;
	}
	/**
	 * Create user rule. Simplified collection of styles, since it doesn't need a unique id hash.
	 */
	function registerUserRule(container, selector, styles) {
	    var _a = parseUserStyles(styles, false), properties = _a.properties, nestedStyles = _a.nestedStyles, isUnique = _a.isUnique;
	    // Throw when using properties and nested styles together in rule.
	    if (properties.length && nestedStyles.length) {
	        throw new TypeError("Registering a CSS rule can not use properties with nested styles");
	    }
	    var styleString = stringifyProperties(properties);
	    var rule = new Rule(selector, styleString, container.hash, isUnique ? "u" + (++uniqueId).toString(36) : undefined);
	    for (var _i = 0, nestedStyles_2 = nestedStyles; _i < nestedStyles_2.length; _i++) {
	        var _b = nestedStyles_2[_i], name_3 = _b[0], value = _b[1];
	        registerUserRule(rule, name_3, value);
	    }
	    container.add(rule);
	}
	/**
	 * Parse and register keyframes on the current instance.
	 */
	function registerUserHashedRule(container, prefix, styles, displayName) {
	    var bucket = new Cache(container.hash);
	    var _a = collectHashedStyles(bucket, styles, false, displayName), pid = _a.pid, id = _a.id;
	    var atRule = new Rule(prefix + " " + id, undefined, container.hash, undefined, pid);
	    atRule.merge(bucket);
	    container.add(atRule);
	    return id;
	}
	/**
	 * Get the styles string for a container class.
	 */
	function getStyles(container) {
	    return container.values().map(function (style) { return style.getStyles(); }).join('');
	}
	/**
	 * Implement a cache/event emitter.
	 */
	var Cache = (function () {
	    function Cache(hash) {
	        this.hash = hash;
	        this.changeId = 0;
	        this._children = {};
	        this._keys = [];
	        this._counts = {};
	    }
	    Cache.prototype.values = function () {
	        var _this = this;
	        return this._keys.map(function (x) { return _this._children[x]; });
	    };
	    Cache.prototype.add = function (style) {
	        var count = this._counts[style.id] || 0;
	        var item = this._children[style.id] || style.clone();
	        this._counts[style.id] = count + 1;
	        if (count === 0) {
	            this._keys.push(item.id);
	            this._children[item.id] = item;
	            this.changeId++;
	        }
	        else {
	            // Check if contents are different.
	            if (item.getIdentifier() !== style.getIdentifier()) {
	                throw new TypeError("Hash collision: " + style.getStyles() + " === " + item.getStyles());
	            }
	            this._keys.splice(this._keys.indexOf(style.id), 1);
	            this._keys.push(style.id);
	            if (item instanceof Cache && style instanceof Cache) {
	                var prevChangeId = item.changeId;
	                item.merge(style);
	                if (item.changeId !== prevChangeId) {
	                    this.changeId++;
	                }
	            }
	        }
	        return item;
	    };
	    Cache.prototype.remove = function (style) {
	        var count = this._counts[style.id];
	        if (count > 0) {
	            this._counts[style.id] = count - 1;
	            var item = this._children[style.id];
	            if (count === 1) {
	                delete this._counts[style.id];
	                delete this._children[style.id];
	                this._keys.splice(this._keys.indexOf(style.id), 1);
	                this.changeId++;
	            }
	            else if (item instanceof Cache && style instanceof Cache) {
	                var prevChangeId = item.changeId;
	                item.unmerge(style);
	                if (item.changeId !== prevChangeId) {
	                    this.changeId++;
	                }
	            }
	        }
	    };
	    Cache.prototype.get = function (container) {
	        return this._children[container.id];
	    };
	    Cache.prototype.merge = function (cache) {
	        for (var _i = 0, _a = cache.values(); _i < _a.length; _i++) {
	            var value = _a[_i];
	            this.add(value);
	        }
	        return this;
	    };
	    Cache.prototype.unmerge = function (cache) {
	        for (var _i = 0, _a = cache.values(); _i < _a.length; _i++) {
	            var value = _a[_i];
	            this.remove(value);
	        }
	        return this;
	    };
	    Cache.prototype.clone = function () {
	        return new Cache(this.hash).merge(this);
	    };
	    return Cache;
	}());
	exports.Cache = Cache;
	/**
	 * Selector is a dumb class made to represent nested CSS selectors.
	 */
	var Selector = (function () {
	    function Selector(selector, hash, id, pid) {
	        if (id === void 0) { id = "s" + hash(selector); }
	        if (pid === void 0) { pid = ''; }
	        this.selector = selector;
	        this.hash = hash;
	        this.id = id;
	        this.pid = pid;
	    }
	    Selector.prototype.getStyles = function () {
	        return this.selector;
	    };
	    Selector.prototype.getIdentifier = function () {
	        return this.pid + "." + this.selector;
	    };
	    Selector.prototype.clone = function () {
	        return new Selector(this.selector, this.hash, this.id, this.pid);
	    };
	    return Selector;
	}());
	exports.Selector = Selector;
	/**
	 * The style container registers a style string with selectors.
	 */
	var Style = (function (_super) {
	    __extends(Style, _super);
	    function Style(style, hash, id) {
	        if (id === void 0) { id = "c" + hash(style); }
	        var _this = _super.call(this, hash) || this;
	        _this.style = style;
	        _this.hash = hash;
	        _this.id = id;
	        return _this;
	    }
	    Style.prototype.getStyles = function () {
	        return this.values().map(function (x) { return x.selector; }).join(',') + "{" + this.style + "}";
	    };
	    Style.prototype.getIdentifier = function () {
	        return this.style;
	    };
	    Style.prototype.clone = function () {
	        return new Style(this.style, this.hash, this.id).merge(this);
	    };
	    return Style;
	}(Cache));
	exports.Style = Style;
	/**
	 * Implement rule logic for style output.
	 */
	var Rule = (function (_super) {
	    __extends(Rule, _super);
	    function Rule(rule, style, hash, id, pid) {
	        if (style === void 0) { style = ''; }
	        if (id === void 0) { id = "a" + hash(rule + "." + style); }
	        if (pid === void 0) { pid = ''; }
	        var _this = _super.call(this, hash) || this;
	        _this.rule = rule;
	        _this.style = style;
	        _this.hash = hash;
	        _this.id = id;
	        _this.pid = pid;
	        return _this;
	    }
	    Rule.prototype.getStyles = function () {
	        return this.rule + "{" + this.style + getStyles(this) + "}";
	    };
	    Rule.prototype.getIdentifier = function () {
	        return this.pid + "." + this.rule + "." + this.style;
	    };
	    Rule.prototype.clone = function () {
	        return new Rule(this.rule, this.style, this.hash, this.id, this.pid).merge(this);
	    };
	    return Rule;
	}(Cache));
	exports.Rule = Rule;
	/**
	 * The FreeStyle class implements the API for everything else.
	 */
	var FreeStyle = (function (_super) {
	    __extends(FreeStyle, _super);
	    function FreeStyle(hash, debug, id) {
	        if (id === void 0) { id = "f" + (++instanceId).toString(36); }
	        var _this = _super.call(this, hash) || this;
	        _this.hash = hash;
	        _this.debug = debug;
	        _this.id = id;
	        return _this;
	    }
	    FreeStyle.prototype.registerStyle = function (styles, displayName) {
	        return registerUserStyles(this, styles, this.debug ? displayName : undefined);
	    };
	    FreeStyle.prototype.registerKeyframes = function (keyframes, displayName) {
	        return registerUserHashedRule(this, '@keyframes', keyframes, this.debug ? displayName : undefined);
	    };
	    FreeStyle.prototype.registerRule = function (rule, styles) {
	        return registerUserRule(this, rule, styles);
	    };
	    FreeStyle.prototype.getStyles = function () {
	        return getStyles(this);
	    };
	    FreeStyle.prototype.getIdentifier = function () {
	        return this.id;
	    };
	    FreeStyle.prototype.clone = function () {
	        return new FreeStyle(this.hash, this.debug, this.id).merge(this);
	    };
	    return FreeStyle;
	}(Cache));
	exports.FreeStyle = FreeStyle;
	/**
	 * Exports a simple function to create a new instance.
	 */
	function create(hash, debug) {
	    if (hash === void 0) { hash = stringHash; }
	    if (debug === void 0) { debug = process.env.NODE_ENV !== 'production'; }
	    return new FreeStyle(hash, debug);
	}
	exports.create = create;
	//# sourceMappingURL=free-style.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },
/* 9 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var FreeStyle = __webpack_require__(8);
	exports.Style = FreeStyle.create();
	exports.css = {
	    messagelist: exports.Style.registerStyle({
	        position: 'relative',
	        borderSize: 'border-box',
	        padding: '10px',
	        width: '100%',
	        height: '100%'
	    }),
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var React = __webpack_require__(1);
	var input_style_1 = __webpack_require__(12);
	var constants_1 = __webpack_require__(4);
	var Input = (function (_super) {
	    __extends(Input, _super);
	    function Input(props) {
	        var _this = _super.call(this, props) || this;
	        _this.placeholder = 'type here';
	        return _this;
	    }
	    Input.prototype.componentDidMount = function () {
	        if (this.props.private)
	            this.checkbox.checked = true;
	    };
	    Input.prototype.componentDidUpdate = function () {
	        // no recipients, no private message
	        if (this.props.users.length == 0) {
	            this.checkbox.checked = false;
	            this.checkbox.disabled = true;
	        }
	        else {
	            this.checkbox.disabled = false;
	        }
	    };
	    Input.prototype.handleKeyUp = function (event) {
	        switch (event.key) {
	            case 'Enter':
	                if (this.input.value == '')
	                    return;
	                var message = {
	                    message: this.input.value,
	                    private: this.checkbox.checked
	                };
	                this.props.onDispatch(constants_1.GOT_NEW_MESSAGE, message);
	                this.input.value = '';
	                break;
	            default:
	                this.props.onDispatch(constants_1.SET_TYPYNG_STATUS, this.checkbox.checked);
	        }
	    };
	    Input.prototype.handleFocus = function (event) {
	        this.props.onDispatch(constants_1.SET_TYPYNG_STATUS, this.checkbox.checked);
	    };
	    Input.prototype.handleBlur = function (event) {
	        // !! user stops typing
	        this.props.onDispatch(constants_1.REMOVE_TYPING_STATUS);
	    };
	    Input.prototype.handleClick = function (user) {
	        this.props.onDispatch(constants_1.REMOVE_RECIPIENT, user);
	    };
	    Input.prototype.render = function () {
	        var _this = this;
	        var handlers = {
	            onKeyUp: this.handleKeyUp.bind(this),
	            onFocus: this.handleFocus.bind(this),
	            onBlur: this.handleBlur.bind(this)
	        };
	        var users = this.props.users.map(function (usr, idx) {
	            return React.createElement("span", { key: idx, onClick: function () { return _this.handleClick(usr); } },
	                "@",
	                usr,
	                ",");
	        });
	        return (React.createElement("div", { className: input_style_1.css.input },
	            React.createElement("div", { className: input_style_1.css.users }, users),
	            React.createElement("input", __assign({ type: "text", ref: function (element) { return _this.input = element; } }, handlers, { placeholder: this.placeholder })),
	            React.createElement("input", { type: "checkbox", ref: function (element) { return _this.checkbox = element; } }),
	            "private",
	            React.createElement("style", null, input_style_1.Style.getStyles())));
	    };
	    return Input;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Input;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var FreeStyle = __webpack_require__(8);
	exports.Style = FreeStyle.create();
	exports.css = {
	    input: exports.Style.registerStyle({
	        position: 'relative',
	        borderSize: 'border-box',
	        padding: '10px',
	        bottom: '0px'
	    }),
	    users: exports.Style.registerStyle({
	        fontSize: '0.7rem',
	        color: 'blue',
	        cursor: 'pointer'
	    })
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var login_style_1 = __webpack_require__(14);
	var constants_1 = __webpack_require__(4);
	var Login = (function (_super) {
	    __extends(Login, _super);
	    function Login(props) {
	        return _super.call(this, props) || this;
	    }
	    Login.prototype.componentDidMount = function () {
	        var nickname = localStorage['nickname'] || '';
	        this.input.focus();
	        this.input.value = nickname;
	    };
	    Login.prototype.handleKeyUp = function (event) {
	        switch (event.key) {
	            case 'Enter':
	                var name_1 = this.input.value;
	                if (name_1 == '')
	                    return;
	                this.props.onDispatch(constants_1.LOGIN_USER, name_1);
	                localStorage['nickname'] = name_1;
	                break;
	            default:
	        }
	    };
	    Login.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", { className: login_style_1.css.login },
	            React.createElement("input", { type: "text", ref: function (element) { return _this.input = element; }, onKeyUp: this.handleKeyUp.bind(this), placeholder: "enter you nickname" }),
	            React.createElement("style", null, login_style_1.Style.getStyles())));
	    };
	    return Login;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Login;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var FreeStyle = __webpack_require__(8);
	exports.Style = FreeStyle.create();
	exports.css = {
	    login: exports.Style.registerStyle({
	        position: 'relative',
	        borderSize: 'border-box',
	        padding: '10px'
	    }),
	};


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map