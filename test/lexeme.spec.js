"use strict";

let chai = require('chai');
let expect = chai.expect;

let Lexeme = require('../src/lexeme');

describe('Lexeme', () => {

	describe('#constructor', () => {

		it('returns an instanceof Lexeme', () => {
			let lexeme = new Lexeme.default('thing', 0);
			expect(lexeme).to.be.an.instanceof(Lexeme.default);
		});

		it('returned instance is frozen', () => {
			let lexeme = new Lexeme.default('thing', 0);
			expect(lexeme).to.be.froozen;
		});

	});

	describe('#properties', () => {

		let lexeme = new Lexeme.default('thing', 0);

		it('can get the value', () => {
			expect(lexeme.value).to.eql('thing');
		});

		it('can get the offset', () => {
			expect(lexeme.offset).to.eql(0);
		});

	});

	describe('#immutability', () => {

		let lexeme = new Lexeme.default('thing', 0);

		it('cannot set the value', () => {
			expect(() => {
				lexeme.value = 'other thing';
			}).to.throw(TypeError);
		});

		it('cannot set offset', () => {
			expect(() => {
				lexeme.offset = 10;
			}).to.throw(TypeError);
		});

	});

});
