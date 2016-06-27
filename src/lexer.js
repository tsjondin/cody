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
		if (!mode || typeof(mode.tokenize) != 'function')
			throw new TypeError('The Lexer requires a mode to be supplied');

		this.mode = mode;

	}

	/**
	 * Takes a Stream and returns a list of Lexeme's based on lexing rules
	 * defined in the Mode
	 *
	 * @param Stream stream The stream to parse
	 * @return [Lexeme] lexemes
	 */
	scan (stream) {

		let value = "";
		let lexemes = [];

		while (value = stream.next()) {

			if (value.match(/\s/)) value += stream.until(C => !C.match(/\s/));
			else if (this.mode.lexemes.indexOf(value) >= 0) value;
			else value += stream.until(C => (C.match(/\s/) || this.mode.lexemes.indexOf(C) >= 0));

			let lexeme = new Lexeme(value, stream.position() - value.length);
			this.emit('lexeme', lexeme);
			lexemes.push(lexeme);

		}

		return lexemes;

	}

	/**
	 * Takes a list of  Lexeme's, likely from the scan, and
	 * returns a list of Token's
	 *
	 * @param [Lexeme] lexemes
	 * @return [Token] tokens
	 */
	evaluate (lexemes) {

		let tokens = [];
		let accept = this.mode.tokenize;

		this.mode.on('token', token => this.emit('token', token));
		this.mode.on('error', token => this.emit('error', token));

		while (lexemes.length > 0) {

			let token;

			try {
				[token, accept] = accept.call(this.mode, lexemes);
				tokens.push(token);
				this.emit('token', token);
			} catch (error) {
				this.emit('error', token, error);
			}

		}

		return tokens;

	}

}
