/*
The locked box
Consider the following (rather contrived) object:
var box = {
l o c k e d : true ,
u n l o c k : f u n c t i o n () { this . l o c k e d = false ; } ,
lock : f u n c t i o n () { this . l o c k e d = true ; } ,
_ c o n t e n t : [] ,
get c o n t e n t () {
if ( this . l o c k e d ) throw new Error (" L o c k e d !") ;
r e t u r n this . _ c o n t e n t ;
}
};
It is a box with a lock. Inside is an array, but you can get at it only
when the box is unlocked. Directly accessing the _content property is not
allowed.
Write a function called withBoxUnlocked that takes a function value as
argument, unlocks the box, runs the function, and then ensures that the
box is locked again before returning, regardless of whether the argument
function returned normally or threw an exception.
*/

function withBoxUnlocked(body) {
  //unlock the box
  box.unlock();

  //run body function
  try {
    body();
  } finally {
    box.lock();
    return true;
  }
}

withBoxUnlocked(function() {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised:", e);
}

console.log(box.locked);
// → true


// the author's solution
/*
function withBoxUnlocked(body) {
  var locked = box.locked;
  if (!locked)
    return body();

  box.unlock();
  try {
    return body();
  } finally {
    box.lock();
  }
}

withBoxUnlocked(function() {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised:", e);
}

console.log(box.locked);
// → true
*/
