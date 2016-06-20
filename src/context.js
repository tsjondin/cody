"use strict";

export default class Context {

	constructor (editor, options) {
		this.editor = editor;
	}

	get_cursor_offset () {
		throw new Error('Unimplemented function for Context base class');
	}

	set_cursor_offset () {
		throw new Error('Unimplemented function for Context base class');
	}

	do_render () {
		throw new Error('Unimplemented function for Context base class');
	}

}
