"use strict";

var Cody = require('../dist/cody');
var GenericFilter = require('../dist/modes/genericfilter');
var Context = require('../dist/contexts/html');

var editor = new Cody.default({
	mode: {
		class: GenericFilter.default,
		options: {}
	},
	context: {
		'class': class {
			constructor () {

			}
			do_render (tokens) {
				console.log(tokens);
				tokens.forEach(token => console.log);
			}
		},
		'options': {}
	}
});

editor.on('error', console.log);

editor.do_update(
	`(host.name = "web" or description ~ /web/ig) and state != 0`
);
