"use strict";

export default class Cursor {

	constructor () {
		this.context;
	}

	get_offset () {
		throw new Error('Unimplemented function for Cursor base class');
	}

	set_context (context) {
		throw new Error('Unimplemented function for Cursor base class');
	}

}

