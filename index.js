"use strict";

import Lexer from './src/lexer';
import Stream from './src/stream';
import Emitter from './src/emitter';

import ArrayMutator from './src/arraymutator';
import Item from './src/item';

class Cody extends Emitter {

	constructor (mode) {

		super();

		this.mode = new mode();
		this.lexer = new Lexer(this.mode);

		this.lexer.on('lexeme', lexeme => this.emit('lexeme', lexeme));
		this.lexer.on('token', token => this.emit('token', token));

		this.stream = new Stream("");
		this.lexemes = [];

	}

	get_diff (L1, L2) {
		return [].concat(
			L1.reduce((D, L, i) => {
				if (!L2[i] || L.value !== L2[i].value || L.offset !== L2[i].offset)
					D.push(L);
				return D;
			}, []),
			L2.reduce((D, L, i) => {
				if (!L1[i] || L.value !== L1[i].value || L.offset !== L1[i].offset)
					D.push(L);
				return D;
			}, [])
		);
	}

	do_update (text, force = false) {

		if (!force) {

			let diff;

			if (text === this.stream.buffer) return;
			this.stream = new Stream(text);

			let new_lexemes = this.lexer.scan(this.stream);
			if ((diff = this.get_diff(this.lexemes, new_lexemes)).length === 0) return;
			this.lexemes = new_lexemes;

		} else {
			this.stream = new Stream(text);
			this.lexemes = this.lexer.scan(stream);
		}

		console.log("updating");

		let tokens = this.lexer.evaluate(
			new ArrayMutator(this.lexemes)
		);

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