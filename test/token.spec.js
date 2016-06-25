"use strict";

let chai = require('chai');
let expect = chai.expect;

let Token = require('../src/token');

describe('Token', () => {

	describe('#constructor', () => {

		it('returns an instanceof Token when using string as type', () => {
			let token = new Token.default('thing');
			expect(token).to.be.an.instanceof(Token.default);
		});

		it('returns an instanceof Token when using array as type', () => {
			let token = new Token.default(['thing', 'stuff']);
			expect(token).to.be.an.instanceof(Token.default);
		});

		it('returns an instanceof Token with invalid flag set', () => {
			let token = new Token.default(['thing', 'stuff'], [], false);
			expect(token).to.be.an.instanceof(Token.default);
			expect(token.invalid).to.be.true;
		});

		it('returned instance is frozen', () => {
			let token = new Token.default('doodad');
			expect(token).to.be.froozen;
		});

	});

	describe('#properties', () => {

		let token = new Token.default(['thing', 'stuff']);

		it('can get the value', () => {
			expect(token.values).to.eql([]);
		});

		it('can get the type', () => {
			expect(token.type).to.eql(['thing', 'stuff']);
		});

		it('can get the is_token flag', () => {
			expect(token.is_token).to.be.true;
		});

		it('can get valid validity flag', () => {
			expect(token.valid).to.be.true;
		});

		it('can get invalid validity flag', () => {
			expect(token.invalid).to.be.false;
		});

		it('can get offset', () => {
			expect(token.offset).to.eql(0);
		});

	});

	describe('#immutability', () => {

		let token = new Token.default('doodad');

		it('cannot set the value', () => {
			expect(() => {
				token.values = [];
			}).to.throw(TypeError);
		});

		it('cannot set the type', () => {
			expect(() => {
				token.type = ['string'];
			}).to.throw(TypeError);
		});

		it('cannot set the is_token flag', () => {
			expect(() => {
				token.is_token = false;
			}).to.throw(TypeError);
		});

		it('cannot set valid validity flag', () => {
			expect(() => {
				token.valid = true;
			}).to.throw(TypeError);
		});

		it('cannot set invalid validity flag', () => {
			expect(() => {
				token.invalid = true;
			}).to.throw(TypeError);
		});

		it('cannot set offset', () => {
			expect(() => {
				token.offset = 10;
			}).to.throw(TypeError);
		});

	});

});
