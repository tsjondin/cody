"use strict";

import Cursor from '../src/cursor';

export default class HTMLCursor extends Cursor {

	constructor (editor) {
		super(editor);
	}

	get_start_node () {
		return window.getSelection().anchorNode;
	}

	get_end_node () {
		return window.getSelection().focusNode;
	}

	get_offset () {

		let offset = 0;
		let range = window.getSelection().getRangeAt(0);
		let pre_range = range.cloneRange();

		pre_range.selectNodeContents(this.context);
		pre_range.setEnd(range.endContainer, range.endOffset);

		offset = pre_range.toString().length;
		return offset;

	}

	set_offset (offset) {

		let selection = getSelection();
		let range = document.createRange();

		let children = Array.prototype.slice.call(this.context.children, 0);
		let last;


		while (offset > 0) {
			if (children.length === 0) {
				offset = 0;
				break;
			} else {
				last = children.shift();
				if (last.children.length > 0) {
					children = Array.prototype.slice.call(last.children, 0).concat(children);
				} else {
					offset -= last.textContent.length;
				}
			}
		}

		offset = ((last.textContent.length) + offset) - 1;
		range.setStart(last.childNodes[0], offset);

		selection.removeAllRanges();
		selection.addRange(range);

	}

	set_context (context) {
		this.context = context;
	}

}

