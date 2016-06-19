"use strict";

var editor = new Cody.default({
	mode: Cody.Modes.genericql.default,
	cursor: Cody.Cursors.htmlcursor.default,
	renderer: Cody.Renderers.htmlrenderer.default,
	context: document.getElementById('thing')
});

editor.do_update(`(host.name ~ "^web" or description ~ "web") and state != 0 and -these -are -unknown`);
