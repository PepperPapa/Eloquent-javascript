function urlToPath(url) {
  var path = require("url").parse(url).pathname;
  var decoded = decodeURIComponent(path);
  return "." + decoded.replace(/(\/|\\)\.\.(\/|\\|$)/g, "/");
}
