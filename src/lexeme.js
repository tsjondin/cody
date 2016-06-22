"use strict";

export default class Lexeme {

	constructor (value, offset)  {

		this.value = value;
		this.offset = offset;

		return Object.freeze(this);

	}

}
