"use strict";

var visual = document.getElementById('visual');

var editor = new Cody.default({
	mode: {
		class: Cody.Modes.genericql.default,
		options: {}
	},
	context: {
		class: Cody.Contexts.html.default,
		options: {
			node: visual
		}
	}
});

editor.do_update(
	`(host.name = "web" or (description ~ /web/ig)) and name != "hej"`
);
