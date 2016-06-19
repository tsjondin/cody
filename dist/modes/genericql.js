(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Cody||(g.Cody = {}));g=(g.Modes||(g.Modes = {}));g.genericql = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mode = require('../src/mode');

var _mode2 = _interopRequireDefault(_mode);

var _token = require('../src/token');

var _token2 = _interopRequireDefault(_token);

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
	'dot': '.'
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

var operator_lexemes = Object.keys(operators).reduce(function (ops, K) {
	return ops.concat(operators[K].split(''));
}, []);

var GenericQLMode = function (_Mode) {
	_inherits(GenericQLMode, _Mode);

	function GenericQLMode(lexer) {
		_classCallCheck(this, GenericQLMode);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GenericQLMode).call(this, lexer));

		_this.lexemes = Object.keys(syntax_map).map(function (K) {
			return syntax_map[K];
		}).concat(operator_lexemes);

		_this.keywords = ['and', 'or'];

		return _this;
	}

	_createClass(GenericQLMode, [{
		key: 'tokenize',
		value: function tokenize(lexemes) {
			return this.accept_name(lexemes) || this.accept_block(lexemes) || this.accept_invalid(lexemes);
		}
	}, {
		key: 'accept_value',
		value: function accept_value(lexemes) {

			var result = void 0;

			if (result = this.accept_string(lexemes)) return result;else if (result = this.accept_number(lexemes)) return result;
		}
	}, {
		key: 'accept_variable',
		value: function accept_variable(lexemes) {

			var result = void 0;

			if (result = this.accept_name(lexemes)) return result;else if (result = this.accept_value(lexemes)) return result;
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

				return [new _token2.default('string', string.map(function (L) {
					return L.value;
				}).join(''), offset), this.accept_conditional_operator];
			}
		}
	}, {
		key: 'accept_operator',
		value: function accept_operator(lexemes) {

			if (operator_lexemes.includes(lexemes[0].value)) {

				/**
     * Stream valid operator lexemes until we find one that isn't, backup the
     * stream and then validate the built operator
     */
				var offset = lexemes[0].offset;
				var op = this.consume(lexemes, function (L) {
					return !operator_lexemes.includes(L.value);
				});
				lexemes.unshift(op.pop());

				var value = op.map(function (L) {
					return L.value;
				}).join('');
				if (Object.values(operators).includes(value)) {
					var subtype = Object.keys(operators)[Object.values(operators).indexOf(value)];
					return [new _token2.default(['operator', subtype], value, offset), this.accept_variable];
				} else {
					return [new _token2.default(['operator', 'invalid'], value, offset), this.accept_variable];
				}
			}
		}
	}, {
		key: 'accept_conditional_operator',
		value: function accept_conditional_operator(lexemes) {

			if (this.keywords.includes(lexemes[0].value)) {
				var lexeme = lexemes.shift();
				return [new _token2.default(['operator', lexeme.value], lexeme.value, lexeme.offset), this.accept_expression];
			}
		}
	}, {
		key: 'accept_expression',
		value: function accept_expression(lexemes) {
			return this.accept_name(lexemes) || this.accept_block(lexemes) || this.accept_invalid(lexemes);
		}
	}, {
		key: 'accept_name',
		value: function accept_name(lexemes) {

			if (lexemes[0].value.match(/^[a-zA-Z_][\w_]+$/)) {
				var lexeme = lexemes.shift();
				return [new _token2.default('variable', lexeme.value, lexeme.offset), this.accept_operator];
			}
		}
	}, {
		key: 'accept_number',
		value: function accept_number(lexemes) {
			if (lexemes[0].value.match(/\d/)) {

				var offset = lexemes[0].offset;
				var number = this.consume(lexemes, function (L) {
					return !L.value.match(/\d/);
				});
				lexemes.unshift(number.pop());

				return [new _token2.default('number', number.map(function (L) {
					return L.value;
				}).join(''), offset), this.accept_conditional_operator];
			}
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

				var tokens = this.lexer.evaluate(block);
				tokens.push(new _token2.default(['operator', 'rightparen'], end.value, end.offset));
				tokens.unshift(new _token2.default(['operator', 'leftparen'], start.value, start.offset));

				return [new _token2.default('block', tokens, start.offset), this.accept_conditional_operator];
			}
		}
	}, {
		key: 'accept_invalid',
		value: function accept_invalid(lexemes) {
			var lexeme = lexemes.shift();
			return [new _token2.default('invalid', lexeme.value, lexeme.offset), this.tokenize];
		}
	}]);

	return GenericQLMode;
}(_mode2.default);

exports.default = GenericQLMode;
;

},{"../src/lexeme":2,"../src/mode":3,"../src/token":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lexeme = require('./lexeme');

var _lexeme2 = _interopRequireDefault(_lexeme);

var _token = require('./token');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mode = function () {
	function Mode(lexer) {
		_classCallCheck(this, Mode);

		this.lexer = lexer;
		this.lexemes = [];
		this.keywords = [];
		this.index;
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

			/**
    * The way this occurs is at end-of-stream
    */
			return slice.concat(['end']);
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
}();

exports.default = Mode;

},{"./lexeme":2,"./token":4}],4:[function(require,module,exports){
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

		this.set_type(type);
		this.previous = function () {
			return previous;
		};
	}

	_createClass(Token, [{
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