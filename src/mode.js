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

	match (lexemes, value) {
		return (lexemes[0] && lexemes[0].value.match(value));
	}

	equals (lexemes, value) {
		return (lexemes[0] && lexemes[0].value === value);
	}

	includes (lexemes, list) {
		return (lexemes[0] && list.includes(lexemes[0].value));
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

	consume_exclusive (lexemes, condition) {

		let lexeme;
		let slice = [];

		while (lexeme = lexemes.shift()) {
			if (condition(lexeme)) {
				this.revert(lexemes, [lexeme]);
				return slice;
			}
			slice.push(lexeme);
		}

		return slice;

	}

	revert (lexemes, values) {
		values.forEach(V => lexemes.unshift(V));
		return this;
	}

	tokenize (lexemes) {
		let lexeme = lexemes.shift();
		return [
			new Token('unknown', [lexeme], lexeme.offset),
			this.tokenize
		];
	}

}
