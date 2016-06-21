(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Cody = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lexer = require('./src/lexer');

var _lexer2 = _interopRequireDefault(_lexer);

var _stream = require('./src/stream');

var _stream2 = _interopRequireDefault(_stream);

var _emitter = require('./src/emitter');

var _emitter2 = _interopRequireDefault(_emitter);

var _mode = require('./src/mode');

var _mode2 = _interopRequireDefault(_mode);

var _context = require('./src/context');

var _context2 = _interopRequireDefault(_context);

var _item = require('./src/item');

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cody = function (_Emitter) {
	_inherits(Cody, _Emitter);

	function Cody(options) {
		_classCallCheck(this, Cody);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Cody).call(this));

		if (!options.mode.class) throw new Error('Cody cannot operate without a Mode');else if (!options.context.class) throw new Error('Cody cannot operate without a Context');

		_this.context = new options.context.class(_this, options.context.options);
		_this.mode = new options.mode.class(options.mode.options);

		_this.lexer = new _lexer2.default(_this.mode);

		_this.lexer.on('lexeme', function (lexeme) {
			return _this.emit('lexeme', lexeme);
		});
		_this.lexer.on('token', function (token) {
			return _this.emit('token', token);
		});
		_this.lexer.on('error', function (token) {
			return _this.emit('error', token);
		});

		_this.stream = new _stream2.default("");
		_this.lexemes = [];

		return _this;
	}

	_createClass(Cody, [{
		key: 'get_diff',
		value: function get_diff(L1, L2) {
			return [].concat(L1.reduce(function (D, L, i) {
				if (!L2[i] || L.value !== L2[i].value || L.offset !== L2[i].offset) D.push(L);
				return D;
			}, []), L2.reduce(function (D, L, i) {
				if (!L1[i] || L.value !== L1[i].value || L.offset !== L1[i].offset) D.push(L);
				return D;
			}, []));
		}
	}, {
		key: 'do_update',
		value: function do_update(text) {
			var _this2 = this;

			var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];


			if (!force) {

				var diff = void 0;

				if (text === this.stream.buffer) return;
				this.stream = new _stream2.default(text);

				var new_lexemes = this.lexer.scan(this.stream);
				if ((diff = this.get_diff(this.lexemes, new_lexemes)).length === 0) return;
				this.lexemes = new_lexemes;
			} else {
				this.stream = new _stream2.default(text);
				this.lexemes = this.lexer.scan(stream);
			}

			var items = [];

			try {
				var _lexer$evaluate = this.lexer.evaluate(this.lexemes);

				var _lexer$evaluate2 = _slicedToArray(_lexer$evaluate, 2);

				var tokens = _lexer$evaluate2[0];
				var issues = _lexer$evaluate2[1];


				items = tokens.map(function (token) {
					var item = new _item2.default(token);
					_this2.emit('item', item);
					return item;
				});

				if (issues.length > 0) {
					this.emit('invalid', issues);
				} else {
					this.emit('valid');
				}
			} catch (e) {
				this.emit('error', e);
			}

			this.context.do_render(items);
			return this;
		}
	}]);

	return Cody;
}(_emitter2.default);

Cody.Contexts = {};
exports.default = Cody;

},{"./src/context":2,"./src/emitter":3,"./src/item":4,"./src/lexer":6,"./src/mode":7,"./src/stream":8}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = function () {
	function Context(editor, options) {
		_classCallCheck(this, Context);

		this.editor = editor;
	}

	_createClass(Context, [{
		key: 'get_cursor_offset',
		value: function get_cursor_offset() {
			throw new Error('Unimplemented function for Context base class');
		}
	}, {
		key: 'set_cursor_offset',
		value: function set_cursor_offset() {
			throw new Error('Unimplemented function for Context base class');
		}
	}, {
		key: 'do_render',
		value: function do_render() {
			throw new Error('Unimplemented function for Context base class');
		}
	}]);

	return Context;
}();

exports.default = Context;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Emitter = function () {
	function Emitter() {
		_classCallCheck(this, Emitter);

		this._registry = {};
	}

	_createClass(Emitter, [{
		key: "on",
		value: function on(event, listener) {
			if (!this._registry[event]) this._registry[event] = [];
			this._registry[event].push(listener);
			return this;
		}
	}, {
		key: "off",
		value: function off(event, listener) {
			if (!this._registry[event]) return this;
			this._registry = this._registry[event].filter(function (L) {
				return L != listener;
			});
			return this;
		}
	}, {
		key: "once",
		value: function once(event, listeners) {
			var _this = this,
			    _arguments = arguments;

			var proxy = function proxy() {
				return listener.apply(_this, Array.prototype.slice.call(_arguments, 0)), _this.off(event, proxy), _this;
			};
			return this.on(event, proxy);
		}
	}, {
		key: "emit",
		value: function emit(event) {
			var _this2 = this;

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			if (!this._registry[event]) return this;
			this._registry[event].forEach(function (L) {
				return L.apply(_this2, args);
			});
			return this;
		}
	}]);

	return Emitter;
}();

exports.default = Emitter;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Item = function () {
	function Item(token) {
		_classCallCheck(this, Item);

		this.type = token.type;
		this.value = token.value;
		this.offset = token.offset;

		this.classes = [];
		this.attr = {};
	}

	_createClass(Item, [{
		key: "set_attribute",
		value: function set_attribute(key, value) {
			if (typeof value === 'undefined') delete this.attr[key];else this.attr[key] = value;
			return this;
		}
	}, {
		key: "get_attribute",
		value: function get_attribute(key) {
			return this.attr[key];
		}
	}, {
		key: "get_type",
		value: function get_type() {
			return this.type;
		}
	}, {
		key: "add_class",
		value: function add_class(name) {
			if (!this.classes.includes(name)) this.classes.push(name);
			return this;
		}
	}, {
		key: "remove_class",
		value: function remove_class(name) {
			this.classes = this.classes.filter(function (C) {
				return C != name;
			});
			return this;
		}
	}, {
		key: "get_classes",
		value: function get_classes() {
			return this.classes.slice(0);
		}
	}]);

	return Item;
}();

exports.default = Item;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lexeme = function Lexeme(value, offset, lexemes) {
	_classCallCheck(this, Lexeme);

	this.value = value;
	this.offset = offset;
};

exports.default = Lexeme;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

var _token = require('./token');

var _token2 = _interopRequireDefault(_token);

var _lexeme = require('./lexeme');

var _lexeme2 = _interopRequireDefault(_lexeme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Lexer = function (_Emitter) {
	_inherits(Lexer, _Emitter);

	/**
  * Constructs a new Lexer
  *
  * @param Mode mode
  */

	function Lexer(mode) {
		_classCallCheck(this, Lexer);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Lexer).call(this));

		_this.mode = mode;
		return _this;
	}

	/**
  * Takes a Stream and returns a list of Lexeme's based on lexing rules
  * defined in the Mode
  *
  * @param Stream stream The stream to parse
  * @param Function callback Called for every Lexeme found in stream
  * @return Array<Lexeme> lexemes
  */


	_createClass(Lexer, [{
		key: 'scan',
		value: function scan(stream, callback) {
			var _this2 = this;

			var ch = void 0;
			var ws = "";
			var value = "";

			var lexemes = [];

			var new_lexeme = function new_lexeme(value, stream) {
				var L = new _lexeme2.default(value, stream.position - value.length + 1);
				_this2.emit('lexeme', L);
				return L;
			};

			while (ch = stream.next()) {

				if (this.mode.lexemes.indexOf(ch) >= 0) {

					if (ws.length > 0) {
						lexemes.push(new_lexeme(ws, stream));
						ws = "";
					}

					if (value.length > 0) {
						lexemes.push(new_lexeme(value, stream));
						value = "";
					}

					lexemes.push(new_lexeme(ch, stream));
				} else if (ch === ' ') {

					if (value.length > 0) {
						if (ws.length > 0) {
							lexemes.push(new_lexeme(ws, stream));
							ws = "";
						}
						lexemes.push(new_lexeme(value, stream));
						value = "";
					}

					ws += ch;
				} else value += ch;
			}

			if (ws.length > 0) {
				lexemes.push(new_lexeme(ws, stream));
			}

			if (value.length > 0) {
				lexemes.push(new_lexeme(value, stream));
			}

			return lexemes;
		}

		/**
   * Takes a list of  Lexeme's, likely from the scan, and
   * returns a list of Token's
   *
   * @param [<Lexeme>] lexemes
   * @return [[<Token>] tokens, [<Token>] issues]
   */

	}, {
		key: 'evaluate',
		value: function evaluate(lexemes) {

			var token = void 0;
			var tokens = [];
			var issues = [];
			var accept = this.mode.tokenize;

			while (lexemes.length > 0) {
				try {
					var _accept$call = accept.call(this.mode, lexemes);

					var _accept$call2 = _slicedToArray(_accept$call, 2);

					token = _accept$call2[0];
					accept = _accept$call2[1];

					tokens.push(token);
				} catch (e) {
					this.emit('error', token);
				}
			}

			return [tokens, issues];
		}
	}]);

	return Lexer;
}(_emitter2.default);

exports.default = Lexer;

},{"./emitter":3,"./lexeme":5,"./token":9}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lexeme = require('./lexeme');

var _lexeme2 = _interopRequireDefault(_lexeme);

var _token = require('./token');

var _token2 = _interopRequireDefault(_token);

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mode = function (_Emitter) {
	_inherits(Mode, _Emitter);

	function Mode(setup) {
		_classCallCheck(this, Mode);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Mode).call(this));

		_this.keywords = setup.keywords || {};
		_this.operators = setup.operators || {};
		_this.symbols = setup.symbols || {};

		_this.lexemes = [].concat(Object.values(_this.symbols), Object.values(_this.operators));

		return _this;
	}

	_createClass(Mode, [{
		key: 'consume',
		value: function consume(lexemes, condition) {

			var lexeme = void 0;
			var slice = [];

			while (lexeme = lexemes.shift()) {
				slice.push(lexeme);
				if (condition(lexeme)) return slice;
			}

			return slice;
		}
	}, {
		key: 'match',
		value: function match(lexemes, value) {
			return lexemes[0] && lexemes[0].value === value;
		}
	}, {
		key: 'includes',
		value: function includes(lexemes, list) {
			return lexemes[0] && list.includes(lexemes[0].value);
		}
	}, {
		key: 'consume_exclusive',
		value: function consume_exclusive(lexemes, condition) {

			var lexeme = void 0;
			var slice = [];

			while (lexeme = lexemes.shift()) {
				if (condition(lexeme)) {
					this.revert(lexemes, lexeme);
					return slice;
				}
				slice.push(lexeme);
			}

			return slice;
		}
	}, {
		key: 'revert',
		value: function revert(lexemes, lexeme) {
			lexemes.unshift(lexeme);
			return this;
		}
	}, {
		key: 'tokenize',
		value: function tokenize(lexemes) {
			var lexeme = lexemes.shift();
			return [new _token2.default('unknown', lexeme.value, lexeme.offset), this.tokenize];
		}
	}]);

	return Mode;
}(_emitter2.default);

exports.default = Mode;

},{"./emitter":3,"./lexeme":5,"./token":9}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stream = function () {
	function Stream(buffer) {
		_classCallCheck(this, Stream);

		this.buffer = buffer;
		this.position = -1;
	}

	_createClass(Stream, [{
		key: "next",
		value: function next() {
			this.position++;
			if (this.buffer[this.position]) {
				return this.buffer[this.position];
			}
		}
	}, {
		key: "revert",
		value: function revert() {
			this.position--;
		}
	}, {
		key: "until",
		value: function until(ch) {
			var rch = void 0,
			    sequence = '';
			while (rch = this.next()) {
				if (rch === ch) return sequence;
				sequence += rch;
			}
			return sequence;
		}
	}]);

	return Stream;
}();

exports.default = Stream;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Token = function () {
	function Token(type, value, offset, previous) {
		_classCallCheck(this, Token);

		this.offset = offset;
		this.type = [];
		this.value = value;
		this.invalid = false;

		this.set_type(type);
		this.previous = function () {
			return previous;
		};
	}

	_createClass(Token, [{
		key: "set_invalid",
		value: function set_invalid(bool) {
			this.invalid = bool;
			return this;
		}
	}, {
		key: "set_type",
		value: function set_type(type) {
			if (typeof type === 'string') type = [type];
			this.type = type;
			return this;
		}
	}, {
		key: "add_type",
		value: function add_type(type) {
			this.type.push(type);
			return this;
		}
	}, {
		key: "set_value",
		value: function set_value(value) {
			this.value = value;
			return this;
		}
	}, {
		key: "get_type",
		value: function get_type() {
			return this.type;
		}
	}, {
		key: "get_value",
		value: function get_value() {
			return this.value;
		}
	}, {
		key: "get_offset",
		value: function get_offset() {
			return this.offset;
		}
	}]);

	return Token;
}();

exports.default = Token;

},{}]},{},[1])(1)
});