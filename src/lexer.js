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
	 * @param [<Lexeme>] lexemes
	 * @return [[<Token>] tokens, [<Token>] issues]
	 */
	evaluate (lexemes) {

		let token;
		let tokens = [];
		let issues = [];
		let accept = this.mode.tokenize;

		while (lexemes.length > 0) {
			try {
				[token, accept] = accept.call(this.mode, lexemes);
				tokens.push(token);
			} catch (e) {
				this.emit('error', token);
			}
		}

		return [tokens, issues];

	}

}
