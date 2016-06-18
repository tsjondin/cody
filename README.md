#Cody

Used to create code highlight, hinting, autocompletion and more on you site. It
was built to be used in tandem with filter DSL's that may be used in
large/complex products.

## Getting started

	var editor = new Cody({mode: GenericQueryLanguageMode});
	editor.set_input(document.getElementById('myEditor'));

## Public Interfaces

It has three objects you as an implementor of a Mode (DSL handler) should know
of, each object has the possibility to retrive the object that made this object
up, i.e. an Item can reieve the Token it was made from, a Token can retrieve
the Lexeme's that made it and a Lexeme can retrieve the raw stream chunk that
makes it up.

### Lexeme
A part of the text that has significance

### Token
Has one or more Lexeme's as value and now contains their intended purpose

### Item
The representation of a Token the moment before it is rendered
