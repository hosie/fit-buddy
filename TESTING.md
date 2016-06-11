### To run unit tests

```
npm test
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
node_modules\.bin\protractor protractor-conf.js
```