(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Cody||(g.Cody = {}));g=(g.Contexts||(g.Contexts = {}));g.html = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _context = require('../src/context');

var _context2 = _interopRequireDefault(_context);

var _item = require('../src/item');

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTML = function (_Context) {
	_inherits(HTML, _Context);

	function HTML(editor, options) {
		_classCallCheck(this, HTML);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HTML).call(this, editor, options));

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

		var length_down = void 0;
		_this.length_diff = 0;

		_this.node.addEventListener('keydown', function () {
			length_down = _this.node.textContent.length;
		});

		_this.node.addEventListener('keyup', function () {
			_this.length_diff = _this.node.textContent.length - length_down;
			_this.editor.do_update(_this.node.textContent);
		});

		var cursor_marked = void 0;
		_this.node.addEventListener('keyup', function () {

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
		value: function get_render(item) {
			var _this2 = this;

			var node = document.createElement('span');
			var classes = item.get_classes();

			classes.unshift('cody-item');
			classes = classes.concat(item.get_type().map(function (C) {
				return 'cody-' + C;
			}));

			node.className = classes.join(' ');

			if (Array.isArray(item.value)) {
				item.value.map(function (token) {
					return _this2.get_render(new _item2.default(token));
				}).map(node.appendChild.bind(node));
			} else {
				node.textContent = item.value;
				node.setAttribute('data-value', item.value);
			}

			return node;
		}
	}, {
		key: 'do_render',
		value: function do_render(items) {
			var _this3 = this;

			window.requestAnimationFrame(function () {

				var offset = _this3.get_cursor_offset();

				_this3.node.innerHTML = "";

				items.forEach(function (item) {
					_this3.node.appendChild(_this3.get_render(item));
				});

				if (_this3.length_diff < 0) {
					_this3.set_cursor_offset(offset - _this3.length_diff);
				} else {
					_this3.set_cursor_offset(offset + _this3.length_diff);
				}
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

			while (offset > 0) {
				if (children.length === 0) break;else {
					last = children.shift();
					if (last.children.length > 0) {
						children = Array.prototype.slice.call(last.children, 0).concat(children);
					} else {
						offset -= last.textContent.length;
					}
				}
			}

			offset = last.textContent.length + offset - 1;
			return last;
		}
	}, {
		key: 'set_cursor_offset',
		value: function set_cursor_offset(offset) {

			var selection = getSelection();
			var range = document.createRange();
			var focus = this.get_cursor_offset_node(offset);

			var focusnode = focus.childNodes[0];
			if (!focusnode) focusnode = focus;

			try {
				range.setStart(focusnode, offset);
			} catch (e) {
				/* Likely an invalid offset error, set to end of focus node, this should
     * never happen but it currently does */
				range.setStart(focusnode, focus.textContent.length);
			}

			selection.removeAllRanges();
			selection.addRange(range);
		}
	}]);

	return HTML;
}(_context2.default);

exports.default = HTML;

},{"../src/context":2,"../src/item":3}],2:[function(require,module,exports){
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

},{}]},{},[1])(1)
});