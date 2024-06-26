# Lambda Browser Screenshots

This is fork of github project https://github.com/beneboy/lambda-browser-screenshots but this is old code which works with Node 14.x, in June 2024 Node 14.x is not supported by AWS. For Node 20.x modifications done base on https://konarskis.substack.com/p/puppeteer-aws-lambda?triedRedirect=true.

This lambda is used in PowerPoint progress report generator.

[AWS Lambda](https://aws.amazon.com/lambda/) function that gives a REST API that returns a PNG screenshot of a given 
URL. Small and easy to deploy without having to worry about S3.

## What?

A batteries-included single file NodeJS application that takes a URL query string and returns a screenshot of that 
page in PNG format. Useful to integrate as a microservice with other applications. Uses Chromium/Puppeteer to render
the pages. This should "just work" without having to figure out the right versions and host Chromium in an S3 bucket
and so on.

## How?

Build using `make`:

```shell script
$ make
```
Or if you don't have `make`, run the build steps manually:

```shell script
$ cd src
$ npm install --legacy-peer-deps
$ zip -r ../function.zip .
```
Either way, you should get an output file `function.zip`. 

Now upload the `function.zip` to your Lambda in AWS.

### AWS Setup

Supports **Node 18.x, Node 20.x** Lambda runtime.

You should set up a REST API as the trigger to the function. Make sure that you add `image/png` as a 
**Binary media type** in the REST API configuration, otherwise you'll get back base-64 encoded data.

When making the request, you must specify the HTTP header `Accept: image/png` otherwise, again, you'll get back base-64 
encoded data.

The screenshotter runs faster when you can allocate more RAM to your Lambda function, ~1600MB seems to be good to get a
screenshot back within 2-3 seconds. Depending on your region and so forth you should be able to get 1,000,000 
executions for ~$60USD. 

### Usage

The parameters that can be specified are:

- `url` (required): The URL to screenshot
- `width` (optional): The width of the browser window, defaults to `1280`
- `height` (optional): The height of the browser window, defaults to `800`

#### Example

In example used existing production funcion used in progress report

https://dmxuxud6wv36d2lecwoncs7cru0djzmt.lambda-url.us-east-1.on.aws?url=https://www.google.com

```shell script
$ curl -H "Accept: image/png"  https://dmxuxud6wv36d2lecwoncs7cru0djzmt.lambda-url.us-east-1.on.aws\?url\=https://www.example.com\&width\=800\&height\=600 > example.com.png
```

#### Testing 
Testing on the development environment

```shell script
$ npm install --save-dev @sparticuz/chromium-min
```
Install AWS SAM CLI: If you don't already have one, and run scripts in test.bat

```shell script
$ sam local invoke MyLambdaFunction --event test_event.json > test_response.json
$ node get_image_from_test_response.js
```
Response from lambda function is in test_response.json
base on body in this response is generated test_image.png
In file test_event.json are parameters for lambda function, you can change url to some creative preview link to test how screenshot will look

