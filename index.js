"use strict";

import Lexer from './src/lexer';
import Stream from './src/stream';
import Emitter from './src/emitter';

import ArrayManipulator from './src/arraymanipulator';
import Item from './src/item';

class Cody extends Emitter {

	constructor (mode) {

		super();

		this.mode = new mode();
		this.lexer = new Lexer(this.mode);

		this.lexer.on('lexeme', lexeme => this.emit('lexeme', lexeme));
		this.lexer.on('token', token => this.emit('token', token));

		this.stream;

	}

	update () {

		let stream = new Stream(`[services] (host.name ~~ "^web" or description ~~ "web") and state != 0`);

		let lexemes = new ArrayManipulator(this.lexer.scan(stream));
		let tokens = this.lexer.evaluate(lexemes);

		let items = tokens.map(T => {
			let item = new Item(T.type, T.value, T.offset);
			this.emit('item', item);
			return item;
		});

		return this;

	}

}

if (global) {
	global.Cody = Cody;
} else if (window) {
	window.Cody = Cody;
}
