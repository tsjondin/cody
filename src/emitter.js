"use strict";

export default class Emitter {

	constructor () {
		this._registry = {};
	}

	on (event, listener) {
		if (!this._registry[event]) this._registry[event] = [];
		this._registry[event].push(listener);
		return this;
	}

	off (event, listener) {
		if (!this._registry[event]) return this;
		this._registry = this._registry[event].filter(L => (L != listener));
		return this;
	}

	once (event, listeners) {
		let proxy = () => (listener.apply(this, Array.prototype.slice.call(arguments, 0)), this.off(event, proxy), this);
		return this.on(event, proxy);
	}

	emit (event, ...args) {
		if (!this._registry[event]) return this;
		this._registry[event].forEach(L => (L.apply(this, args)));
		return this;
	}

}
