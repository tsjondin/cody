(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Cody||(g.Cody = {}));g=(g.Modes||(g.Modes = {}));g.genericql = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mode = require('../src/mode');

var _mode2 = _interopRequireDefault(_mode);

var _token2 = require('../src/token');

var _token3 = _interopRequireDefault(_token2);

var _lexeme = require('../src/lexeme');

var _lexeme2 = _interopRequireDefault(_lexeme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (!Object.values) {
	Object.values = function (o) {
		return Object.keys(o).map(function (K) {
			return o[K];
		});
	};
}

var operators = {
	'equals': '=',
	'negate': '!',
	'higher-than': '>',
	'lower-than': '<',
	'not-equals': '!=',
	'lower-than-or-equals': '<=',
	'higher-than-or-equals': '>=',
	'regex-match': '~',
	'not-regex-match': '!~',
	'dot': '.',
	'slash': '/'
};

var syntax_map = {
	'string': '"',
	'leftbracket': '[',
	'rightbracket': ']',
	'leftparen': '(',
	'rightparen': ')',
	'leftbrace': '{',
	'rightbrace': '}'
};

var GenericQLMode = function (_Mode) {
	_inherits(GenericQLMode, _Mode);

	function GenericQLMode() {
		_classCallCheck(this, GenericQLMode);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GenericQLMode).call(this));

		_this.lexemes = Object.values(syntax_map).concat(Object.values(operators));

		_this.keywords = ['and', 'or'];

		return _this;
	}

	_createClass(GenericQLMode, [{
		key: 'tokenize',
		value: function tokenize(lexemes) {
			return this.accept_expression(lexemes);
		}
	}, {
		key: 'handle_invalid',
		value: function handle_invalid(lexemes) {
			var lexeme = lexemes.shift();
			return [new _token3.default('invalid', lexeme.value, lexeme.offset).set_invalid(true), this.tokenize];
		}
	}, {
		key: 'handle_whitespace',
		value: function handle_whitespace(lexemes, accept) {
			if (lexemes[0].value.match(/^\s+$/)) {
				var lexeme = lexemes.shift();
				return [new _token3.default('whitespace', lexeme.value, lexeme.offset), accept];
			} else {
				return this.handle_invalid(lexemes);
			}
		}
	}, {
		key: 'accept_value',
		value: function accept_value(lexemes) {
			var _accept_string = this.accept_string(lexemes);

			var _accept_string2 = _slicedToArray(_accept_string, 2);

			var token = _accept_string2[0];
			var accept = _accept_string2[1];


			if (token.type.includes('whitespace')) return [token, this.accept_value];else if (token.invalid) {
				lexemes.unshift(new _lexeme2.default(token.value, token.offset));

				var _accept_number = this.accept_number(lexemes);

				var _accept_number2 = _slicedToArray(_accept_number, 2);

				token = _accept_number2[0];
				accept = _accept_number2[1];

				if (token.invalid) {
					lexemes.unshift(new _lexeme2.default(token.value, token.offset));

					var _accept_regexp = this.accept_regexp(lexemes);

					var _accept_regexp2 = _slicedToArray(_accept_regexp, 2);

					token = _accept_regexp2[0];
					accept = _accept_regexp2[1];
				}
			}

			return [token, accept];
		}
	}, {
		key: 'accept_variable',
		value: function accept_variable(lexemes) {
			var _accept_name = this.accept_name(lexemes);

			var _accept_name2 = _slicedToArray(_accept_name, 2);

			var token = _accept_name2[0];
			var accept = _accept_name2[1];


			if (token.type.includes('whitespace')) return [token, this.accept_variable];
			if (token.invalid) {
				lexemes.unshift(new _lexeme2.default(token.value, token.offset));

				var _accept_value = this.accept_value(lexemes);

				var _accept_value2 = _slicedToArray(_accept_value, 2);

				token = _accept_value2[0];
				accept = _accept_value2[1];
			}

			return [token, accept];
		}
	}, {
		key: 'accept_expression',
		value: function accept_expression(lexemes) {

			var token_block = void 0,
			    token_lh = void 0,
			    token_op = void 0,
			    token_rh = void 0,
			    accept = void 0;

			var _accept_block = this.accept_block(lexemes);

			var _accept_block2 = _slicedToArray(_accept_block, 2);

			token_block = _accept_block2[0];
			accept = _accept_block2[1];


			if (token_block.type.includes('whitespace')) return [token_block, this.accept_expression];else if (!token_block.invalid) {
				return [token_block, accept];
			} else {

				var tokens = [];

				lexemes.unshift(new _lexeme2.default(token_block.value, token_block.offset));

				var _accept_variable = this.accept_variable(lexemes);

				var _accept_variable2 = _slicedToArray(_accept_variable, 2);

				token_lh = _accept_variable2[0];
				accept = _accept_variable2[1];


				if (token_lh.type.includes('whitespace')) {
					tokens.push(token_lh);

					var _accept_variable3 = this.accept_variable(lexemes);

					var _accept_variable4 = _slicedToArray(_accept_variable3, 2);

					token_lh = _accept_variable4[0];
					accept = _accept_variable4[1];
				}
				tokens.push(token_lh);

				if (lexemes.length === 0) {
					return [new _token3.default('expression', tokens, tokens[0].offset), this.accept_operator];
				}

				var whitespace = void 0;

				var _accept_binary_operat = this.accept_binary_operator(lexemes);

				var _accept_binary_operat2 = _slicedToArray(_accept_binary_operat, 2);

				token_op = _accept_binary_operat2[0];
				accept = _accept_binary_operat2[1];

				if (token_op.type.includes('whitespace')) {
					tokens.push(token_op);
					whitespace = token_op;

					var _accept_binary_operat3 = this.accept_binary_operator(lexemes);

					var _accept_binary_operat4 = _slicedToArray(_accept_binary_operat3, 2);

					token_op = _accept_binary_operat4[0];
					accept = _accept_binary_operat4[1];
				}

				if (!token_op.type.includes('operator')) {
					lexemes.unshift(new _lexeme2.default(token_op.value, token_op.offset));
					return [new _token3.default('expression', tokens, tokens[0].offset), this.accept_operator];
				}
				tokens.push(token_op);

				var _accept_variable5 = this.accept_variable(lexemes);

				var _accept_variable6 = _slicedToArray(_accept_variable5, 2);

				token_rh = _accept_variable6[0];
				accept = _accept_variable6[1];

				if (token_rh.type.includes('whitespace')) {
					tokens.push(token_rh);

					var _accept_variable7 = this.accept_variable(lexemes);

					var _accept_variable8 = _slicedToArray(_accept_variable7, 2);

					token_rh = _accept_variable8[0];
					accept = _accept_variable8[1];
				}
				tokens.push(token_rh);

				var type = ['expression'];
				if (token_lh.invalid || token_op.invalid || token_rh.invalid) type.push('invalid');

				return [new _token3.default(type, tokens, token_lh.offset), this.accept_operator];
			}

			return [token, accept];
		}
	}, {
		key: 'accept_operator',
		value: function accept_operator(lexemes) {
			var _accept_conditional_o = this.accept_conditional_operator(lexemes);

			var _accept_conditional_o2 = _slicedToArray(_accept_conditional_o, 2);

			var token = _accept_conditional_o2[0];
			var accept = _accept_conditional_o2[1];


			if (token.type.includes('whitespace')) return [token, this.accept_operator];else if (token.invalid) {
				lexemes.unshift(new _lexeme2.default(token.value, token.offset));

				var _accept_binary_operat5 = this.accept_binary_operator(lexemes);

				var _accept_binary_operat6 = _slicedToArray(_accept_binary_operat5, 2);

				token = _accept_binary_operat6[0];
				accept = _accept_binary_operat6[1];
			}

			return [token, accept];
		}
	}, {
		key: 'accept_binary_operator',
		value: function accept_binary_operator(lexemes) {

			var opkeys = Object.values(operators);
			if (opkeys.includes(lexemes[0].value)) {

				/**
     * Stream valid operator lexemes until we find one that isn't, backup the
     * stream and then validate the built operator
     */
				var offset = lexemes[0].offset;
				var op = this.consume(lexemes, function (L) {
					return !opkeys.includes(L.value);
				});
				lexemes.unshift(op.pop());

				var value = op.map(function (L) {
					return L.value;
				}).join('');
				if (Object.values(operators).includes(value)) {
					var subtype = Object.keys(operators)[Object.values(operators).indexOf(value)];
					return [new _token3.default(['operator', subtype], value, offset), this.accept_variable];
				} else {
					lexemes.unshift(new _lexeme2.default(value, offset));
					return this.handle_whitespace(lexemes);
				}
			}

			return this.handle_whitespace(lexemes, this.accept_binary_operator);
		}
	}, {
		key: 'accept_regexp',
		value: function accept_regexp(lexemes) {

			if (lexemes[0].value === operators.slash) {

				/**
     * Stream lexemes until we find the end of the string
     */
				var offset = lexemes[0].offset;

				var regex = [lexemes.shift()].concat(this.consume(lexemes, function (L) {
					return L.value === operators.slash;
				}));

				var flags = [lexemes.shift()].concat(this.consume(lexemes, function (L) {
					return !L.value.match(/\w+/);
				}));

				var value = regex.map(function (L) {
					return L.value;
				}).join('') + flags.map(function (L) {
					return L.value;
				}).join('');

				return [new _token3.default('regexp', value, offset), this.accept_conditional_operator];
			}

			return this.handle_whitespace(lexemes, this.accept_regexp);
		}
	}, {
		key: 'accept_string',
		value: function accept_string(lexemes) {

			if (lexemes[0].value === syntax_map.string) {

				/**
     * Stream lexemes until we find the end of the string
     */
				var offset = lexemes[0].offset;
				var string = [lexemes.shift()].concat(this.consume(lexemes, function (L) {
					return L.value === syntax_map.string;
				}));

				return [new _token3.default('string', string.map(function (L) {
					return L.value;
				}).join(''), offset), this.accept_conditional_operator];
			}

			return this.handle_whitespace(lexemes, this.accept_string);
		}
	}, {
		key: 'accept_conditional_operator',
		value: function accept_conditional_operator(lexemes) {

			if (this.keywords.includes(lexemes[0].value)) {
				var lexeme = lexemes.shift();
				return [new _token3.default(['operator', lexeme.value], lexeme.value, lexeme.offset), this.accept_expression];
			}

			return this.handle_whitespace(lexemes, this.accept_conditional_operator);
		}
	}, {
		key: 'accept_name',
		value: function accept_name(lexemes) {

			if (lexemes[0].value.match(/^[a-zA-Z_][\w_]*$/)) {
				var lexeme = lexemes.shift();
				return [new _token3.default('variable', lexeme.value, lexeme.offset), this.accept_binary_operator];
			}

			return this.handle_whitespace(lexemes, this.accept_name);
		}
	}, {
		key: 'accept_number',
		value: function accept_number(lexemes) {

			if (lexemes[0].value.match(/^\d$/)) {

				var offset = lexemes[0].offset;
				var number = this.consume(lexemes, function (L) {
					return !L.value.match(/^\d$/);
				});
				lexemes.unshift(number.pop());

				return [new _token3.default('number', number.map(function (L) {
					return L.value;
				}).join(''), offset), this.accept_conditional_operator];
			}

			return this.handle_whitespace(lexemes, this.accept_number);
		}
	}, {
		key: 'accept_block',
		value: function accept_block(lexemes) {

			if (lexemes[0].value === syntax_map.leftparen) {

				var start = lexemes.shift();
				var block = this.consume(lexemes, function (L) {
					return L.value === syntax_map.rightparen;
				});
				var end = block.pop();

				if (end.value !== syntax_map.rightparen) {
					block.push(end);
					end = null;
				}

				var tokens = [];
				var _token = void 0;
				var accept = this.tokenize;

				while (block.length > 0) {
					try {
						var _accept$call = accept.call(this, block);

						var _accept$call2 = _slicedToArray(_accept$call, 2);

						_token = _accept$call2[0];
						accept = _accept$call2[1];

						tokens.push(_token);
					} catch (e) {
						this.emit('error', _token);
					}
				}

				tokens.unshift(new _token3.default(['operator', 'leftparen'], start.value, start.offset));
				if (end) {
					tokens.push(new _token3.default(['operator', 'rightparen'], end.value, end.offset));
				}

				return [new _token3.default('block', tokens, start.offset), this.accept_conditional_operator];
			}

			return this.handle_whitespace(lexemes, this.accept_block);
		}
	}]);

	return GenericQLMode;
}(_mode2.default);

exports.default = GenericQLMode;
;

},{"../src/lexeme":3,"../src/mode":4,"../src/token":5}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

	function Mode() {
		_classCallCheck(this, Mode);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Mode).call(this));

		_this.lexemes = [];
		_this.keywords = [];
		_this.index;
		return _this;
	}

	_createClass(Mode, [{
		key: 'consume',
		value: function consume(lexemes, condition) {

			var item = void 0;
			var slice = [];

			while (item = lexemes.shift()) {
				slice.push(item);
				if (condition(item)) return slice;
			}

			return slice;
		}
	}, {
		key: 'tokenize',
		value: function tokenize(lexeme, list) {
			return this.get_token('unknown', lexeme);
		}
	}, {
		key: 'get_token',
		value: function get_token(type, lexeme) {
			return new _token2.default(type, lexeme.value, lexeme.offset);
		}
	}, {
		key: 'get_lexeme',
		value: function get_lexeme(value, offset) {
			return new _lexeme2.default(value, offset);
		}
	}, {
		key: 'set_index',
		value: function set_index(value) {
			this.index = value;
		}
	}, {
		key: 'get_index',
		value: function get_index() {
			return this.index;
		}
	}]);

	return Mode;
}(_emitter2.default);

exports.default = Mode;

},{"./emitter":2,"./lexeme":3,"./token":5}],5:[function(require,module,exports){
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