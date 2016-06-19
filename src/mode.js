"use strict";

import Lexeme from './lexeme';
import Token from './token';

export default class Mode {

	constructor (lexer) {
		this.lexer = lexer;
		this.lexemes = [];
		this.keywords = [];
		this.index;
	}

	consume (lexemes, condition) {

		let item;
		let slice = [];

		while (item = lexemes.shift()) {
			slice.push(item);
			if (condition(item)) return slice;
		}

		/**
		 * The way this occurs is at end-of-stream
		 */
		return slice.concat(['end']);

	}

	tokenize (lexeme, list) {
		return this.get_token('unknown', lexeme);
	}

	get_token (type, lexeme) {
		return new Token(type, lexeme.value, lexeme.offset);
	}

	get_lexeme (value, offset) {
		return new Lexeme(value, offset);
	}

	set_index (value) {
		this.index = value;
	}

	get_index () {
		return this.index;
	}

}
