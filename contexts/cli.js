"use strict";

import Context from "../src/context";
export default class CLI extends Context {

	constructor (editor)  {
		super(editor);
	}

	render (leaf) {

		let value = leaf.values.map(L => L.value).join('');
		let style = "";
		let reset = "";

		if (leaf.type.includes('string')) {
			style = "\x1b[32m";
			reset = "\x1b[0m";
		} else if (leaf.type.includes('variable')) {
			style = "\x1b[36m";
			reset = "\x1b[0m";
		} else if (leaf.type.includes('operator')) {
			style = "\x1b[33m";
			reset = "\x1b[0m";
		} else if (leaf.type.includes('regexp')) {
			style = "\x1b[35m";
			reset = "\x1b[0m";
		} else if (leaf.type.includes('number')) {
			style = "\x1b[31m";
			reset = "\x1b[0m";
		}


		global.process.stdout.write(style + value + reset);

	}

	recursive_render (tokens) {

		tokens.forEach(token => {
			if (token.values.every(V => V.is_token)) {
				this.recursive_render(token.values);
			} else {
				this.render(token);
			}
		});

	}

	do_render (tokens) {

		this.recursive_render(tokens);
		global.process.stdout.write("\n");

	}

}
