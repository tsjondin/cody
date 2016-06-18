#Cody

Used to create code highlight, hinting, autocompletion and more on you site. It
was built to be used in tandem with filter DSL's that may be used in
large/complex products.

## Getting started

	var editor = new Cody({mode: GenericQueryLanguageMode});
	editor.set_input(document.getElementById('myEditor'));

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

*[needs rewording]*
Your mode handles how Lexeme's are broken down and how they are tokenized, a
Lexeme in your Mode is defined as a character of some special importance which
will trigger a break in the character stream and start a new Lexeme build. For
example, if you say that the pund-sign (#) has importance you and the
string scanned by Cody is:

	hello # world

this could result in:

	['hello ', Lexeme('#'), ' world']

However, cody by default has two implicit pseudo-lexemes to make your life a
little bit easier, these handle whitespace and non-whitespace. As such the
scanned string actually becomes this:

	[Lexeme(hello), Lexeme(' '), Lexeme('#'), Lexeme(' '), Lexeme('world')]

### Mode

The Mode object is the object to extend if you want to create a new Mode:

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

### Important objects to know of

There are three objects you as an implementor of a Mode (DSL handler) should know
of, each object has the possibility to retrive the object that made this object
up, i.e. an Item can reieve the Token it was made from, a Token can retrieve
the Lexeme's that made it and a Lexeme can retrieve the raw stream chunk that
makes it up.

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

As can bee seen from the methods on the Item, its intention is HTML, but you
may use the values as you please from a rendering override. Cody's only
knowledge of HTML resides within the rendering function.

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
