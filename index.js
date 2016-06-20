"use strict";

import Lexer from './src/lexer';
import Stream from './src/stream';
import Emitter from './src/emitter';
import Mode from './src/mode';
import Context from './src/context';

import Item from './src/item';

class Cody extends Emitter {

	constructor (options) {

		super();

		if (!options.mode.class)
			throw new Error('Cody cannot operate without a Mode');
		else if (!options.context.class)
			throw new Error('Cody cannot operate without a Context');

		this.context = new options.context.class(this, options.context.options);
		this.mode = new options.mode.class(options.mode.options);

		this.lexer = new Lexer(this.mode);

		this.lexer.on('lexeme', lexeme => this.emit('lexeme', lexeme));
		this.lexer.on('token', token => this.emit('token', token));
		this.lexer.on('error', token => this.emit('error', token));

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

		let items = [];

		try {

			let [tokens, issues] = this.lexer.evaluate(
				this.lexemes
			);

			items = tokens.map(token => {
				let item = new Item(token);
				this.emit('item', item);
				return item;
			});

			if (issues.length > 0) {
				this.emit('invalid', issues);
			} else {
				this.emit('valid');
			}

		} catch (e) {
			this.emit('error', e);
		}

		this.context.do_render(items);
		return this;

	}

}

Cody.Contexts = {};
export default Cody;
