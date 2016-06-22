"use strict";

import Lexer from './src/lexer';
import Stream from './src/stream';
import Emitter from './src/emitter';
import Mode from './src/mode';
import Context from './src/context';

class Cody extends Emitter {

	constructor (options) {

		super();

		if (!options.mode.class)
			throw new Error('Cody cannot operate without a Mode');
		else if (!options.context.class)
			throw new Error('Cody cannot operate without a Context');

		this.context = new options.context.class(this, options.context.options);
		this.mode = new options.mode.class(options.mode.options);

		this.lexer = new Lexer(this.mode);

		this.lexer.on('lexeme', lexeme => this.emit('lexeme', lexeme));
		this.lexer.on('token', token => this.emit('token', token));
		this.lexer.on('error', token => this.emit('error', token));

		this.stream = new Stream("");
		this.lexemes = [];
		this.tokens = [];

	}

	do_update (text, force = false) {

		this.stream = new Stream(text);
		this.lexemes = this.lexer.scan(this.stream);

		try {
			this.tokens = this.lexer.evaluate(
				this.lexemes
			);
		} catch (e) {
			this.emit('error', e);
		}

		this.emit('render.before');
		this.context.do_render(this.tokens);
		this.emit('render.after');
		return this;

	}

}

Cody.Contexts = {};
export default Cody;
