"use strict";

export default class Token {

	constructor (type, value, offset, previous)  {

		this.offset = offset;
		this.type = [];
		this.value = value;

		this.set_type(type);
		this.previous = () => previous;

	}

	set_type (type) {
		if (typeof(type) === 'string') type = [type];
		this.type = type;
		return this;
	}

	add_type (type) {
		this.type.push(type);
		return this;
	}

	set_value (value) {
		this.value = value;
		return this;
	}

	get_type () {
		return this.type;
	}

	get_value () {
		return this.value;
	}

	get_offset () {
		return this.offset;
	}

}
