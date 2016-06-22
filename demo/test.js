"use strict";

var visual = document.getElementById('visual');

var editor = new Cody.default({
	mode: {
		class: Cody.Modes.genericfilter.default,
		options: {}
	},
	context: {
		class: Cody.Contexts.html.default,
		options: {
			node: visual
		}
	}
});

editor.on('lexeme', lexeme => console.log);
editor.on('token', token => console.log);
editor.on('error', token => console.log);
editor.do_update(
	`(host.name = "web" or (description ~ /web/ig)) and name != "hej"`
);
