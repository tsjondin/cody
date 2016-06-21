#!! THIS PROJECT IS FAR FROM USABLE AT THIS MOMENT !!

What is needed before this could possibly work

- [ ] Fix the offset designation during scanning
- [ ] Fix the standalone (modes/renderers/cursor) module handling, standalone does not play very nice with es6 default exports
- [ ] Implement line handling (possibly through an ephemeral Line object, implicit linebreak lexeme/token?)
- [ ] Investigate how it would look to handle escaped characters in Modes

#Cody

Used to create code highlight, hinting, autocompletion and more in primarily a
HTML context. It was built to be used in tandem with filter DSL's that may be
used in large/complex products.

## Getting started

	var editor = new Cody({
		mode: GenericQueryLanguageMode
		cursor: Cody.Cursors.HTMLCursor
		renderer: Cody.Renderers.HTLMRenderer
	});

	var context = document.getElementById('myEditor');

	editor.renderer.set_context(context);
	editor.cursor.set_context(context);

## Public Interfaces

### Cody

#### constructor (Mode.constructor mode)

Creates a new instance of Cody, the mode passed will be used for lexing and
tokenization of the stream

#### get_cursor () -> Cursor

Gets the Cursor, a reflection of the caret position within the text Cody is
rendering, can be overriden for different renderings.

#### do_update (string text, bool force = false) -> self

Updates Cody with new text to parse, by default only updates if there has been
a change to the content unless the force bool is set to true.

## Mode development

The Mode handles how the Stream is broken into Lexeme's and how the Lexeme's
are tokenized, the lexemes list in the Mode is one of characters that carry
syntactic meaning, when one occurs it will trigger a break in the stream and
spawn a new Lexeme.

Cody has two implicit pseudo-lexemes to make your life the development of new
modes a little easier, these handle whitespace and non-whitespace. Due to this
the Mode may say if it wants to act on whitespace or not during tokenization.

Given all of the above, if the Mode we are creating says that the pound-sign
(#) has importance (and only the pound-sign) and the string scanned by Cody is:

	hello # world

this would result in:

	[Lexeme(hello), Lexeme(' '), Lexeme('#'), Lexeme(' '), Lexeme('world')]

### Mode

The Mode class is the one to extend when creating a new Mode.

	export default class MyDSLMode extends Mode {
		...
	}

A mode has three properties and three public functions that turn the input
Stream into a sequence of Tokens. A big aim in Cody has been to minimize the
amount of could you have to but into the Mode but still have full control at
any point within the parsing to say what is what for the language you are
parsing.

#### get_token (string type, Lexeme lexeme)
#### get_lexeme (mixed value, integer offset)
#### tokenize (Lexeme, ArrayMutator&lt;Lexeme&gt;) -> Token

The tokenize function of a Mode takes the current Lexeme and an ArrayMutator of
all lexemes that have been scanned. The tokenize function should always return a
Token. The get_token function should in most cases be used to generate the
Token to return in order to avoid any hassle, use the Token class directly only
if you need it. In addition your may override the get_token function if you
want to do something different with it in a general manner.

### Important classes for Mode development

There are three objects that are of great relevance when creating a new Mode
should know of, each of these objects have the possibility to retrive the
object (or objects) that it is made up of, i.e. an Item can reieve the Token it
was made from, a Token can retrieve the Lexeme's that made it and a Lexeme can
retrieve the raw stream chunk that makes it up.

### Lexeme

A part of the Stream that has significance, most often operators and characters
with syntactic meaning.

#### set_value (string value) -> self

Sets the value of the Lexeme

#### set_offset (integer offset) -> self

Sets the offset of the Lexeme, this is generally inherited from the Stream at
the position it was read. But a manipulated Lexeme may need an updated offset.

#### set_type (string type) -> self

Sets the type of the Token

### Token

Has one or more Lexeme values as its value and now contains the intended purpose

#### set_value (string value) -> self

Sets the value of the Token

#### set_offset (integer offset) -> self

Sets the offset of the Token, this is generally inherited from the first Lexeme
that made up the Token but could be different if the Token is manipulated.

#### set_type (string type) -> self

Sets the type of the Token

### Item

The representation of a Token the moment before it is rendered. When it is time
to render an Item it is passed to Cody's rendering function, which you may
override should you want to, this can be done in order to support other
renderings than HTML tags, such as JSX.

As can be seen from the methods on an Item, its intention is HTML, but you may
use the values as you please from a rendering override. Cody's only knowledge
of HTML resides within the rendering function.

#### add_class (string classname) -> self

Adds a class to the Item class list

#### remove_class (string classname) -> self

Removes the class from the Item class list, if it exists.

#### get_classes () -> Array&lt;string&gt;

Returns a copy of the Items class list

#### set_attribute (string key, mixed value) -> self

Sets an attribute on the Item

#### get_attribute (string key) -> mixed

Retrieves an attribute from the Item
