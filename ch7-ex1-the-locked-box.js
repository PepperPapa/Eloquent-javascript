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
