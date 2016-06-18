"use strict";

export default class Renderer {

	constructor () {
		this.context;
	}

	do_render () {
		throw new Error('Unimplemented function for Renderer base class');
	}

	set_context () {
		throw new Error('Unimplemented function for Renderer base class');
	}

}
