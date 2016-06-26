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


Set VCAP_SERVICES with cloudant binding and then start the server

Start selenium 
```
node_modules\.bin\webdriver-manager start
```

Set the following environment variables
 - CDB_URL
 - CDB_USER
 - CDB_PASS

Then run the tests

``` 
npm run e2e
```