const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium-min');
const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 800;


exports.handler = async (event, context, callback) => {
    if (typeof event.queryStringParameters.url === "undefined") {
        callback((new Error("url query string parameter must be set.")));
        return {
            isBase64Encoded: false,
            headers: {
                'Content-Type': 'text/plain'
            },
            statusCode: 400,
            body:'"url query string parameter must be set.'
        };
    }

    let screenshotBuffer = null;
    let browser = null;
    let width = parseInt(event.queryStringParameters.width);

    if (isNaN(width))
        width = DEFAULT_WIDTH;

    let height = parseInt(event.queryStringParameters.height);

    if (isNaN(height))
        height = DEFAULT_HEIGHT;

    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(
                'https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar',
            ),
            headless: chromium.headless,
        });
        
        let page = await browser.newPage();

        await page.goto(event.queryStringParameters.url);

        screenshotBuffer = await page.screenshot({encoding: 'base64'});
    } catch (error) {
        return {
            isBase64Encoded: false,
            headers: {
                'Content-Type': 'text/plain'
            },
            statusCode: 500,
            body: `Browser error: ${error}`
        };
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'image/png'
        },
        isBase64Encoded: true,
        body: screenshotBuffer
    };
};
