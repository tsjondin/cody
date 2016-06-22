"use strict";

export default class Token {

	constructor (type, values, valid = true)  {

		if (typeof(type) === 'string') type = [type];

		Object.defineProperty(this, 'is_token', {
			configurable: false,
			enumerable: true,
			writable: false,
			value: true
		});

		Object.defineProperty(this, 'type', {
			configurable: false,
			enumerable: true,
			writable: false,
			value: type
		});

		Object.defineProperty(this, 'offset', {
			configurable: false,
			enumerable: true,
			writable: false,
			value: values[0].offset
		});

		Object.defineProperty(this, 'values', {
			configurable: false,
			enumerable: true,
			writable: false,
			value: values
		});

		Object.defineProperty(this, 'invalid', {
			configurable: false,
			enumerable: true,
			writable: false,
			value: !valid
		});

		Object.defineProperty(this, 'valid', {
			configurable: false,
			enumerable: true,
			writable: false,
			value: valid
		});

	}

}
