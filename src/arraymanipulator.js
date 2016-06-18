"use strict";

export default class ArrayManipulator {

	constructor (array) {

		let pointer = -1;

		this.position = () => pointer;
		this.move = position => (pointer = position);
		this.get = index => array[index];
		this.insert = value => array.splice(pointer, 0, value);

	}

	forward () {
		this.move(this.position() + 1);
		return this;
	}

	backward () {
		this.move(this.position() - 1);
		return this;
	}

	reset () {
		this.move(-1);
		return this;
	}

	next () {
		this.forward();
		return this.current();
	}

	current () {
		return this.get(this.position());
	}

	until (condition) {

			let sublist = [];
			let item;

			while (item = this.next()) {
				if (condition(item)) break;
				sublist.push(item);
			}

			return sublist;

	}



}
