
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

		let cursor_marked;
		this.node.addEventListener('keyup', () => {

			let cursor_node = this.get_cursor_node();

			if (cursor_marked) {
				this.remove_element_mark(cursor_marked);
				cursor_marked = null;
			}

			if (cursor_node.nodeName === '#text') {
				cursor_marked = cursor_node.parentElement;
				this.set_element_mark(cursor_marked);
			}
		});

		this.node.addEventListener('mouseover', event => {
			this.set_element_mark(event.originalTarget);
		});

		this.node.addEventListener('mouseout', event => {
			this.remove_element_mark(event.originalTarget);
		});

	}

	get_elements (selector) {
		let nodes = this.node.querySelectorAll(selector);
		return Array.prototype.slice.call(nodes, 0);
	}

	get_elements_with_value (value) {
		return this.get_elements(`.cody-variable[data-value="${value}"]`);
	}

	set_element_mark (target) {
		if (target.tagName === 'SPAN') {
			if (target.classList.contains('cody-variable')) {
				this.get_elements_with_value(target.getAttribute('data-value')).forEach(element => {
					element.classList.add('cody-mark');
				});
			} else if (target.classList.contains('cody-leftparen')) {
				target.classList.add('cody-mark');
				target.parentNode.lastChild.classList.add('cody-mark');
			} else if (target.classList.contains('cody-rightparen')) {
				target.classList.add('cody-mark');
				target.parentNode.firstChild.classList.add('cody-mark');
			}
		}
	}

	remove_element_mark (target) {
		if (target.tagName === 'SPAN') {
			if (target.classList.contains('cody-variable')) {
				this.get_elements_with_value(target.getAttribute('data-value')).forEach(element => {
					element.classList.remove('cody-mark');
				});
			} else if (target.classList.contains('cody-leftparen')) {
				target.classList.remove('cody-mark');
				target.parentNode.lastChild.classList.remove('cody-mark');
			} else if (target.classList.contains('cody-rightparen')) {
				target.classList.remove('cody-mark');
				target.parentNode.firstChild.classList.remove('cody-mark');
			}
		}
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
			node.setAttribute('data-value', item.value);
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

	get_cursor_node () {
		return window.getSelection().focusNode;
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

	get_cursor_offset_node (offset) {

		let children = Array.prototype.slice.call(this.node.children, 0);
		let last;

		while (offset > 0) {
			if (children.length === 0) break;
			else {
				last = children.shift();
				if (last.children.length > 0) {
					children = Array.prototype.slice.call(last.children, 0).concat(children);
				} else {
					offset -= last.textContent.length;
				}
			}
		}

		offset = ((last.textContent.length) + offset) - 1;
		if (last.childNodes[0]) last = last.childNodes[0];

		return [last, offset];

	}

	set_cursor_offset (offset) {

		let selection = getSelection();
		let range = document.createRange();
		let [focus, focus_offset] = this.get_cursor_offset_node(offset);

		try {
			range.setStart(focus, focus_offset);
		} catch (e) {
			console.log("fial");
			/* Likely an invalid offset error, set to end of focus node, this should
			 * never happen but it currently does */
			range.setStart(focus, focus.textContent.length);
		}

		selection.removeAllRanges();
		selection.addRange(range);

	}

}

