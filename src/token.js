"use strict";

export default class Token {

	constructor (type, value, offset)  {
		if (typeof(type) === 'string') type = [type];
		this.type = type;
		this.value = value;
		this.offset = offset
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
