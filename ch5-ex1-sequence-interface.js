function ArraySeq(array) {
  this.array = array;
  this.pos = -1;
}
ArraySeq.prototype.next = function() {
  if (this.pos >= this.array.length - 1)
    return false;
  this.pos++;
  return true;
};
ArraySeq.prototype.current = function() {
  return this.array[this.pos];
};

function RangeSeq(from, to) {
  this.from = from;
  this.to = to;
  this.cur = from;
}
RangeSeq.prototype.next = function() {
  if (this.cur >= this.to)
    return false;
  this.cur++;
  return true;
};
RangeSeq.prototype.current = function() {
  return this.cur;
};

function logFive(seq) {
  for (var i = 0; i < 5; i++) {
    console.log(seq.current());
    if (!seq.next())
      break;
  }
}


logFive(new ArraySeq([1, 2]));
// → 1
// → 2
logFive(new RangeSeq(100, 104));
// → 100
// → 101
// → 102
// → 103
// → 104
