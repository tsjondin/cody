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
#### tokenize (Lexeme, ArrayManipulator<Lexeme>)

It has three objects you as an implementor of a Mode (DSL handler) should know
of, each object has the possibility to retrive the object that made this object
up, i.e. an Item can reieve the Token it was made from, a Token can retrieve
the Lexeme's that made it and a Lexeme can retrieve the raw stream chunk that
makes it up.

### Lexeme

A part of the text that has significance

### Token

Has one or more Lexeme values as its value and now contains the intended purpose

### Item

The representation of a Token the moment before it is rendered
