"use strict";

import Cursor from '../src/cursor';

export default class HTMLCursor extends Cursor {

	constructor () {
		super();
		this.reflection = document.createElement('span');
		this.reflection.className = 'cody-cursor';
	}

	get_offset () {
		return 0;
	}

	set_context (context) {
		this.context = context;
		this.context.appendChild(this.reflection);
	}

}

