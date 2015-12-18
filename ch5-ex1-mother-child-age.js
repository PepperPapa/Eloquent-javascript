/*
Mother-child age difference
Using the example data set from this chapter, compute the average age
difference between mothers and children (the age of the mother when
the child is born). You can use the average function defined earlier in
this chapter.
Note that not all the mothers mentioned in the data are themselves
present in the array. The byName object, which makes it easy to find a
person’s object from their name, might be useful here.
*/
function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

var byName = [];
ancestry.forEach(function(person) {
  byName.push([person.name, person.born, person.mother]);
});

var ages = [];
for (var i = 0; i < ancestry.length; i++) {
  for (var j = 0; j < byName.length; j++) {
    if (ancestry[i].name == byName[j][2]) {
      byName[j].push(ancestry[i].born);
      ages.push(byName[j][1] - byName[j][3]);
  	}
  }
}

console.log(average(ages));

// → 31.2
