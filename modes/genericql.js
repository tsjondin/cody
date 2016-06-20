"use strict";

import Mode from '../src/mode';
import Token from '../src/token';
import Lexeme from '../src/lexeme';

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
	'not-regex-match': '!~',
	'dot': '.'
};

const syntax_map = {
	'string': '"',
	'leftbracket': '[',
	'rightbracket': ']',
	'leftparen': '(',
	'rightparen': ')',
	'leftbrace': '{',
	'rightbrace': '}'
};

const operator_lexemes = Object.keys(operators)
	.reduce((ops, K) => ops.concat(operators[K].split('')), []);

export default class GenericQLMode extends Mode {

	constructor (lexer) {

		super(lexer);

		this.lexemes = Object.keys(syntax_map)
			.map(K => (syntax_map[K]))
			.concat(operator_lexemes);

		this.keywords = [
			'and', 'or'
		];

	}

	tokenize (lexemes) {
		return (this.accept_name(lexemes) || this.accept_block(lexemes) || this.accept_invalid(lexemes));
	}

	accept_value (lexemes) {

		let result;

		if (result = this.accept_string(lexemes)) return result;
		else if (result = this.accept_number(lexemes)) return result;

	}

	accept_variable (lexemes) {

		let result;

		if (result = this.accept_name(lexemes)) return result;
		else if (result = this.accept_value(lexemes)) return result;

	}

	accept_string (lexemes) {

		if (lexemes[0].value === syntax_map.string) {

			/**
			 * Stream lexemes until we find the end of the string
			 */
			let offset = lexemes[0].offset;
			let string = [lexemes.shift()].concat(
				this.consume(lexemes, (L) => (L.value === syntax_map.string))
			);

			return [
				new Token('string', string.map(L => L.value).join(''), offset),
				this.accept_conditional_operator
			];

		}

	}

	accept_operator (lexemes) {

		if (operator_lexemes.includes(lexemes[0].value)) {

			/**
			 * Stream valid operator lexemes until we find one that isn't, backup the
			 * stream and then validate the built operator
			 */
			let offset = lexemes[0].offset;
			let op = this.consume(lexemes, L => (!operator_lexemes.includes(L.value)));
			lexemes.unshift(op.pop());

			let value = op.map(L => L.value).join('');
			if (Object.values(operators).includes(value)) {
				let subtype = Object.keys(operators)[Object.values(operators).indexOf(value)];
				return [
					new Token(['operator', subtype], value, offset),
					this.accept_variable
				];
			} else {
				return [
					new Token(['operator', 'invalid'], value, offset),
					this.accept_variable
				];
			}

		}

	}

	accept_conditional_operator (lexemes) {

		if (this.keywords.includes(lexemes[0].value)) {
			let lexeme = lexemes.shift();
			return [
				new Token(['operator', lexeme.value], lexeme.value, lexeme.offset),
				this.accept_expression
			];
		}

	}

	accept_expression (lexemes) {
		return this.accept_name(lexemes) || this.accept_block(lexemes) || this.accept_invalid(lexemes);
	}

	accept_name (lexemes) {

		if (lexemes[0].value.match(/^[a-zA-Z_][\w_]*$/)) {
			let lexeme = lexemes.shift();
			return [
				new Token('variable', lexeme.value, lexeme.offset),
				this.accept_operator
			];
		}

	}

	accept_number (lexemes) {
		if (lexemes[0].value.match(/^\d$/)) {

			let offset = lexemes[0].offset;
			let number = this.consume(lexemes, L => (!L.value.match(/^\d$/)));
			lexemes.unshift(number.pop());

			return [
				new Token('number', number.map(L => L.value).join(''), offset),
				this.accept_conditional_operator
			];
		}
	}

	accept_block (lexemes) {

		if (lexemes[0].value === syntax_map.leftparen) {

			let start = lexemes.shift();
			let block = this.consume(lexemes, (L) => (L.value === syntax_map.rightparen));
			let end = block.pop();
			if (end.value !== syntax_map.rightparen) {
				block.push(end);
				end = null;
			}

			let tokens = this.lexer.evaluate(block);

			tokens.unshift(new Token(['operator', 'leftparen'], start.value, start.offset));
			if (end) {
				tokens.push(new Token(['operator', 'rightparen'], end.value, end.offset));
			}

			return [
				new Token('block', tokens, start.offset),
				this.accept_conditional_operator
			];
		}

	}

	accept_invalid (lexemes) {
		let lexeme = lexemes.shift();
		return [
			new Token('invalid', lexeme.value, lexeme.offset),
			this.tokenize
		];
	}

};
