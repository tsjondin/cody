(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Cody||(g.Cody = {}));g=(g.Modes||(g.Modes = {}));g.genericql = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mode = require('../src/mode');

var _mode2 = _interopRequireDefault(_mode);

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
	'not-regex-match': '!~'
};

var syntax_map = {
	'string': '"',
	'leftbracket': '[',
	'rightbracket': ']',
	'leftparen': '(',
	'rightparen': ')',
	'leftbrace': '{',
	'rightbrace': '}',
	'dot': '.'
};

var operator_lexemes = Object.keys(operators).reduce(function (ops, K) {
	return ops.concat(operators[K].split(''));
}, []);

var GenericQLMode = function (_Mode) {
	_inherits(GenericQLMode, _Mode);

	function GenericQLMode() {
		_classCallCheck(this, GenericQLMode);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GenericQLMode).call(this));

		_this.lexemes = Object.keys(syntax_map).map(function (K) {
			return syntax_map[K];
		}).concat(operator_lexemes);

		_this.keywords = ['and', 'or'];

		return _this;
	}

	_createClass(GenericQLMode, [{
		key: 'tokenize',
		value: function tokenize(lexeme, lexemes, tokens) {

			var syntax_char = Object.keys(syntax_map).filter(function (K) {
				return syntax_map[K] === lexeme.value;
			});

			if (lexeme.value === syntax_map.string) {

				/**
     * Stream lexemes until we find the end of the string, then validate that
     * the string follows an operation
     */

				var string = this.get_lexeme([lexeme].concat(lexemes.until(function (L) {
					return L.value === syntax_map.string;
				})).map(function (L) {
					return L.value;
				}).join(''), lexeme.offset);

				if (tokens[tokens.length - 1].get_type().includes('operator')) return this.get_token('string', string);else return this.get_token(['string', 'invalid'], string);
			} else if (syntax_char.length == 1) {
				return this.get_token(syntax_char[0], lexeme);
			} else if (operator_lexemes.includes(lexeme.value)) {
				/**
     * Stream valid operator lexemes until we find one that isn't, backup the
     * stream and then validate the built operator
     */
				var op = this.get_lexeme([lexeme].concat(lexemes.until(function (L) {
					return !operator_lexemes.includes(L.value);
				})).slice(0, -1).map(function (L) {
					return L.value;
				}).join(''), lexeme.offset);

				lexemes.backward();
				if (Object.values(operators).includes(op.value)) {
					return this.get_token(['operator', Object.keys(operators)[Object.values(operators).indexOf(op.value)]], op);
				} else {
					return this.get_token(['operator', 'invalid'], op);
				}
			} else if (this.keywords.includes(lexeme.value)) {
				return this.get_token('keyword', lexeme);
			} else if (lexeme.value.match(/^[\w_][\w\d_]+$/)) {
				return this.get_token('variable', lexeme);
			} else if (lexeme.value.match(/^\d+$/)) {
				if (tokens[tokens.length - 1].get_type().includes('operator')) {
					return this.get_token('number', lexeme);
				} else {
					return this.get_token(['number', 'invalid'], lexeme);
				}
			} else if (lexeme.value.match(/^\s+$/)) {
				return this.get_token('whitespace', lexeme);
			}

			return this.get_token('invalid', lexeme);
		}
	}]);

	return GenericQLMode;
}(_mode2.default);

exports.default = GenericQLMode;
;

},{"../src/mode":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lexeme = function Lexeme(value, offset) {
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
	function Mode() {
		_classCallCheck(this, Mode);

		this.lexemes = [];
		this.keywords = [];
		this.index;
	}

	_createClass(Mode, [{
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
	function Token(type, value, offset) {
		_classCallCheck(this, Token);

		if (typeof type === 'string') type = [type];
		this.type = type;
		this.value = value;
		this.offset = offset;
	}

	_createClass(Token, [{
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