/*
Month names
Write a simple module similar to the weekDay module that can convert
month numbers (zero-based, as in the Date type) to names and can convert
names back to numbers. Give it its own namespace since it will need
an internal array of month names, and use plain JavaScript, without any
module loader system.
*/
(function (ex) {
  var _MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
              'August', 'September', 'October', 'November' ,'December'];
  ex.name = function (num) { return _MONTH[num]; },
  ex.number = function (name) { return _MONTH.indexOf(name); }
})(this.month = {});

console.log(month.name(2));
// → March
console.log(month.number("November"));
// → 10

// the author's solution
/*
var month = function() {
  var names = ["January", "February", "March", "April", "May",
               "June", "July", "August", "September", "October",
               "November", "December"];
  return {
    name: function(number) { return names[number]; },
    number: function(name) { return names.indexOf(name); }
  };
}();


console.log(month.name(2));
// → March
console.log(month.number("November"));
// → 10
*/
