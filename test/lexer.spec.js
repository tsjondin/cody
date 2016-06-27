"use strict";

let chai = require('chai');
let expect = chai.expect;

const Mode = require('../src/mode');
const Stream = require('../src/stream');
const Lexer = require('../src/lexer');
const Token = require('../src/token');

describe('Lexer', () => {

	class Dummy extends Mode.default {

		constructor () {
			super();
		}

		tokenize (lexemes) {
			let lexeme = lexemes.shift();
			return [
				new Token.default('dummy', [lexeme]),
				this.tokenize
			];
		}

	}

	describe('#constructor', () => {

		it('returns an instanceof lexer', () => {
			let lexer = new Lexer.default(new Dummy());
			expect(lexer).to.be.an.instanceof(Lexer.default);
		});

		it('requires a mode', () => {
			expect(() => {
				let lexer = new Lexer.default();
			}).to.throw(TypeError);
		});

	});

	describe('#scan', () => {

		it('can scan a string and return lexemes', () => {
			let lexer = new Lexer.default(new Dummy());
			let lexemes = lexer.scan(new Stream.default('my scanned string'));
			expect(lexemes.length).to.eql(5);
		});

	});

	describe('#evaluate', () => {

		it('can evaluate an array of lexemes', () => {

			let lexer = new Lexer.default(new Dummy());
			let lexemes = lexer.scan(new Stream.default('my scanned string'));
			let first = lexemes[0];
			let tokens = lexer.evaluate(lexemes);

			expect(tokens.length).to.eql(5);
			tokens.forEach(T => {
				expect(T.type).to.eql(['dummy']);
			});

			expect(tokens[0].values).to.eql([first]);

		});
	});

});
