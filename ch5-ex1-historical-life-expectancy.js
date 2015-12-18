/*
Historical life expectancy
When we looked up all the people in our data set that lived more than
90 years, only the latest generation in the data came out. Let’s take a
closer look at that phenomenon.
Compute and output the average age of the people in the ancestry data
set per century. A person is assigned to a century by taking their year
of death, dividing it by 100, and rounding it up, as in Math.ceil(person.
died / 100).
For bonus points, write a function groupBy that abstracts the grouping
operation. It should accept as arguments an array and a function that
computes the group for an element in the array and returns an object
that maps group names to arrays of group members.
*/
function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

function map(array, transform) {
  var mapped = [];
  for (var i = 0; i < array.length; i++) {
     mapped.push(transform(array[i]));
  }
  return mapped;
}

//get the century list
var centuryList = map(ancestry, function(a) {
  return Math.ceil(a.died / 100);
});

function removeDuplicate(array) {
  var passed = [];
  for (var i = 0; i < array.length; i++) {
    if (!(passed.indexOf(array[i]) > -1))
      passed.push(array[i]);
  }
  return passed;
}
//remove the duplicated century
var centuryList = removeDuplicate(centuryList);

function filter(array, test, cen) {
  var passed = [];
  for (var i = 0; i < array.length; i++) {
    if (test(array[i], cen)) {
      passed.push(array[i]);
    }
  }
  return passed;
}
var personByCentury = [];
for (var i = 0; i < centuryList.length;i++) {
  personByCentury.push(filter(ancestry, function(a, b) {
    return Math.ceil(a.died / 100) == b;
  }, centuryList[i]));
}

function reduce(array, combine) {
  var ouput = 0;
  for (var i = 0; i < array.length; i++) {
    ouput = combine(ouput, array[i]);
  }
  return ouput / array.length;
}

var avgCentury = [];
for (var i = 0; i < personByCentury.length; i++) {
  avgCentury.push(reduce(personByCentury[i], function(a, b) {
    return a + (b.died - b.born);
  }));
}

for (var i = 0; i < centuryList.length; i++) {
  console.log(centuryList[i], ": ", avgCentury[i]);
}
// → 16: 43.5
//   17: 51.2
//   18: 52.8
//   19: 54.8
//   20: 84.7
//   21: 94


// solution by the author
function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

function groupBy(array, groupOf) {
  var groups = {};
  array.forEach(function(element) {
    var groupName = groupOf(element);
    if (groupName in groups)
      groups[groupName].push(element);
    else
      groups[groupName] = [element];
  });
  return groups;
}

var byCentury = groupBy(ancestry, function(person) {
  return Math.ceil(person.died / 100);
});

for (var century in byCentury) {
  var ages = byCentury[century].map(function(person) {
    return person.died - person.born;
  });
  console.log(century + ": " + average(ages));
}

// → 16: 43.5
//   17: 51.2
//   18: 52.8
//   19: 54.8
//   20: 84.7
//   21: 94
