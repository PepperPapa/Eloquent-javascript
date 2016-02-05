//
// different Accept headers.
// Do this again, using Node’s http.request function. Ask for at least the
// media types text/plain, text/html, and application/json. Remember that
// headers to a request can be given as an object, in the headers property
// of http.request’s first argument.
// Write out the content of the responses to each request.

var http = require("http");

var types = ["text/plain", "text/html", "application/json"];

function readStreamAsString(stream, callback) {
  var content = "";
  stream.on("data", function(chunk) {
    content += chunk;
  });

  stream.on("end", function() {
    callback(null, content);
  });

  stream.on("error", function() {
    callback(error);
  });
}

types.forEach(function(type) {
  var req = http.request({
    hostname: "eloquentjavascript.net",
    path: "/author",
    method: "GET",
    headers: {Accept: type}
  }, function (response) {
    if (response.statusCode != 200) {
      console.log("Reuest for type " + type + " failed: " + response.statusCode);
      return;
    }
    readStreamAsString(response, function(error, content) {
      if (error) throw error;
      console.log("Type " + type + ": \n" + content);
    });
  }).end();
});
