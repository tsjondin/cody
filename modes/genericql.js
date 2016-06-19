"use strict";

import Mode from '../src/mode';

if (!Object.values) {
	Object.values = (o) => Object.keys(o).map(K => o[K]);
}

const operators = {
	'equals': '=',
	'negate': '!',
	'higher-than': '>',
	'lower-than': '<',
	'not-equals': '!=',
	'lower-than-or-equals': '<=',
	'higher-than-or-equals': '>=',
	'regex-match': '~',
	'not-regex-match': '!~'
};

const syntax_map = {
	'string': '"',
	'leftbracket': '[',
	'rightbracket': ']',
	'leftparen': '(',
	'rightparen': ')',
	'leftbrace': '{',
	'rightbrace': '}',
	'dot': '.'
};

const operator_lexemes = Object.keys(operators)
	.reduce((ops, K) => ops.concat(operators[K].split('')), []);

export default class GenericQLMode extends Mode {

	constructor () {

		super();

		this.lexemes = Object.keys(syntax_map)
			.map(K => (syntax_map[K]))
			.concat(operator_lexemes);

		this.keywords = [
			'and', 'or'
		];

	}

	tokenize (lexeme, lexemes, tokens) {

		let syntax_char = Object.keys(syntax_map)
			.filter(K => (syntax_map[K] === lexeme.value));

		if (lexeme.value === syntax_map.string) {

			/**
			 * Stream lexemes until we find the end of the string, then validate that
			 * the string follows an operation
			 */

			let string = this.get_lexeme(
				[lexeme].concat(
					lexemes.until(
						L => (L.value === syntax_map.string)
					)
				).map(L => L.value).join(''),
					lexeme.offset
			);

			if (tokens[tokens.length - 1].get_type().includes('operator'))
				return this.get_token('string', string);
			else return this.get_token(['string', 'invalid'], string);

		} else if (syntax_char.length == 1) {
			return this.get_token(syntax_char[0], lexeme);
		} else if (operator_lexemes.includes(lexeme.value)) {
			/**
			 * Stream valid operator lexemes until we find one that isn't, backup the
			 * stream and then validate the built operator
			 */
			let op = this.get_lexeme(
				[lexeme].concat(lexemes.until(
					L => (!operator_lexemes.includes(L.value))
				)).slice(0, -1).map(L => L.value).join(''),
					lexeme.offset
			);

			lexemes.backward();
			if (Object.values(operators).includes(op.value)) {
				return this.get_token(['operator', Object.keys(operators)[Object.values(operators).indexOf(op.value)]], op);
			} else {
				return this.get_token(['operator', 'invalid'], op);
			}

		} else if (this.keywords.includes(lexeme.value)) {
			return this.get_token('keyword', lexeme);
		} else if (lexeme.value.match(/^[\w_][\w\d_]+$/)) {
			return this.get_token('variable', lexeme);
		} else if (lexeme.value.match(/^\d+$/)) {
			if (tokens[tokens.length - 1].get_type().includes('operator')) {
				return this.get_token('number', lexeme);
			} else {
				return this.get_token(['number', 'invalid'], lexeme);
			}
		} else if (lexeme.value.match(/^\s+$/)) {
			return this.get_token('whitespace', lexeme);
		}

		return this.get_token('invalid', lexeme);

	}

};
