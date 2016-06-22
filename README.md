#!! THIS PROJECT IS FAR FROM USABLE AT THIS MOMENT !!

What is needed before this could possibly work

- [ ] Handle cursor offest during copy/pasting and deletion of selections
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
		mode: {
			"class": Cody.Modes.genericfilter.default,
			"options": {}
		},
		context: {
			"class": Cody.Contexts.html.default,
			"options": {
				"node": document.getElementById('myEditorViewport')
			}
		}
	});

	editor.do_update('(a = "filter")');

## Public Interfaces

### Cody

#### constructor (object setup)

Creates a new instance of Cody, Cody must be passed a setup object containing
at least the setup for the Mode and the Context or it will throw an Error.

#### do_update (string text) -> self

Updates Cody with new text to parse and present.

### Events

Cody emits these errors by itself, a Context may extend Cody to emit further
errors

#### lexeme (&lt;Token&gt;)

Emitted when a new lexeme has been scanned from the stream.

#### token (&lt;Token&gt;)

Emitted when a new Token has been found during evaluation

#### valid ([&lt;Token&gt;])

Emitted if there are no invalid Tokens found after evaluation has completed

#### invalid ([&lt;Token&gt;])

Emitted if there are any invalid Tokens found after evaluation has completed

#### error ([&lt;Token&gt;])

Something went wrong, i.e. thrown and caught error, during evaluation of the
lexemes or tokenization, this should be listened for when developing a new Mode.
An error will not stop the tokenization process, simply shift one lexeme and
try to tokenize again.

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

A Mode only requires you to define a single method known as **tokenize**,
however, writing a proper tokenizer will help you in the long run. Cody expects
you to write the Mode as a recursive descent parser, hence the signature of the
tokenize function.

#### tokenize ([&lt;Lexeme&gt;]) -> [Token, accept]

The Tokenize method of a Mode takes an array of Lexemes and returns a tuple of
a Token and the next function to run that will take the lexemes as its argument.

### Important classes for Mode development

There are three objects that are of great relevance when creating a new Mode
should know of, each of these objects have the possibility to retrive the
object (or objects) that it is made up of, i.e. an Item can reieve the Token it
was made from, a Token can retrieve the Lexeme's that made it and a Lexeme can
retrieve the raw stream chunk that makes it up.

### Lexeme

A part of the Stream that has significance, most often operators and characters
with syntactic meaning. The Lexeme is immutable.

#### constructor (string value, integer offset) -> Lexeme

Create a new Lexeme

#### string: value

The value of the Lexeme

#### integer: offset

The offset of the Lexeme

### Token

Has one or more Lexeme values as its value and now contains the intended
purpose. The Token is immutable.

#### constructor (string type | [&lt;string&gt;] type, [&lt;Lexeme&gt;])

Create a new token

#### string: value

The value of the Token

#### integer: offset

The offset of the Token

#### [String]: type

A list of Token types (for example ['operator', 'equals'])
