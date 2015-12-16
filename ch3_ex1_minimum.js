/*
Write a function min that takes two arguments and returns their minimum.
*/

function min(n1, n2) {
  if (n1 >= n2) {
    return n2;
  } else {
    return n1;
  }
}
console.log(min(0, 10));
// → 0
console.log(min(0, -10));
// → -10
