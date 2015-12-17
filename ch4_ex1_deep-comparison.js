/*
Deep comparison
The == operator compares objects by identity. But sometimes, you would
prefer to compare the values of their actual properties.
Write a function, deepEqual, that takes two values and returns true only
if they are the same value or are objects with the same properties whose
values are also equal when compared with a recursive call to deepEqual.
To find out whether to compare two things by identity (use the ===
operator for that) or by looking at their properties, you can use the
typeof operator. If it produces "object" for both values, you should do a
deep comparison. But you have to take one silly exception into account:
by a historical accident, typeof null also produces "object".
*/

function deepEqual(a, b) {
  //类型和值都相等可以确定a==b
  if (a === b) return true;

  //1.任何一个为null就表示不相等，即使a b都为null，因为null没有任何意义
  //2.如果a或b任何一个类型不是object，如果相等在上面的a===b判断中就应该返回会true，
  //不返回就说明不相等，可以直接返回false
  if (a == null || typeof a != "object" ||
      b == null || typeof b != "object")
    return false;

  var propsInA = 0, propsInB = 0;

  for (var prop in a)
    propsInA += 1;

  for (var prop in b) {
    propsInB += 1;
    if (!(prop in a) || !deepEqual(a[prop], b[prop]))
      return false;
  }

  return propsInA == propsInB;
}

var obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
