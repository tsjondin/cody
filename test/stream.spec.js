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

		it('must take a string as its buffer argument', () => {
			expect(() => {
				let stream = new Stream.default();
			}).to.throw(TypeError);
		});

	});

	describe('#current', () => {

		it('returns the current value of the buffer', () => {
			let stream = new Stream.default("123");
			expect(stream.current()).to.eql("1");
		});

		it('returns undefined when the buffer length has been exceeded', () => {
			let stream = new Stream.default("");
			expect(stream.current()).to.be.undefined;
		});

	});

	describe('#forward', () => {

		it('moves the position in the stream forward', () => {
			let stream = new Stream.default("123");
			stream.forward();
			expect(stream.current()).to.eql('2');
		});

	});

	describe('#backward', () => {

		it('moves the position in the stream backward', () => {
			let stream = new Stream.default("123");
			let segment = stream.until(character => (character === '3'));
			expect(segment).to.eql('12');
			stream.backward();
			expect(stream.current()).to.eql('2');
		});

	});

	describe('#until', () => {

		it('can stream until condition is met', () => {
			let stream = new Stream.default("A stream of things");
			let segment = stream.until(character => (character === 'o'));
			expect(segment).to.eql('A stream ');
		});

		it('returns the remainder of the buffer if the condition is never met', () => {
			let stream = new Stream.default("A stream of things");
			let segment = stream.until(character => (character === 'o'));
			let remainder = stream.until(character => (character === '!'));
			expect(remainder).to.eql('of things');
		});

	});

});
