(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.Cody||(g.Cody = {}));g=(g.Renderers||(g.Renderers = {}));g.htmlrenderer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('../src/renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _item = require('../src/item');

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLRenderer = function (_Renderer) {
	_inherits(HTMLRenderer, _Renderer);

	function HTMLRenderer(editor) {
		_classCallCheck(this, HTMLRenderer);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HTMLRenderer).call(this, editor));

		_this.length_diff = 0;

		_this.editor.on('invalid', function () {
			_this.context.classList.remove('cody-valid');
			_this.context.classList.add('cody-invalid');
		});

		_this.editor.on('valid', function () {
			_this.context.classList.remove('cody-invalid');
			_this.context.classList.add('cody-valid');
		});

		return _this;
	}

	_createClass(HTMLRenderer, [{
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
			}

			return node;
		}
	}, {
		key: 'do_render',
		value: function do_render(items) {
			var _this3 = this;

			window.requestAnimationFrame(function () {

				var offset = _this3.editor.cursor.get_offset();

				_this3.context.innerHTML = "";

				items.forEach(function (item) {
					_this3.context.appendChild(_this3.get_render(item));
				});

				if (_this3.length_diff < 0) {
					_this3.editor.cursor.set_offset(offset - _this3.length_diff);
				} else {
					_this3.editor.cursor.set_offset(offset + _this3.length_diff);
				}
			});
		}
	}, {
		key: 'set_context',
		value: function set_context(context) {
			var _this4 = this;

			this.context = context;
			this.context.className = 'cody';

			var length_down = void 0;

			this.context.addEventListener('keydown', function () {
				length_down = _this4.context.textContent.length;
			});

			this.context.addEventListener('keyup', function () {
				_this4.length_diff = _this4.context.textContent.length - length_down;
				_this4.editor.do_update(_this4.context.textContent);
			});
		}
	}]);

	return HTMLRenderer;
}(_renderer2.default);

exports.default = HTMLRenderer;

},{"../src/item":2,"../src/renderer":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = function () {
	function Renderer(editor) {
		_classCallCheck(this, Renderer);

		this.context;
		this.editor = editor;
	}

	_createClass(Renderer, [{
		key: 'do_render',
		value: function do_render() {
			throw new Error('Unimplemented function for Renderer base class');
		}
	}, {
		key: 'set_context',
		value: function set_context() {
			throw new Error('Unimplemented function for Renderer base class');
		}
	}]);

	return Renderer;
}();

exports.default = Renderer;

},{}]},{},[1])(1)
});