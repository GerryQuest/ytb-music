const puppeteer = require("puppeteer");
const request_client = require("request-promise-native");

//https://www.youtube.com/watch?v=FEPFH-gz3wE

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
            request_client({
                uri: request.url(),
                resolveWithFullResponse: true
            }).then(response => {
                let resHeader = response.headers() || "";
                let reqType = requests.resourceType() || "";

               
                if (!requestFlag)   {

                    if (resHeader["content-type"] && resHeader["content-type"].indexOf("audio/webm") > -1) {
                        requestFlag = true;
                        console.log("Header::", resHeader["content-type"]);
                        console.log("Requests URL::", request.url());
                        requests.abort();

                    } else if (reqType === "image" || reqType === "stylesheet" || reqType === "font") {
                        request.abort();
                    } else {
                        request.continue();
                    }
    
                    result.push({resHeader, reqType});
                } 

                

                

            }).catch(error => {
                console.log(error);
                request.abort();
            });
        });

        console.log(ytbURL);
        await page.goto(ytbURL, {waitUntil: "networkidle0"});
        await browser.close();


    } catch (error) {
        console.log(error);
    }
    




};