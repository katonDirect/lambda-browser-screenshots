// After running the test, you can get the image from the response and save it to a file.
// run the following command:
// sam local invoke MyLambdaFunction --event test_event.json > test_response.json
// Then, run the following code:
// node get_image_from_test_response.js
// The image will be saved to the file image.png.

const fs = require('fs');

const fileContent = fs.readFileSync('test_response.json', 'utf8');
const jsonContent = JSON.parse(fileContent);

const imageBuffer = Buffer.from(jsonContent.body, 'base64');

fs.writeFileSync('test_image.png', imageBuffer);