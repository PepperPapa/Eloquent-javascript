/*
Every and then some
Arrays also come with the standard methods every and some. Both take a
predicate function that, when called with an array element as argument,
returns true or false. Just like && returns a true value only when the
expressions on both sides are true, every returns true only when the
predicate returns true for all elements of the array. Similarly, some returns
true as soon as the predicate returns true for any of the elements. They
do not process more elements than necessary—for example, if some finds
that the predicate holds for the first element of the array, it will not look
at the values after that.
Write two functions, every and some, that behave like these methods,
except that they take the array as their first argument rather than being
a method.
*/
function every(array, boolean) {
  var ouput = boolean(array[0]);
  for (var i = 0; i < array.length; i++) {
    ouput = ouput && boolean(array[i]);
  }
  return ouput;
}

function some(array, boolean) {
  var ouput = boolean(array[0]);
  for (var i = 0; i < array.length; i++) {
    ouput = ouput || boolean(array[i]);
  }
  return ouput;
}

console.log(every([NaN, NaN, NaN], isNaN));
// → true
console.log(every([NaN, NaN, 4], isNaN));
// → false
console.log(some([NaN, 3, 4], isNaN));
// → true
console.log(some([2, 3, 4], isNaN));
// → false
