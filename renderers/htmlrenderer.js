"use strict";

import Renderer from '../src/renderer';
import Item from '../src/item';

export default class HTMLRenderer extends Renderer {

	constructor () {

		super();

		this.container = document.createElement('div');
		this.container.className = 'cody';

	}


	do_render (item) {

		if (Array.isArray(item.value)) {
			return item.value.forEach(
				token => this.do_render(new Item(token))
			);
		}

		let node = document.createElement('span');
		let classes = item.get_classes();

		classes.unshift('cody-item');
		classes = classes.concat(
			item.get_type().map(C => ('cody-' + C))
		);

		node.className = classes.join(' ');
		node.textContent = item.value;

		this.container.appendChild(node);

	}

	set_context (context) {

		this.context = context;
		this.context.appendChild(this.container);

	}

}