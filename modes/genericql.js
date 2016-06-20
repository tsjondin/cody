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
	'dot': '.',
	'slash': '/',
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

export default class GenericQLMode extends Mode {

	constructor () {

		super();

		this.lexemes = Object.values(syntax_map)
			.concat(Object.values(operators));

		this.keywords = [
			'and', 'or'
		];

	}

	tokenize (lexemes) {
		return this.accept_expression(lexemes);
	}

	handle_invalid (lexemes) {
		let lexeme = lexemes.shift();
		return [
			(new Token('invalid', lexeme.value, lexeme.offset)).set_invalid(true),
			this.tokenize
		];
	}

	handle_whitespace (lexemes, accept) {
		if (lexemes[0].value.match(/^\s+$/)) {
			let lexeme = lexemes.shift();
			return [new Token('whitespace', lexeme.value, lexeme.offset), accept];
		} else {
			return this.handle_invalid(lexemes);
		}
	}

	accept_value (lexemes) {

		let [token, accept] = this.accept_string(lexemes);

		if (token.type.includes('whitespace'))
			return [token, this.accept_value];
		else if (token.invalid) {
			lexemes.unshift(new Lexeme(token.value, token.offset));
			[token, accept] = this.accept_number(lexemes);
			if (token.invalid) {
				lexemes.unshift(new Lexeme(token.value, token.offset));
				[token, accept] = this.accept_regexp(lexemes);
			}
		}

		return [token, accept];

	}

	accept_variable (lexemes) {

		let [token, accept] = this.accept_name(lexemes);

		if (token.type.includes('whitespace'))
			return [token, this.accept_variable];
		if (token.invalid) {
			lexemes.unshift(new Lexeme(token.value, token.offset));
			[token, accept] = this.accept_value(lexemes);
		}

		return [token, accept];

	}

	accept_expression (lexemes) {

		let token_block, token_lh, token_op, token_rh, accept;
		[token_block, accept] = this.accept_block(lexemes);

		if (token_block.type.includes('whitespace'))
			return [token_block, this.accept_expression];
		else if (!token_block.invalid) {
			return [token_block, accept];
		} else {

			let tokens = [];

			lexemes.unshift(new Lexeme(token_block.value, token_block.offset));
			[token_lh, accept] = this.accept_variable(lexemes);

			if (token_lh.type.includes('whitespace')) {
				tokens.push(token_lh);
				[token_lh, accept] = this.accept_variable(lexemes);
			}
			tokens.push(token_lh);

			if (lexemes.length === 0) {
				return [
					new Token('expression', tokens, tokens[0].offset),
					this.accept_operator
				];
			}


			let whitespace;
			[token_op, accept] = this.accept_binary_operator(lexemes);
			if (token_op.type.includes('whitespace')) {
				tokens.push(token_op);
				whitespace = token_op;
				[token_op, accept] = this.accept_binary_operator(lexemes);
			}

			if (!token_op.type.includes('operator')) {
				lexemes.unshift(new Lexeme(token_op.value, token_op.offset));
				return [
					new Token('expression', tokens, tokens[0].offset),
					this.accept_operator
				];
			}
			tokens.push(token_op);


			[token_rh, accept] = this.accept_variable(lexemes);
			if (token_rh.type.includes('whitespace')) {
				tokens.push(token_rh);
				[token_rh, accept] = this.accept_variable(lexemes);
			}
			tokens.push(token_rh);

			let type = ['expression'];
			if (token_lh.invalid || token_op.invalid || token_rh.invalid)
				type.push('invalid');

			return [
				new Token(type, tokens, token_lh.offset),
				this.accept_operator
			];

		}

		return [token, accept];

	}

	accept_operator (lexemes) {

		let [token, accept] = this.accept_conditional_operator(lexemes);

		if (token.type.includes('whitespace'))
			return [token, this.accept_operator];
		else if (token.invalid) {
			lexemes.unshift(new Lexeme(token.value, token.offset));
			[token, accept] = this.accept_binary_operator(lexemes);
		}

		return [token, accept];

	}

	accept_binary_operator (lexemes) {

		let opkeys = Object.values(operators)
		if (opkeys.includes(lexemes[0].value)) {

			/**
			 * Stream valid operator lexemes until we find one that isn't, backup the
			 * stream and then validate the built operator
			 */
			let offset = lexemes[0].offset;
			let op = this.consume(lexemes, L => (!opkeys.includes(L.value)));
			lexemes.unshift(op.pop());

			let value = op.map(L => L.value).join('');
			if (Object.values(operators).includes(value)) {
				let subtype = Object.keys(operators)[Object.values(operators).indexOf(value)];
				return [
					new Token(['operator', subtype], value, offset),
					this.accept_variable
				];
			} else {
				lexemes.unshift(new Lexeme(value, offset));
				return this.handle_whitespace(lexemes);
			}

		}

		return this.handle_whitespace(lexemes, this.accept_binary_operator);

	}

	accept_regexp (lexemes) {

		if (lexemes[0].value === operators.slash) {

			/**
			 * Stream lexemes until we find the end of the string
			 */
			let offset = lexemes[0].offset;

			let regex = [lexemes.shift()].concat(
				this.consume(lexemes, (L) => (L.value === operators.slash))
			);

			let flags = [lexemes.shift()].concat(
				this.consume(lexemes, (L) => (!L.value.match(/\w+/)))
			);

			let value = regex.map(L => L.value).join('') + flags.map(L => L.value).join('');

			return [
				new Token('regexp', value, offset),
				this.accept_conditional_operator
			];

		}

		return this.handle_whitespace(lexemes, this.accept_regexp);

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

		return this.handle_whitespace(lexemes, this.accept_string);

	}

	accept_conditional_operator (lexemes) {

		if (this.keywords.includes(lexemes[0].value)) {
			let lexeme = lexemes.shift();
			return [
				new Token(['operator', lexeme.value], lexeme.value, lexeme.offset),
				this.accept_expression
			];
		}

		return this.handle_whitespace(lexemes, this.accept_conditional_operator);

	}

	accept_name (lexemes) {

		if (lexemes[0].value.match(/^[a-zA-Z_][\w_]*$/)) {
			let lexeme = lexemes.shift();
			return [
				new Token('variable', lexeme.value, lexeme.offset),
				this.accept_binary_operator
			];
		}

		return this.handle_whitespace(lexemes, this.accept_name);

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

		return this.handle_whitespace(lexemes, this.accept_number);

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

			let tokens = [];
			let token;
			let accept = this.tokenize;

			while (block.length > 0) {
				try {
					[token, accept] = accept.call(this, block);
					tokens.push(token);
				} catch (e) {
					this.emit('error', token);
				}
			}

			tokens.unshift(new Token(['operator', 'leftparen'], start.value, start.offset));
			if (end) {
				tokens.push(new Token(['operator', 'rightparen'], end.value, end.offset));
			}

			return [
				new Token('block', tokens, start.offset),
				this.accept_conditional_operator
			];

		}

		return this.handle_whitespace(lexemes, this.accept_block);

	}


};
