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
	var input_1 = __webpack_require__(9);
	var login_1 = __webpack_require__(11);
	var userlist_1 = __webpack_require__(13);
	var DooglyChat = (function (_super) {
	    __extends(DooglyChat, _super);
	    function DooglyChat(props) {
	        var _this = _super.call(this, props) || this;
	        _this.dispatch = function (action, payload) {
	            switch (action) {
	                case constants_1.LOGIN_USER:
	                    _this.socket.emit('login_user', payload, function (ok, list) {
	                        if (ok) {
	                            _this.name = payload;
	                            _this.setState(__assign({}, _this.state, { list: list, login: false }));
	                        }
	                        else {
	                            _this.setState(__assign({}, _this.state, { login: true }));
	                        }
	                    });
	                    break;
	                case constants_1.GOT_NEW_MESSAGE:
	                    var users = _this.users;
	                    _this.socket.emit('cancel_typing');
	                    _this.socket.emit('new_message', __assign({}, payload, { users: users }), function (message) {
	                        if (message) {
	                            var list_1 = _this.state.list.map(function (m) { return m; });
	                            // remove last message           
	                            list_1.pop();
	                            list_1.push(message);
	                            _this.setState(__assign({}, _this.state, { list: list_1 }));
	                        }
	                    });
	                    // push message with status sending
	                    var date = Date.now();
	                    var status_1 = 'sending';
	                    var list = _this.state.list.concat([__assign({}, payload, { users: users, date: date, status: status_1 })]);
	                    _this.setState(__assign({}, _this.state, { list: list }));
	                    break;
	                case constants_1.ADD_RECIPIENT:
	                    if (!_this.name) {
	                        _this.setState(__assign({}, _this.state, { login: true }));
	                        break;
	                    }
	                    if (_this.users.indexOf(payload.user) != -1 ||
	                        _this.name == payload.user)
	                        break;
	                    _this.users.push(payload.user);
	                    // if message private new message should be private
	                    if (payload.private)
	                        _this.priv = true;
	                    _this.forceUpdate();
	                    break;
	                case constants_1.REMOVE_RECIPIENT:
	                    _this.users = _this.users.filter(function (user) { return user != payload; });
	                    if (_this.users.length == 0)
	                        _this.priv = false;
	                    _this.forceUpdate();
	                    break;
	                case constants_1.SET_TYPYNG_STATUS:
	                    // if user is not logged in 
	                    if (!_this.name) {
	                        _this.setState(__assign({}, _this.state, { login: true }));
	                        break;
	                    }
	                    _this.socket.emit('typing', __assign({}, payload, { users: _this.users }));
	                    break;
	                case constants_1.REMOVE_TYPING_STATUS:
	                    _this.socket.emit('cancel_typing');
	                    break;
	                case constants_1.SHOW_USER_MENU:
	                    if (!_this.name) {
	                        _this.setState(__assign({}, _this.state, { login: true }));
	                        break;
	                    }
	                    _this.setState(__assign({}, _this.state, { showusers: true }));
	                    break;
	                case constants_1.HIDE_USER_MENU:
	                    _this.setState(__assign({}, _this.state, { showusers: false }));
	                    break;
	                default:
	                    break;
	            }
	        };
	        _this.socket = Window.prototype.socket = io();
	        _this.users = [];
	        _this.priv = false;
	        var list = [];
	        var login = false;
	        var users = [];
	        var showusers = false;
	        _this.state = { list: list, login: login, users: users, showusers: showusers };
	        return _this;
	    }
	    DooglyChat.prototype.componentWillMount = function () {
	        var _this = this;
	        this.socket.on('user_login', function (name) {
	            var users = _this.state.users.concat([name]);
	            _this.setState(__assign({}, _this.state, { users: users }));
	        });
	        this.socket.on('user_logout', function (name) {
	            var users = _this.state.users.filter(function (usr) { return usr != name; });
	            _this.setState(__assign({}, _this.state, { users: users }));
	        });
	        this.socket.on('new_message', function (message) {
	            var list = _this.state.list.concat([message]);
	            _this.setState(__assign({}, _this.state, { list: list }));
	            // notify author that message has received
	            _this.socket.emit('message_received', message.date);
	        });
	        this.socket.on('update_message', function (message) {
	            var list = _this.state.list.filter(function (msg) { return msg.date != message.date; });
	            list.push(message);
	            _this.setState(__assign({}, _this.state, { list: list }));
	        });
	        this.socket.on('remove_message', function (date) {
	            var list = _this.state.list.filter(function (msg) { return msg.date != date; });
	            _this.setState(__assign({}, _this.state, { list: list }));
	        });
	        this.socket.on('message_received', function (date) {
	            var list = _this.state.list.map(function (msg) {
	                if (msg.date == date)
	                    switch (msg.status) {
	                        case 'sent':
	                            return __assign({}, msg, { status: 'received' });
	                        case 'received':
	                            return __assign({}, msg, { status: 'read' });
	                        default:
	                    }
	                return msg;
	            });
	            _this.setState(__assign({}, _this.state, { list: list }));
	        });
	    };
	    DooglyChat.prototype.componentDidMount = function () {
	        var _this = this;
	        // initial messages and users load
	        this.socket.emit('init', null, function (list, users) {
	            _this.setState(__assign({}, _this.state, { list: list, users: users }));
	            // should i send reading notifications here?
	            list.forEach(function (msg) {
	                _this.socket.emit('message_received', msg.date);
	            });
	        });
	    };
	    DooglyChat.prototype.render = function () {
	        if (this.state.login)
	            return (React.createElement("div", { className: "container" },
	                React.createElement(login_1.default, { onDispatch: this.dispatch })));
	        return (React.createElement("div", { className: "container" },
	            React.createElement(messagelist_1.default, { list: this.state.list, name: this.name, onDispatch: this.dispatch }),
	            React.createElement(input_1.default, { users: this.users, onDispatch: this.dispatch, priv: this.priv }),
	            React.createElement(userlist_1.default, { list: this.state.users, showusers: this.state.showusers, onDispatch: this.dispatch })));
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
	exports.SHOW_USER_MENU = 'SHOW_USER_MENU';
	exports.HIDE_USER_MENU = 'HIDE_USER_MENU';


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var constants_1 = __webpack_require__(4);
	var MessageList = (function (_super) {
	    __extends(MessageList, _super);
	    function MessageList(props) {
	        return _super.call(this, props) || this;
	    }
	    MessageList.prototype.componentDidUpdate = function () {
	        var last = this.messagelist.children.length - 1;
	        this.messagelist.children.item(last).scrollIntoView();
	    };
	    MessageList.prototype.handleClick = function (user, priv) {
	        this.props.onDispatch(constants_1.ADD_RECIPIENT, { user: user, private: priv });
	    };
	    MessageList.prototype.handleUserMenu = function () {
	        this.props.onDispatch(constants_1.HIDE_USER_MENU);
	    };
	    MessageList.prototype.drawMessage = function (message) {
	        var _this = this;
	        var date = new Date(message.date);
	        var time = date.toLocaleTimeString();
	        var users = message.users.map(function (usr, idx) {
	            return React.createElement("span", { key: idx, onClick: function () { return _this.handleClick(usr, message.private); } },
	                "@",
	                usr,
	                ",\u00A0");
	        });
	        return (React.createElement("div", { className: "well " + (this.props.name == message.author ? 'text-right' : null), onClick: this.handleUserMenu.bind(this) },
	            React.createElement("div", { className: 'message h4 pointer', onClick: function () { return _this.handleClick(message.author, message.private); } }, message.message),
	            React.createElement("div", { className: 'small' },
	                React.createElement("span", null,
	                    time,
	                    "\u00A0"),
	                React.createElement("span", { className: this.props.name == message.author ? 'hidden' : 'pointer', onClick: function () { return _this.handleClick(message.author, message.private); } },
	                    React.createElement("strong", null, message.author),
	                    "\u00A0"),
	                React.createElement("span", { className: (message.private) ? 'text-danger pointer' : 'text-info pointer' },
	                    users,
	                    "\u00A0"),
	                React.createElement("span", null, message.status))));
	    };
	    MessageList.prototype.render = function () {
	        var _this = this;
	        var list = this.props.list.map(function (msg, idx) { return React.createElement("div", { key: idx }, _this.drawMessage(msg)); });
	        return React.createElement("div", { className: 'messagelist', ref: function (element) { return _this.messagelist = element; } }, list);
	    };
	    return MessageList;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MessageList;


/***/ },
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
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
	var Input = (function (_super) {
	    __extends(Input, _super);
	    function Input(props) {
	        var _this = _super.call(this, props) || this;
	        _this.usermenu = false;
	        _this.placeholder = 'type here';
	        return _this;
	    }
	    Input.prototype.componentDidMount = function () {
	    };
	    Input.prototype.componentDidUpdate = function () {
	        // no recipients, no private message
	        if (this.props.users.length == 0) {
	            this.checkbox.checked = false;
	            this.checkbox.disabled = true;
	        }
	        else {
	            this.checkbox.disabled = false;
	            if (this.props.priv)
	                this.checkbox.checked = true;
	        }
	    };
	    Input.prototype.handleKeyUp = function (event) {
	        switch (event.key) {
	            case 'Enter':
	                if (this.input.value == '')
	                    return;
	                this.props.onDispatch(constants_1.GOT_NEW_MESSAGE, {
	                    message: this.input.value,
	                    private: this.checkbox.checked
	                });
	                this.input.value = '';
	                break;
	            default:
	                this.props.onDispatch(constants_1.SET_TYPYNG_STATUS, {
	                    private: this.checkbox.checked,
	                    message: this.input.value
	                });
	        }
	    };
	    Input.prototype.handleFocus = function (event) {
	        var message = {
	            private: this.checkbox.checked,
	            meaasge: '...'
	        };
	        this.props.onDispatch(constants_1.HIDE_USER_MENU);
	        this.props.onDispatch(constants_1.SET_TYPYNG_STATUS, message);
	    };
	    Input.prototype.handleBlur = function (event) {
	        // !! user stops typing
	        this.props.onDispatch(constants_1.REMOVE_TYPING_STATUS);
	    };
	    Input.prototype.handleClick = function (user) {
	        this.props.onDispatch(constants_1.REMOVE_RECIPIENT, user);
	    };
	    Input.prototype.handleSubmit = function () {
	        this.usermenu = false;
	        this.props.onDispatch(constants_1.HIDE_USER_MENU);
	        if (this.input.value == '')
	            return;
	        this.props.onDispatch(constants_1.GOT_NEW_MESSAGE, {
	            message: this.input.value,
	            private: this.checkbox.checked
	        });
	        this.input.value = '';
	    };
	    Input.prototype.handleUserMenu = function () {
	        if (this.usermenu) {
	            this.props.onDispatch(constants_1.HIDE_USER_MENU, null);
	            this.usermenu = false;
	        }
	        else {
	            this.props.onDispatch(constants_1.SHOW_USER_MENU, null);
	            this.usermenu = true;
	        }
	    };
	    Input.prototype.render = function () {
	        var _this = this;
	        var handlers = {
	            onKeyUp: this.handleKeyUp.bind(this),
	            onFocus: this.handleFocus.bind(this),
	            onBlur: this.handleBlur.bind(this)
	        };
	        var users = this.props.users.map(function (usr, idx) {
	            return React.createElement("span", { key: idx, style: { color: '#999' }, onClick: function () { return _this.handleClick(usr); } },
	                "\u00A0@",
	                usr,
	                ",");
	        });
	        return (React.createElement("div", { className: "input" },
	            React.createElement("div", { className: 'bg-warning h6 pointer' }, users),
	            React.createElement("div", { className: "input-group" },
	                React.createElement("span", { className: "input-group-btn" },
	                    React.createElement("button", { className: "btn btn-default", type: "button", onClick: this.handleUserMenu.bind(this) },
	                        React.createElement("i", { className: "fa fa-user-plus", "aria-hidden": "true" }))),
	                React.createElement("input", __assign({ type: "text", className: "form-control", ref: function (elmt) { return _this.input = elmt; } }, handlers, { "aria-label": "chat input" })),
	                React.createElement("span", { className: "input-group-addon" },
	                    React.createElement("input", { type: "checkbox", "aria-label": "private", ref: function (elmt) { return _this.checkbox = elmt; } })),
	                React.createElement("span", { className: "input-group-btn" },
	                    React.createElement("button", { className: "btn btn-default", type: "button", onClick: this.handleSubmit.bind(this) }, "Sumbit")))));
	    };
	    return Input;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Input;


/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
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
	    Login.prototype.handleSubmit = function () {
	        var name = this.input.value;
	        if (name == '')
	            return;
	        this.props.onDispatch(constants_1.LOGIN_USER, name);
	        localStorage['nickname'] = name;
	    };
	    Login.prototype.render = function () {
	        var _this = this;
	        return (React.createElement("div", { className: "form-group login-form" },
	            React.createElement("div", { className: "input-group" },
	                React.createElement("div", { className: "input-group-addon" }, "Login"),
	                React.createElement("input", { className: "form-control", type: "text", onKeyUp: this.handleKeyUp.bind(this), ref: function (elmt) { return _this.input = elmt; }, placeholder: "Enter Your Nickname" }),
	                React.createElement("span", { className: "input-group-btn" },
	                    React.createElement("button", { className: "btn btn-default", type: "button", onClick: this.handleSubmit.bind(this) }, "Sumbit")))));
	    };
	    return Login;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Login;


/***/ },
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var constants_1 = __webpack_require__(4);
	var UserList = (function (_super) {
	    __extends(UserList, _super);
	    function UserList(props) {
	        return _super.call(this, props) || this;
	    }
	    UserList.prototype.handleClick = function (user) {
	        this.props.onDispatch(constants_1.HIDE_USER_MENU);
	        this.props.onDispatch(constants_1.ADD_RECIPIENT, { user: user });
	    };
	    UserList.prototype.hanldeClose = function () {
	        this.props.onDispatch(constants_1.HIDE_USER_MENU);
	    };
	    UserList.prototype.render = function () {
	        var _this = this;
	        var list = this.props.list.map(function (usr, idx) {
	            return React.createElement("div", { key: idx, className: "pointer", onClick: function () { return _this.handleClick(usr); } }, usr);
	        });
	        return (React.createElement("div", { className: this.props.showusers ? 'show-userlist' : 'userlist' },
	            React.createElement("button", { type: "button", className: "close", onClick: this.hanldeClose.bind(this) },
	                React.createElement("span", { "aria-hidden": "true" }, "\u00D7"),
	                React.createElement("span", { className: "sr-only" }, "Close")),
	            list));
	    };
	    return UserList;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = UserList;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map