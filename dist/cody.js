(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lexer = require('./src/lexer');

var _lexer2 = _interopRequireDefault(_lexer);

var _stream = require('./src/stream');

var _stream2 = _interopRequireDefault(_stream);

var _emitter = require('./src/emitter');

var _emitter2 = _interopRequireDefault(_emitter);

var _arraymanipulator = require('./src/arraymanipulator');

var _arraymanipulator2 = _interopRequireDefault(_arraymanipulator);

var _item = require('./src/item');

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cody = function (_Emitter) {
	_inherits(Cody, _Emitter);

	function Cody(mode) {
		_classCallCheck(this, Cody);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Cody).call(this));

		_this.mode = new mode();
		_this.lexer = new _lexer2.default(_this.mode);

		_this.lexer.on('lexeme', function (lexeme) {
			return _this.emit('lexeme', lexeme);
		});
		_this.lexer.on('token', function (token) {
			return _this.emit('token', token);
		});

		_this.stream;

		return _this;
	}

	_createClass(Cody, [{
		key: 'update',
		value: function update() {
			var _this2 = this;

			var stream = new _stream2.default('[services] (host.name ~~ "^web" or description ~~ "web") and state != 0');

			var lexemes = new _arraymanipulator2.default(this.lexer.scan(stream));
			var tokens = this.lexer.evaluate(lexemes);

			var items = tokens.map(function (T) {
				var item = new _item2.default(T.type, T.value, T.offset);
				_this2.emit('item', item);
				return item;
			});

			return this;
		}
	}]);

	return Cody;
}(_emitter2.default);

if (global) {
	global.Cody = Cody;
} else if (window) {
	window.Cody = Cody;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/arraymanipulator":2,"./src/emitter":3,"./src/item":4,"./src/lexer":6,"./src/stream":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArrayManipulator = function () {
	function ArrayManipulator(array) {
		_classCallCheck(this, ArrayManipulator);

		var pointer = -1;

		this.position = function () {
			return pointer;
		};
		this.move = function (position) {
			return pointer = position;
		};
		this.get = function (index) {
			return array[index];
		};
		this.insert = function (value) {
			return array.splice(pointer, 0, value);
		};
	}

	_createClass(ArrayManipulator, [{
		key: "forward",
		value: function forward() {
			this.move(this.position() + 1);
			return this;
		}
	}, {
		key: "backward",
		value: function backward() {
			this.move(this.position() - 1);
			return this;
		}
	}, {
		key: "reset",
		value: function reset() {
			this.move(-1);
			return this;
		}
	}, {
		key: "next",
		value: function next() {
			this.forward();
			return this.current();
		}
	}, {
		key: "current",
		value: function current() {
			return this.get(this.position());
		}
	}, {
		key: "until",
		value: function until(condition) {

			var sublist = [];
			var item = void 0;

			while (item = this.next()) {
				if (condition(item)) break;
				sublist.push(item);
			}

			return sublist;
		}
	}]);

	return ArrayManipulator;
}();

exports.default = ArrayManipulator;

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
	function Item(type, value, offset) {
		_classCallCheck(this, Item);

		this.type = type;
		this.value = value;
		this.offset = offset;

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

var Lexeme = function Lexeme(value, offset) {
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

var _token = require('./token');

var _token2 = _interopRequireDefault(_token);

var _lexeme2 = require('./lexeme');

var _lexeme3 = _interopRequireDefault(_lexeme2);

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
				var _lexeme = new _lexeme3.default(value, stream.position - value.length + 1);
				_this2.emit('lexeme', _lexeme);
				return _lexeme;
			};

			while (ch = stream.next()) {

				if (this.mode.lexemes.indexOf(ch) >= 0) {

					if (ws.length > 0) {
						lexemes.push(new_lexeme(ws, stream));
						ws = "";
					} else if (value.length > 0) {
						lexemes.push(new_lexeme(value, stream));
						value = "";
					}

					lexemes.push(new_lexeme(ch, stream));
				} else if (ch === ' ') {
					if (value.length > 0) {
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
   * Takes an ArrayManipulator instance of Lexeme's, likely from the scan, and
   * returns a list of Token's
   *
   * @param ArrayManipulator<Lexeme> lexemes
   * @param Function callback Called for every Token tokenized
   * @return Array<Token>
   */

	}, {
		key: 'evaluate',
		value: function evaluate(lexemes, callback) {

			var tokens = [];
			var lexeme = void 0;

			while (lexeme = lexemes.next()) {
				var token = this.mode.tokenize(lexeme, lexemes);
				this.emit('token', token);
				tokens.push(token);
			}

			return tokens;
		}
	}]);

	return Lexer;
}(_emitter2.default);

exports.default = Lexer;

},{"./emitter":3,"./lexeme":5,"./token":8}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}]},{},[1]);
