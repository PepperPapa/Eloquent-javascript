//charpter2 exercises1 chess board

var n = Number(prompt("input a size number "));
var output = "";
var row = 0;
var col = 0;
for (var i = 0; i < n * n; i++) {
  col = i % n;
  row = parseInt(i / n);
  if ((row + col) % 2 == 0) {
  	output += " ";
  } else {
    output += "#";
  }
  if (col == n - 1) {
    output += "\n";
  }
}
console.log(output);

/* output:
 # # # #
# # # #
 # # # #
# # # #
 # # # #
# # # #
 # # # #
# # # #
*/
