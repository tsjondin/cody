"use strict";

import Renderer from '../src/renderer';

export default class HTMLRenderer extends Renderer {

	constructor () {

		super();

		this.container = document.createElement('div');
		this.container.className = 'cody';

	}


	do_render (item) {

		let node = document.createElement('span');
		let classes = item.get_classes();

		classes.unshift('cody-item-' + item.get_type());
		node.className = classes.join(' ');

		node.textContent = item.value;
		this.container.appendChild(node);

	}

	set_context (context) {

		this.context = context;
		this.context.appendChild(this.container);

	}

}
