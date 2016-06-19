(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Cody||(g.Cody = {}));g=(g.Modes||(g.Modes = {}));g.genericql = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lexeme_map;

var _mode = require('../src/mode');

var _mode2 = _interopRequireDefault(_mode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var operators = ['=', '!', '>', '<', '~', '^', '!=', '<=', '>=', '~~', '!~', '!~~', '!=~', '+', '-', '/', '*', '%'];

var ESCAPE = '\\';

var lexeme_map = (_lexeme_map = {
	STRING_DELIM: '"',
	LEFT_BRACKET: '[',
	RIGHT_BRACKET: ']',
	LEFT_PAREN: '(',
	RIGHT_PAREN: ')',
	LEFT_BRACE: '['
}, _defineProperty(_lexeme_map, 'LEFT_BRACE', '['), _defineProperty(_lexeme_map, 'DOT', '['), _lexeme_map);

var lexemes = Object.keys(lexeme_map).map(function (K) {
	return lexeme_map[K];
}).concat(operators);

var keywords = ['and', 'or'];

var GenericQLMode = function (_Mode) {
	_inherits(GenericQLMode, _Mode);

	function GenericQLMode() {
		_classCallCheck(this, GenericQLMode);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GenericQLMode).call(this));

		_this.lexemes = lexemes;
		_this.keywords = keywords;

		return _this;
	}

	_createClass(GenericQLMode, [{
		key: 'tokenize',
		value: function tokenize(lexeme, buffer, index) {

			if (lexeme.value === '[') return this.get_token('l_bracket', lexeme);else if (lexeme.value === ']') return this.get_token('r_bracket', lexeme);else if (lexeme.value === '(') return this.get_token('l_paren', lexeme);else if (lexeme.value === ')') return this.get_token('r_paren', lexeme);else if (lexeme.value === '{') return this.get_token('l_brace', lexeme);else if (lexeme.value === '}') return this.get_token('r_brace', lexeme);else if (lexeme.value === '.') return this.get_token('dot', lexeme.value, lexeme.offset);else if (lexeme.value === lexeme_map.STRING_DELIM) {
				return this.get_token('string', this.get_lexeme([lexeme].concat(buffer.until(function (L) {
					return L.value === lexeme_map.STRING_DELIM;
				})).map(function (L) {
					return L.value;
				}).join(''), lexeme.offset));
			} else if (operators.includes(lexeme.value)) {
				var token = this.get_token('operator', this.get_lexeme([lexeme].concat(buffer.until(function (L) {
					return !operators.includes(L.value);
				})).slice(0, -1).map(function (L) {
					return L.value;
				}).join(''), lexeme.offset));
				buffer.backward();
				return token;
			} else if (keywords.includes(lexeme.value)) {
				return this.get_token('keyword', lexeme);
			} else if (lexeme.value.match(/^[\w_][\w\d_]+$/)) {
				return this.get_token('variable', lexeme);
			} else if (lexeme.value.match(/^\d+$/)) {
				return this.get_token('number', lexeme);
			} else if (lexeme.value.match(/^\s+$/)) {
				return this.get_token('whitespace', lexeme);
			}

			return this.get_token('unknown', lexeme);
		}
	}]);

	return GenericQLMode;
}(_mode2.default);

exports.default = GenericQLMode;
;

if (global) global.GenericQLMode = GenericQLMode;else if (window) window.GenericQLMode = GenericQLMode;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Token = function Token(type, value, offset) {
	_classCallCheck(this, Token);

	this.type = type;
	this.value = value;
	this.offset = offset;
};

exports.default = Token;

},{}]},{},[1])(1)
});