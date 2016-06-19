"use strict";

var visual = document.getElementById('visual');

var editor = new Cody.default({
	mode: Cody.Modes.genericql.default,
	cursor: Cody.Cursors.htmlcursor.default,
	renderer: Cody.Renderers.htmlrenderer.default,
	context: visual
});

editor.on('error', function () {
	visual.style.border = '1px solid #f00';
});

editor.on('success', function () {
	visual.style.border = 'none';
});

editor.do_update(`(host.name ~ "^web" or description ~ "web") and state != 0`);
