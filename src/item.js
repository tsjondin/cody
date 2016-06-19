"use strict";

export default class Item {

	constructor (token) {

		this.type = token.type;
		this.value = token.value;
		this.offset = token.offset;

		this.classes = [];
		this.attr = {};

	}

	set_attribute (key, value) {
		if (typeof(value) === 'undefined') delete this.attr[key];
		else this.attr[key] = value;
		return this;
	}

	get_attribute (key) {
		return this.attr[key];
	}

	get_type () {
		return this.type;
	}

	add_class (name) {
		if (!this.classes.includes(name)) this.classes.push(name);
		return this;
	}

	remove_class (name) {
		this.classes = this.classes.filter(C => (C != name));
		return this;
	}

	get_classes () {
		return this.classes.slice(0);
	}

}

