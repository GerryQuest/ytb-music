var enterHandler = function (e) {
    if (e.keyCode === 13) {
        console.log("Works");
        console.log(inputBox.value);
        sendToServer(inputBox.value);
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

    xhr.open("post", "ytb-url", true);
    var JsonURL = JSON.stringify({url:value});
    xhr.setRequestHeader("Content-Type", "application/json" );
    
    //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(JsonURL);
}