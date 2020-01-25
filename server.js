var express = require("express"),
    path = require("path");

var port = 3000; hostname = "127.0.0.1";
var server = express();

server.use(express.static("public"));

server.get("/", function (req, res) {
    //res.send("Ping");
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