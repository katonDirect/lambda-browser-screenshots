REM Run lambda function locally
sam local invoke MyLambdaFunction --event test_event.json > test_response.json

REM Get image from test_response.json
node get_image_from_test_response.js
