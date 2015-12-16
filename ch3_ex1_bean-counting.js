/*
You can get the Nth character, or letter, from a string by writing "string".
charAt(N), similar to how you get its length with "s".length. The returned
value will be a string containing only one character (for example, "b"
). The first character has position zero, which causes the last one to
be found at position string.length - 1. In other words, a two-character
string has length 2, and its characters have positions 0 and 1.
Write a function countBs that takes a string as its only argument and
returns a number that indicates how many uppercase “B” characters are
in the string.
Next, write a function called countChar that behaves like countBs, except
it takes a second argument that indicates the character that is to be
counted (rather than counting only uppercase “B” characters). Rewrite
countBs to make use of this new function.
60
*/
var countChar = function (string, char) {
  if (char == undefined) {
  	char = "B";
  }
  var count = 0;
  for (var i = 0; i < string.length;) {
  	if (string.charAt(i) == char.charAt(0)) {
      var isEqual = true;
      for (var j = 0; j < char.length; j++) {
      	if (string.charAt(i) != char.charAt(j)) {
          isEqual = false;
          break;
        }
        i += 1;
      }
      if (isEqual == true) {
        count += 1;
      }
    } else {
      i += 1;
    }
  }
  return count;
}
var countBs = countChar;
console.log(countBs("BBC"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4
