"use strict";

import Lexeme from './lexeme';
import Token from './token';
import Emitter from './emitter';

export default class Mode extends Emitter {

	constructor (setup) {

		super();

		this.keywords = setup.keywords || {};
		this.operators = setup.operators || {};
		this.symbols = setup.symbols || {};

		this.lexemes = [].concat(
			Object.values(this.symbols),
			Object.values(this.operators)
		);

	}

	consume (lexemes, condition) {

		let lexeme;
		let slice = [];

		while (lexeme = lexemes.shift()) {
			slice.push(lexeme);
			if (condition(lexeme)) return slice;
		}

		return slice;

	}

	match (lexemes, value) {
		return (lexemes[0] && lexemes[0].value === value);
	}

	includes (lexemes, list) {
		return (lexemes[0] && list.includes(lexemes[0].value));
	}

	consume_exclusive (lexemes, condition) {

		let lexeme;
		let slice = [];

		while (lexeme = lexemes.shift()) {
			if (condition(lexeme)) {
				this.revert(lexemes, lexeme);
				return slice;
			}
			slice.push(lexeme);
		}

		return slice;

	}

	revert (lexemes, lexeme) {
		lexemes.unshift(lexeme);
		return this;
	}

	tokenize (lexemes) {
		let lexeme = lexemes.shift();
		return [
			new Token('unknown', lexeme.value, lexeme.offset),
			this.tokenize
		];
	}

}
