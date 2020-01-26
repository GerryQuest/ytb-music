var express = require("express"),
    path = require("path"),
    bodyParser = require('body-parser');;

var port = 3000; hostname = "127.0.0.1";
var server = express();


server.use(bodyParser.json());
//server.use(bodyParser.urlencoded({extended: false})); // passing parms in form post

var validURL = function (url) {
    var valid = false;
    if (url.indexOf("youtube.com/watch?v=") > -1)
        valid = true;

    return valid;
};

server.post("/ytb-url", function (req, res) {
   //console.log(req.body.test); // Used for query string parameters;
   console.log(req.body.url);
   //next();
});

server.get("/", function (req, res) {
    //console.log(req.query.test2); //query parameters

    server.use(express.static("public"));
    var file = path.resolve(__dirname, "public/index.html");
    res.sendFile(file, function (err) {
        if (err)
            throw err;

    });
});

// Execute server
server.listen(port,hostname, function () {
    console.log("Server running");
});