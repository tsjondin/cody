
"use strict";

import Context from '../src/context';
import Item from '../src/item';

export default class HTML extends Context {

	constructor (editor, options) {

		super(editor, options);

		this.node = options.node;
		this.node.className = 'cody';

		this.editor.on('invalid', () => {
			this.node.classList.remove('cody-valid');
			this.node.classList.add('cody-invalid');
		});

		this.editor.on('valid', () => {
			this.node.classList.remove('cody-invalid');
			this.node.classList.add('cody-valid');
		});

		let length_down;
		this.length_diff = 0;

		this.node.addEventListener('keydown', () => {
			length_down = this.node.textContent.length;
		});

		this.node.addEventListener('keyup', () => {
			this.length_diff = this.node.textContent.length - length_down;
			this.editor.do_update(this.node.textContent);
		});

	}

	get_render (item) {

		let node = document.createElement('span');
		let classes = item.get_classes();

		classes.unshift('cody-item');
		classes = classes.concat(
			item.get_type().map(C => ('cody-' + C))
		);

		node.className = classes.join(' ');

		if (Array.isArray(item.value)) {
			item.value.map(
				token => this.get_render(new Item(token))
			).map(node.appendChild.bind(node));
		} else {
			node.textContent = item.value;
		}

		return node;

	}

	do_render (items) {

		window.requestAnimationFrame(() => {

			let offset = this.get_cursor_offset();

			this.node.innerHTML = "";

			items.forEach(item => {
				this.node.appendChild(this.get_render(item));
			});

			if (this.length_diff < 0) {
				this.set_cursor_offset(offset - this.length_diff);
			} else {
				this.set_cursor_offset(offset + this.length_diff);
			}

		});
	}

	get_cursor_offset () {

		let offset = 0;
		let range = window.getSelection().getRangeAt(0);
		let pre_range = range.cloneRange();

		pre_range.selectNodeContents(this.node);
		pre_range.setEnd(range.endContainer, range.endOffset);

		offset = pre_range.toString().length;
		return offset;

	}

	set_cursor_offset (offset) {

		let selection = getSelection();
		let range = document.createRange();

		let children = Array.prototype.slice.call(this.node.children, 0);
		let last;


		while (offset > 0) {
			if (children.length === 0) {
				/* Place us at the last child */
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

}

