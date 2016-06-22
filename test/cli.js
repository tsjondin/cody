"use strict";

var Cody = require('../dist/cody');
var GenericFilter = require('../dist/modes/genericfilter');
var CLI = require('../dist/contexts/cli');

var editor = new Cody.default({
	mode: {
		class: GenericFilter.default,
		options: {}
	},
	context: {
		'class': CLI.default,
		'options': {}
	}
});

editor.do_update(
	`(host.name = "web" or description ~ /web/ig) and state != 0`
);
