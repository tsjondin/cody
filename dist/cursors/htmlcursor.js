(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Cody||(g.Cody = {}));g=(g.Cursors||(g.Cursors = {}));g.htmlcursor = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cursor = require("../src/cursor");

var _cursor2 = _interopRequireDefault(_cursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLCursor = function (_Cursor) {
	_inherits(HTMLCursor, _Cursor);

	function HTMLCursor(editor) {
		_classCallCheck(this, HTMLCursor);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(HTMLCursor).call(this, editor));
	}

	_createClass(HTMLCursor, [{
		key: "get_start_node",
		value: function get_start_node() {
			return window.getSelection().anchorNode;
		}
	}, {
		key: "get_end_node",
		value: function get_end_node() {
			return window.getSelection().focusNode;
		}
	}, {
		key: "get_offset",
		value: function get_offset() {

			var offset = 0;
			var range = window.getSelection().getRangeAt(0);
			var pre_range = range.cloneRange();

			pre_range.selectNodeContents(this.context);
			pre_range.setEnd(range.endContainer, range.endOffset);

			offset = pre_range.toString().length;
			return offset;
		}
	}, {
		key: "set_offset",
		value: function set_offset(offset) {

			var selection = getSelection();
			var range = document.createRange();

			var children = Array.prototype.slice.call(this.context.children, 0);
			var last = void 0;

			while (offset > 0) {
				if (children.length === 0) {
					/* Place us at the last child */
					break;
				} else {
					last = children.shift();
					if (last.children.length > 0) {
						children = Array.prototype.slice.call(last.children, 0).concat(children);
					} else {
						offset -= last.textContent.length;
					}
				}
			}

			offset = last.textContent.length + offset - 1;
			range.setStart(last.childNodes[0], offset);

			selection.removeAllRanges();
			selection.addRange(range);
		}
	}, {
		key: "set_context",
		value: function set_context(context) {
			this.context = context;
		}
	}]);

	return HTMLCursor;
}(_cursor2.default);

exports.default = HTMLCursor;

},{"../src/cursor":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cursor = function () {
	function Cursor(editor) {
		_classCallCheck(this, Cursor);

		this.context;
		this.editor = editor;
		this.offset = 0;
	}

	_createClass(Cursor, [{
		key: 'get_offset',
		value: function get_offset() {
			throw new Error('Unimplemented function for Cursor base class');
		}
	}, {
		key: 'set_context',
		value: function set_context(context) {
			throw new Error('Unimplemented function for Cursor base class');
		}
	}]);

	return Cursor;
}();

exports.default = Cursor;

},{}]},{},[1])(1)
});