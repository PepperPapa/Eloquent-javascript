/*
Arrays
Add support for arrays to Egg by adding the following three functions to
the top scope: array(...) to construct an array containing the argument
values, length(array) to get an array’s length, and element(array, n) to
fetch the nth element from an array.
*/

topEnv["array"] = function() {
  var elements = [];
  for (var arg in arguments) {
    elements.push(arguments[arg]);
  }
  return elements;
};

topEnv["length"] = function(array) {
  return array.length;
};

topEnv["element"] = function(array, n) {
  return array[n];
};

run("do(define(sum, fun(array,",
    "     do(define(i, 0),",
    "        define(sum, 0),",
    "        while(<(i, length(array)),",
    "          do(define(sum, +(sum, element(array, i))),",
    "             define(i, +(i, 1)))),",
    "        sum))),",
    "   print(sum(array(1, 2, 3))))");
// → 6


/* the author's solution:
topEnv["array"] = function() {
  return Array.prototype.slice.call(arguments, 0);
};

topEnv["length"] = function(array) {
  return array.length;
};

topEnv["element"] = function(array, i) {
  return array[i];
};

run("do(define(sum, fun(array,",
    "     do(define(i, 0),",
    "        define(sum, 0),",
    "        while(<(i, length(array)),",
    "          do(define(sum, +(sum, element(array, i))),",
    "             define(i, +(i, 1)))),",
    "        sum))),",
    "   print(sum(array(1, 2, 3))))");
// → 6
*/
