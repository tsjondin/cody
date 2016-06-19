"use strict";

import Lexer from './src/lexer';
import Stream from './src/stream';
import Emitter from './src/emitter';

import ArrayMutator from './src/arraymutator';
import Item from './src/item';

class Cody extends Emitter {

	constructor (options) {

		super();

		this.cursor = new options.cursor();
		this.renderer = new options.renderer();

		this.lexer = new Lexer();
		this.mode = new options.mode(this.lexer);
		this.lexer.set_mode(this.mode);

		this.lexer.on('lexeme', lexeme => this.emit('lexeme', lexeme));
		this.lexer.on('token', token => this.emit('token', token));

		this.cursor.set_context(options.context);
		this.renderer.set_context(options.context);

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

		let tokens = this.lexer.evaluate(this.lexemes);

		tokens.forEach(token => {
			let item = new Item(token);
			this.emit('item', item);
			this.renderer.do_render(item);
			return item;
		});

		return this;

	}

}

Cody.Renderers = {};
Cody.Cursors = {};

export default Cody;
