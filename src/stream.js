"use strict";

export default class Stream {

	constructor (buffer) {
		this.buffer = buffer;
		this.position = -1;
	}

	next () {
		this.position++;
		if (this.buffer[this.position]) {
			return this.buffer[this.position];
		}
	}

	revert () {
		this.position--;
	}

	until (ch) {
		let rch, sequence = '';
		while (rch = this.next()) {
			if (rch === ch) return sequence;
			sequence += rch;
		}
		return sequence;
	}

}
