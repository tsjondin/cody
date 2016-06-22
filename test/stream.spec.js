"use strict";

let chai = require('chai');
let expect = chai.expect;

let Stream = require('../src/stream');

describe('Stream', () => {
	describe('#constructor', () => {

		it('returns an instanceof stream', () => {
			let stream = new Stream.default("123");
			expect(stream).to.be.an.instanceof(Stream.default);
		});

		it('can get the current value', () => {
			let stream = new Stream.default("123");
			expect(stream.current()).to.eql("1");
		});

		it('can move the position forward', () => {
			let stream = new Stream.default("123");
			stream.forward();
			expect(stream.current()).to.eql('2');
		});

		it('can stream until condition is met', () => {
			let stream = new Stream.default("A stream of things");
			let segment = stream.until(character => (character === 'o'));
			expect(segment).to.eql('A stream ');
		});

		it('can move backwards in the stream', () => {
			let stream = new Stream.default("123");
			let segment = stream.until(character => (character === '3'));
			expect(segment).to.eql('12');
			stream.backward();
			expect(stream.current()).to.eql('2');
		});

		it('will fail', () => {
			let stream = new Stream.default("123");
			let segment = stream.until(character => (character === '3'));
			expect(segment).to.eql('12');
			stream.backward();
			expect(stream.current()).to.eql('1');
		});

	});
});
