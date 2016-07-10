### To run style, lint and server unit tests
```
npm test
```


### To run unit tests

*Server unit tests*
```
npm run test-server
```

*Client side unit tests*
```
npm run test-client
```

###  To run end to end tests

install the selenium standalone jar
```
node node_modules\gulp-protractor\node_modules\protractor\bin\webdriver-manager update
```

Set VCAP_SERVICES with cloudant binding and then start the server

Run the tests 
```
gulp e2e-test
```
