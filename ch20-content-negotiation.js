var http = require("http");

var req = http.request({
  hostname: "eloquentjavascript.net",
  path: "/author",
  method: "GET",
  headers: {'Content-Type': "text/plain"}
}, function (response) {
  console.log(response.statusCode);
  response.on("data", function (chunk) {
    console.log('BODY: ${chunk}');
  });
  response.on("end", function () {
    console.log("no more data.");
  });
});
req.end();
