"use strict";

export default class Item {

	constructor (type, value, offset) {

		this.type = type;
		this.value = value;
		this.offset = offset;

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

