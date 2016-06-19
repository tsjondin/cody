"use strict";

import Emitter from './emitter';

import Token from './token';
import Lexeme from './lexeme';

export default class Lexer extends Emitter {

	/**
	 * Constructs a new Lexer
	 *
	 * @param Mode mode
	 */
	constructor (mode)  {
		super();
		this.mode;
	}

	set_mode (mode) {
		this.mode = mode;
	}

	/**
	 * Takes a Stream and returns a list of Lexeme's based on lexing rules
	 * defined in the Mode
	 *
	 * @param Stream stream The stream to parse
	 * @param Function callback Called for every Lexeme found in stream
	 * @return Array<Lexeme> lexemes
	 */
	scan (stream, callback) {

		let ch;
		let ws = "";
		let value = "";

		let lexemes = [];

		let new_lexeme = (value, stream) => {
			let L = new Lexeme(value, (stream.position - value.length) + 1);
			this.emit('lexeme', L);
			return L;
		};

		while (ch = stream.next()) {

			if (this.mode.lexemes.indexOf(ch) >= 0) {

				if (ws.length > 0) {
					lexemes.push(new_lexeme(ws, stream));
					ws = "";
				}

				if (value.length > 0) {
					lexemes.push(new_lexeme(value, stream));
					value = "";
				}

				lexemes.push(new_lexeme(ch, stream));

			} else if (ch === ' ') {


				if (value.length > 0) {
					if (ws.length > 0) {
						lexemes.push(new_lexeme(ws, stream));
						ws = "";
					}
					lexemes.push(new_lexeme(value, stream));
					value = "";
				}

				ws += ch;
			} else value += ch;

		}

		if (ws.length > 0) {
			lexemes.push(new_lexeme(ws, stream));
		}

		if (value.length > 0) {
			lexemes.push(new_lexeme(value, stream));
		}

		return lexemes;

	}

	/**
	 * Takes a list of  Lexeme's, likely from the scan, and
	 * returns a list of Token's
	 *
	 * @param Array<Lexeme> lexemes
	 * @return Array<Token>
	 */
	evaluate (lexemes) {

		let token;
		let tokens = [];
		let accept = this.mode.tokenize;

		while (lexemes.length > 0) {

			if (lexemes[0] === 'end') break;
			if (lexemes[0].value.match(/\s+/)) {
				let lexeme = lexemes.shift();
				token = new Token('whitespace', lexeme.value, lexeme.offset);
			} else {
				let result = accept.call(this.mode, lexemes);
				[token, accept] = result;
			}

			this.emit('token', token);
			tokens.push(token);

		}

		return tokens;

	}

}
