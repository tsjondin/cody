"use strict";

export default class Lexeme {

	constructor (value, offset)  {

		Object.defineProperty(this, 'value', {
			configurable: false,
			enumerable: true,
			writable: false,
			value: value
		});

		Object.defineProperty(this, 'offset', {
			configurable: false,
			enumerable: true,
			writable: false,
			value: offset
		});

	}

}
