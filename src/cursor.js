"use strict";

export default class Cursor {

	constructor (editor) {
		this.context;
		this.editor = editor;
		this.offset = 0;
	}

	get_offset () {
		throw new Error('Unimplemented function for Cursor base class');
	}

	set_context (context) {
		throw new Error('Unimplemented function for Cursor base class');
	}

}

