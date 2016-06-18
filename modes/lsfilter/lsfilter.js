"use strict";

import Mode from '../../src/mode';

const operators = [
	'=', '!', '>',
	'<', '~', '^',
	'!=', '<=', '>=',
	'~~', '!~', '!~~',
	'!=~', '+', '-',
	'/', '*', '%'
];

const ESCAPE = '\\';
const lexeme_map = {
	STRING_DELIM: '"',
	LEFT_BRACKET: '[',
	RIGHT_BRACKET: ']',
	LEFT_PAREN: '(',
	RIGHT_PAREN: ')',
	LEFT_BRACE: '[',
	LEFT_BRACE: '[',
	DOT: '['
};

const lexemes = Object.keys(lexeme_map)
	.map(K => (lexeme_map[K]))
	.concat(operators);

const keywords = [
	'and',
	'or'
];

export default class LSFilterMode extends Mode {

	constructor () {

		super();
		this.lexemes = lexemes;
		this.keywords = keywords;

	}

	tokenize (lexeme, buffer, index) {

		if (lexeme.value === '[') return this.get_token('l_bracket', lexeme);
		else if (lexeme.value === ']') return this.get_token('r_bracket', lexeme);
		else if (lexeme.value === '(') return this.get_token('l_paren', lexeme);
		else if (lexeme.value === ')') return this.get_token('r_paren', lexeme);
		else if (lexeme.value === '{') return this.get_token('l_brace', lexeme);
		else if (lexeme.value === '}') return this.get_token('r_brace', lexeme);
		else if (lexeme.value === '.') return this.get_token('dot', lexeme.value, lexeme.offset);
		else if (lexeme.value === lexeme_map.STRING_DELIM) {
			return this.get_token(
				'string',
				this.get_lexeme(
					buffer.until(
						L => (L.value === lexeme_map.STRING_DELIM)
					).map(L => L.value).join(''),
					lexeme.offset
				)
			);
		} else if (operators.includes(lexeme.value)) {
			let token = this.get_token(
				'operator',
				this.get_lexeme(
					[lexeme].concat(buffer.until(
						L => (!operators.includes(L.value))
					)).map(L => L.value).join(''),
					lexeme.offset
				)
			);
			buffer.backward();
			return token;
		} else if (keywords.includes(lexeme.value)) {
			return this.get_token('keyword', lexeme);
		} else if (lexeme.value.match(/^[\w_][\w\d_]+$/)) {
			return this.get_token('variable', lexeme);
		} else if (lexeme.value.match(/^\d+$/)) {
			return this.get_token('number', lexeme);
		} else if (lexeme.value.match(/^\s+$/)) {
			return this.get_token('whitespace', lexeme);
		}

		return this.get_token('unknown', lexeme);

	}

};

