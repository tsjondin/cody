"use strict";

import Renderer from '../src/renderer';
import Item from '../src/item';

export default class HTMLRenderer extends Renderer {

	constructor (editor) {

		super(editor);

		this.length_diff = 0;

		this.editor.on('invalid', () => {
			this.context.classList.remove('cody-valid');
			this.context.classList.add('cody-invalid');
		});

		this.editor.on('valid', () => {
			this.context.classList.remove('cody-invalid');
			this.context.classList.add('cody-valid');
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

			let offset = this.editor.cursor.get_offset();

			this.context.innerHTML = "";

			items.forEach(item => {
				this.context.appendChild(this.get_render(item));
			});

			if (this.length_diff < 0) {
				this.editor.cursor.set_offset(offset - this.length_diff);
			} else {
				this.editor.cursor.set_offset(offset + this.length_diff);
			}

		});
	}

	set_context (context) {

		this.context = context;
		this.context.className = 'cody';

		let length_down;

		this.context.addEventListener('keydown', () => {
			length_down = this.context.textContent.length;
		});

		this.context.addEventListener('keyup', () => {
			this.length_diff = this.context.textContent.length - length_down;
			this.editor.do_update(this.context.textContent);
		});

	}

}
