var enterHandler = function (e) {
    if (e.keyCode === 13) {
        console.log("Works");
        console.log(inputBox.value);
    }
}

var inputBox = document.getElementById("ytb-url-input");
inputBox.addEventListener("keypress", enterHandler);

var sendToServer = function (value) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                console.log("Value has been sent");
            }
        }
    };
    var host = "127.0.0.1";
    xhr.open("post", host, true);
    xhr.send(value);
}