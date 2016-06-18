"use strict";

var editor = new Cody({
	mode: GenericQLMode,
	cursor: htmlcursor.default,
	renderer: htmlrenderer.default,
	context: document.getElementById('thing')
});

editor.do_update(`[services] (host.name ~~ "^web" or description ~~ "web") and state != 0`);
