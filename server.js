// server.js

// requirements
var express = require("express");
var stylus = require("stylus");
var fileUpload = require("express-fileupload");
var nib = require("nib");
var app = express();

// compiling the stylesheets
function compile(str, path) {
  return stylus(str)
    .set("filename", path)
    .use(nib());
}

// ejs + stylus setup
app.set("view engine", "ejs");
app.use(
  stylus.middleware({
    src: __dirname + "/public",
    compile: compile
  })
);
app.use(
  fileUpload()
);
app.use(express.static(__dirname + "/public"));

// rendering
app.get("/", function(request, response) {
  response.render("pages/index");
});

app.post("/", function(request, response) {
  if (request.files != null) {
    const data = request.files.inputfile.data;
    const bufferToString = Array.prototype.map.call(new Uint8Array(data), x =>
      ("00" + x.toString(16)).slice(-2)
    );
    const bufferToCharacter = Array.prototype.map.call(
      new Uint8Array(data),
      x => String.fromCharCode(x).slice(-1)
    );
    response.render("pages/viewer", {
      hexValues: bufferToString,
      charValues: bufferToCharacter
    });
    console.log(bufferToCharacter);
  } else {
    response.render("pages/index");
  }
});

// listener
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
