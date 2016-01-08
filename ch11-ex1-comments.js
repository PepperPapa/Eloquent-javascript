/*
Comments
It would be nice if we could write comments in Egg. For example, whenever
we find a hash sign (\#), we could treat the rest of the line as a
comment and ignore it, similar to // in JavaScript.
We do not have to make any big changes to the parser to support
this. We can simply change skipSpace to skip comments like they are
whitespace so that all the points where skipSpace is called will now also
skip comments. Make this change.
*/

// This is the old skipSpace. Modify it...
function skipSpace(string) {
  string = string.replace(/#.*\n/g, "");
  var first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}

console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}

// the author's solution:
function skipSpace(string) {
  var skippable = string.match(/^(\s|#.*)*/);
  return string.slice(skippable[0].length);
}

console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "x"},
//    args: []}
