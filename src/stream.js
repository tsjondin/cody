"use strict";

export default class Stream {

	constructor (buffer) {

		if (typeof(buffer) != 'string')
			throw new TypeError("Stream buffer must be of type 'string'");

		let position = 0;

		this.forward = () => {
			position++;
		}

		this.backward = () => {
			position--;
		}

		this.current = () => {
			return buffer[position];
		}

		this.rewind = () => {
			position = 0;
		}

	}

	next () {
		let current = this.current();
		this.forward();
		return current;
	}

	until (condition) {
		let character, buffer = '';
		while (character = this.next()) {
			if (condition(character)) {
				this.backward();
				return buffer;
			}
			buffer += character;
		}
		return buffer;
	}

}

