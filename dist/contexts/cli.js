(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Cody||(g.Cody = {}));g=(g.Contexts||(g.Contexts = {}));g.cli = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _context = require("../src/context");

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CLI = function (_Context) {
	_inherits(CLI, _Context);

	function CLI(editor) {
		_classCallCheck(this, CLI);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(CLI).call(this, editor));
	}

	_createClass(CLI, [{
		key: "render",
		value: function render(leaf) {

			var value = leaf.values.map(function (L) {
				return L.value;
			}).join('');
			var style = "";
			var reset = "";

			if (leaf.type.includes('string')) {
				style = "\x1b[32m";
				reset = "\x1b[0m";
			} else if (leaf.type.includes('variable')) {
				style = "\x1b[36m";
				reset = "\x1b[0m";
			} else if (leaf.type.includes('operator')) {
				style = "\x1b[33m";
				reset = "\x1b[0m";
			} else if (leaf.type.includes('regexp')) {
				style = "\x1b[35m";
				reset = "\x1b[0m";
			} else if (leaf.type.includes('number')) {
				style = "\x1b[31m";
				reset = "\x1b[0m";
			}

			global.process.stdout.write(style + value + reset);
		}
	}, {
		key: "recursive_render",
		value: function recursive_render(tokens) {
			var _this2 = this;

			tokens.forEach(function (token) {
				if (token.values.every(function (V) {
					return V.is_token;
				})) {
					_this2.recursive_render(token.values);
				} else {
					_this2.render(token);
				}
			});
		}
	}, {
		key: "do_render",
		value: function do_render(tokens) {

			this.recursive_render(tokens);
			global.process.stdout.write("\n");
		}
	}]);

	return CLI;
}(_context2.default);

exports.default = CLI;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/context":2}],2:[function(require,module,exports){
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

},{}]},{},[1])(1)
});