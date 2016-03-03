var lastServerTime = 0;
var talkDiv = document.querySelector("#talks");
var shownTalks = Object.create(null);

function request(options, callback) {
  var req = new XMLHttpRequest();
  req.open(options.method || "GET", options.pathname, true);
  req.addEventListener("load", function() {
    if (req.status < 400) {
      callback(null, req.responseText);
    } else {
      callback(new Error("Request failed: " + req.statusText));
    }
  });
  req.addEventListener("error", function() {
    callback(new Error("Network error"));
  });
  req.send(options.body || null);
}

function reportError(error) {
  if (error) {
    alert(error.toString());
  }
}

function displayTalks(talks) {
  talks.forEach(function(talk) {
    var shown = shownTalks[talk.title];
    if (talk.deleted) {
      if (shown) {
        talkDiv.removeChild(shown);
        delete shownTalks[talk.title];
      }
    } else {
      var node = drawTalk(talk);
      if (shown) {
        var textField = shown.querySelector("input");
        var hasFocus = (document.activeElement == textField);
        var value = textField.value;
        talkDiv.replaceChild(node, shown);
        var newTextField = node.querySelector("input");
        newTextField.value = value;
        if (hasFocus) {
          newTextField.focus();
        }
      } else {
        talkDiv.appendChild(node);
      }
      shownTalks[talk.title] = node;
    }
  });
}

function instantiateTemplate(name, values) {
  function instantiateText(text) {
    return text.replace(/\{\{(\w+)\}\}/g, function(_, name) {
      return values[name];
    });
  }
  function attr(node, attrName) {
    return node.nodeType == document.ELEMENT_NODE &&
      node.getAttribute(attrName);
  }
  function instantiate(node, values) {
    if (node.nodeType == document.ELEMENT_NODE) {
      var copy = node.cloneNode();
      for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];

        var when = attr(child, "template-when");
        var unless = attr(child, "template-unless");
        if (when && !values[when] || unless && values[unless]) {
          continue;
        }

        var repeat = attr(child, "template-repeat");
        if (repeat) {
          (values[repeat] || []).forEach(function(element) {
            copy.appendChild(instantiate(child, element));
          });
        } else {
          copy.appendChild(instantiate(child, values));
        }
      }
      return copy;
    } else if (node.nodeType == document.TEXT_NODE) {
      return document.createTextNode(instantiateText(node.nodeValue, values));
    }
  }
  var template = document.querySelector("#template ." + name);
  return instantiate(template);
}

function drawTalk(talk) {
  var node = instantiateTemplate("talk", talk);
  var comments = node.querySelector(".comments");
  talk.comments.forEach(function(comment) {
    comments.appendChild(instantiateTemplate("comment", comment));
  });

  node.querySelector("button.del").addEventListener("click",
                                  deleteTalk.bind(null, talk.title));

  var form = node.querySelector("form");
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    addComment(talk.title, form.elements.comment.value);
    form.reset();
  });
  return node;
}

function waitForChanges() {
  request({pathname: "talks?changesSince=" + lastServerTime},
           function(error, response) {
             if (error) {
               setTimeout(waitForChanges, 2500);
               console.error(error.stack);
             } else {
               response = JSON.parse(response);
               displayTalks(response.talks);
               lastServerTime = response.serverTime;
               waitForChanges();
             }
           });
}

function talkURL(title) {
  return "talks/" + encodeURIComponent(title);
}

function deleteTalk(title) {
  request({pathname: talkURL(title), method: "DELETE"}, reportError);
}

function addComment(title, comment) {
  var comment = {author: nameField.value, message: comment};
  request({pathname: talkURL(title) + "/comments",
           body: JSON.stringify(comment),
           method: "POST"},
          reportError);
}

request({pathname: "talks"}, function(error, response) {
  if (error) {
    reportError(error);
  } else {
    response = JSON.parse(response);
    displayTalks(response.talks);
    lastServerTime = response.serverTime;
    waitForChanges();
  }
});

var nameField = document.querySelector("#name");
nameField.value = localStorage.getItem("name") || "";

nameField.addEventListener("change", function() {
  localStorage.setItem("name", nameField.value);
});

var talkForm = document.querySelector("#newtalk");
talkForm.addEventListener("submit", function(event) {
  event.preventDefault();
  request({pathname: talkURL(talkForm.elements.title.value),
           method: "PUT",
           body: JSON.stringify({
             presenter: nameField.value,
             summary: talkForm.elements.summary.value
           })}, reportError);
   talkForm.reset();
});
