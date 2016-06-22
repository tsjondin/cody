(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Cody||(g.Cody = {}));g=(g.Contexts||(g.Contexts = {}));g.html = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _context = require('../src/context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTML = function (_Context) {
	_inherits(HTML, _Context);

	function HTML(editor, options) {
		_classCallCheck(this, HTML);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HTML).call(this, editor, options));

		var pre_offset = 0;
		var length_diff = 0;

		_this.node = options.node;
		_this.node.className = 'cody';

		_this.editor.on('invalid', function () {
			_this.node.classList.remove('cody-valid');
			_this.node.classList.add('cody-invalid');
		});

		_this.editor.on('valid', function () {
			_this.node.classList.remove('cody-invalid');
			_this.node.classList.add('cody-valid');
		});

		var do_update = false;
		_this.node.addEventListener('keydown', function (event) {
			if (event.key === 'Enter') {
				event.preventDefault();
				return false;
			} else if (!event.key.match(/^Arrow/)) {
				pre_offset = _this.get_cursor_offset();
				length_diff = _this.node.textContent.length;
				do_update = true;
			}
		});

		var cursor_marked = void 0;
		_this.node.addEventListener('keyup', function (event) {

			if (do_update) {
				_this.editor.do_update(_this.node.textContent);
			}

			var cursor_node = _this.get_cursor_node();

			if (cursor_marked) {
				_this.remove_element_mark(cursor_marked);
				cursor_marked = null;
			}

			if (cursor_node.nodeName === '#text') {
				cursor_marked = cursor_node.parentElement;
				_this.set_element_mark(cursor_marked);
			}
		});

		_this.editor.on('postrender', function () {
			if (do_update) {
				var diff = _this.node.textContent.length - length_diff;
				_this.set_cursor_offset(pre_offset + diff);
				do_update = false;
			}
		});

		_this.node.addEventListener('mouseover', function (event) {
			_this.set_element_mark(event.originalTarget);
		});

		_this.node.addEventListener('mouseout', function (event) {
			_this.remove_element_mark(event.originalTarget);
		});

		return _this;
	}

	_createClass(HTML, [{
		key: 'get_elements',
		value: function get_elements(selector) {
			var nodes = this.node.querySelectorAll(selector);
			return Array.prototype.slice.call(nodes, 0);
		}
	}, {
		key: 'get_elements_with_value',
		value: function get_elements_with_value(value) {
			return this.get_elements('.cody-variable[data-value="' + value + '"]');
		}
	}, {
		key: 'set_element_mark',
		value: function set_element_mark(target) {
			if (target.tagName === 'SPAN') {
				if (target.classList.contains('cody-variable')) {
					this.get_elements_with_value(target.getAttribute('data-value')).forEach(function (element) {
						element.classList.add('cody-mark');
					});
				} else if (target.classList.contains('cody-leftparen')) {
					target.classList.add('cody-mark');
					target.parentNode.lastChild.classList.add('cody-mark');
				} else if (target.classList.contains('cody-rightparen')) {
					target.classList.add('cody-mark');
					target.parentNode.firstChild.classList.add('cody-mark');
				}
			}
		}
	}, {
		key: 'remove_element_mark',
		value: function remove_element_mark(target) {
			if (target.tagName === 'SPAN') {
				if (target.classList.contains('cody-variable')) {
					this.get_elements_with_value(target.getAttribute('data-value')).forEach(function (element) {
						element.classList.remove('cody-mark');
					});
				} else if (target.classList.contains('cody-leftparen')) {
					target.classList.remove('cody-mark');
					target.parentNode.lastChild.classList.remove('cody-mark');
				} else if (target.classList.contains('cody-rightparen')) {
					target.classList.remove('cody-mark');
					target.parentNode.firstChild.classList.remove('cody-mark');
				}
			}
		}
	}, {
		key: 'get_render',
		value: function get_render(token) {
			var _this2 = this;

			var node = document.createElement('span');
			var classes = token.type;

			classes.unshift('token');
			classes = classes.map(function (C) {
				return 'cody-' + C;
			});

			node.className = classes.join(' ');
			token.values.map(function (value) {
				if (value.is_token) return _this2.get_render(value);
				return document.createTextNode(value.value);
			}).map(node.appendChild.bind(node));

			return node;
		}
	}, {
		key: 'do_render',
		value: function do_render(tokens) {
			var _this3 = this;

			window.requestAnimationFrame(function () {

				_this3.node.innerHTML = "";

				tokens.forEach(function (token) {
					if (token.type.includes('end')) return;
					_this3.node.appendChild(_this3.get_render(token));
				});

				_this3.editor.emit('postrender');
			});
		}
	}, {
		key: 'get_cursor_node',
		value: function get_cursor_node() {
			return window.getSelection().focusNode;
		}
	}, {
		key: 'get_cursor_offset',
		value: function get_cursor_offset() {

			var offset = 0;
			var range = window.getSelection().getRangeAt(0);
			var pre_range = range.cloneRange();

			pre_range.selectNodeContents(this.node);
			pre_range.setEnd(range.endContainer, range.endOffset);

			offset = pre_range.toString().length;
			return offset;
		}
	}, {
		key: 'get_cursor_offset_node',
		value: function get_cursor_offset_node(offset) {

			var children = Array.prototype.slice.call(this.node.children, 0);
			var last = void 0;

			if (children.length === 0) {
				return [this.node, 0];
			}

			while (offset >= 0) {
				if (children.length === 0) break;else {
					last = children.shift();
					if (last.children.length > 0) {
						children = Array.prototype.slice.call(last.children, 0).concat(children);
					} else {
						offset -= last.textContent.length;
					}
				}
			}

			offset = last.textContent.length + offset;
			if (last.childNodes[0]) last = last.childNodes[0];

			return [last, offset];
		}
	}, {
		key: 'set_cursor_offset',
		value: function set_cursor_offset(offset) {

			var selection = getSelection();
			var range = document.createRange();

			var _get_cursor_offset_no = this.get_cursor_offset_node(offset);

			var _get_cursor_offset_no2 = _slicedToArray(_get_cursor_offset_no, 2);

			var focus = _get_cursor_offset_no2[0];
			var focus_offset = _get_cursor_offset_no2[1];


			try {
				range.setStart(focus, focus_offset);
			} catch (e) {
				/* Likely an invalid offset error, set to end of focus node, this should
     * never happen but it currently does */
				range.setStart(focus, focus.textContent.length);
			}

			selection.removeAllRanges();
			selection.addRange(range);
		}
	}]);

	return HTML;
}(_context2.default);

exports.default = HTML;

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