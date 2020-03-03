const puppeteer = require("puppeteer");
const request_client = require("request-promise-native");

//https://www.youtube.com/watch?v=FEPFH-gz3wE

//Maybe count the number of audio webm - it may arrive at a certain number

//https://www.youtube.com/api/stats/qoe?event=streamingstats - look for first r2 url after this
// a redirector url might appear just after the stats url which has a link to the url
// the second r2 url after this first one, might contain the audio webm that you are looking for

// THIS url worked and it appears very early in the requests
//https://r2---sn-aigzrn76.googlevideo.com/videoplayback?expire=1583117816&ei=mCFcXrqrDcGVxwL87arIDQ&ip=217.33.240.50&id=o-ABssCjlP77K9oQCMdt1wUjHZ-7bNiFxtPMrtkSM2-E-k&itag=243&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=youtube&requiressl=yes&mm=31%2C26&mn=sn-aigzrn76%2Csn-5hne6nsy&ms=au%2Conr&mv=m&mvi=1&pl=18&gcr=gb&initcwndbps=1036250&vprv=1&mime=video%2Fwebm&gir=yes&clen=2060501&dur=338.640&lmt=1577389370372441&mt=1583096139&fvip=2&keepalive=yes&fexp=23842630&c=WEB&txp=5431432&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=ABSNjpQwRAIgOT-ZtUeMSY_nrgQ_byAoINtSCJj33XrNGj-tIz8kjpgCIHa8N31TdsZ2hHe2JSSuvgVXnl-ZePPpwvY4vgNhrbw1&alr=yes&sig=ADKhkGMwRAIgMfsHhp5QdsI2YsrZ06DKwdX3a2MkLR_pIAYPIOCDP1gCIA7Kxp6mVRaN24v55bp97FBAwEIKjQIPHtNN-rrziFC2&cpn=xDITpcp3B-Kg-z7N&cver=2.20200228.00.00&

var stopRequest = function (type, url) {
    if (type === "image" || type === "stylesheet" || type === "font")
        return true;

    if (url.startsWith("data:"))
        return true;
};

var checkForAudioWebm = function (url) {
    return (url.indexOf("audio%2Fwebm") > -1);
};


exports.startDownload = async (ytbURL) => {
    try {
        console.log("Starting Download...");
        console.log("YTB: " + ytbURL);

        var option = {headless: true, ignoreHTTPSErrors: true,
                    args: ["--disable-gpu",
                            "--disable-setuid-sandbox",
                            "--no-sandbox",
                            "--enable-features=NetworkService"]};

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const result = [];

        await page.setRequestInterception(true);
        await page.setDefaultNavigationTimeout(10000);
        await page.setViewport({ width: 320, height: 568, deviceScaleFactor: 1});

        let closeBrowser = async () => await browser.close();
        let requestFlag = false;

        
            page.on("request", request => {
                if (!requestFlag)   {
                    console.log("FIRING REQUEST");
                    console.log(request.url());
                    console.log("CONTENT-TYPE: " + request.headers["content-type"]);
                    console.log("Has WEBM: ", checkForAudioWebm(request.url()));

                    
                    // Abort any requests that are: images, stylesheets or fonts
                    if (stopRequest(request.resourceType(), request.url()))
                        request.abort();
                        

                    request_client({
                        uri: request.url(),
                        resolveWithFullResponse: true
                    }).then(response => {
                        let resHeader = response.headers || "";
                        let reqType = request.resourceType() || "";

                    
                        

                            if (resHeader["content-type"] && 
                                (resHeader["content-type"].indexOf("audio/webm") > -1) /*&& response.url().indexOf("r6---") > -1*/) {
                                requestFlag = true;
                                console.log("Header::", resHeader["content-type"]);
                                console.log("Requests URL::", request.url());
                                request.abort();
                                closeBrowser();

                        // } else if (reqType === "image" || reqType === "stylesheet" || reqType === "font") {
                                // request.abort();
                            } else {
                                request.continue().catch((error) => {console.log("Continue Error:", error)});
                            }
            
                            result.push({resHeader, reqType});
                        


                    }).catch(error => {
                        console.log(error);
                        request.abort().catch((error) => {console.log("Request Error:", error)});
                    });

                }
             });

             console.log(ytbURL);
            await page.goto(ytbURL, {waitUntil: "networkidle0"});

        

        
        await browser.close();


    } catch (error) {
        console.log(error);
    }
    




};