"use strict";

export default class Token {

	constructor (type, values, valid = true)  {

		if (typeof(type) === 'string') type = [type];

		this.is_token = true;
		this.type = type;
		this.offset = values[0].offset;
		this.values = values;
		this.invalid = !valid;
		this.valid = valid;

		return Object.freeze(this);

	}

}
