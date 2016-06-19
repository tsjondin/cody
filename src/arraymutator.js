"use strict";

export default class ArrayMutator {

	constructor (array) {

		let pointer = array.length - 1;

		this.position = () => pointer;
		this.move = position => (pointer = position);
		this.get = index => array[index];
		this.insert = value => array.splice(pointer, 0, value);

		this.push = value => {
			array.push(value);
			this.move(array.length - 1);
		};

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

	last () {
		return this.get(this.position() - 1);
	}

	current () {
		return this.get(this.position());
	}

	until (condition) {

			let sublist = [];
			let item;

			while (item = this.next()) {
				if (condition(item)) {
					sublist.push(item);
					break;
				}
				sublist.push(item);
			}

			return sublist;

	}



}
