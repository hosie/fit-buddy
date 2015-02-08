/*
Copyright 2015 
Author John Hosie 
 
The MIT License (MIT) 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

 
  Contributors:
      John Hosie - initial implementation 
*/
var express = require('express');
var router = express.Router();
var https=require('https');
var url=require('url');

var services ={};

if(undefined !=process.env.VCAP_SERVICES)
{
  services=JSON.parse(process.env.VCAP_SERVICES);
}

var cloudantAccountHost = services.cloudantNoSQLDB[0].credentials.host;
var auth= services.cloudantNoSQLDB[0].credentials.username + ":" + services.cloudantNoSQLDB[0].credentials.password;
var dburl="https://" + auth + "@" + cloudantAccountHost + "/exercises";
var queryUrl=dburl+"/_all_docs?include_docs=true";

console.log("url");
console.dir(url.parse(queryUrl));
/* GET home page. */
router.get('/', function(req, res) {

  console.log("querying database for all excecises: " + queryUrl);
  //res.send(exercises);
  https.get(queryUrl,function(dbres){
    var data="";
    console.log("got response ");
    dbres.on('data',function(chunk){

      console.log("got chunk " + chunk);
      data=data+chunk;
    });
    dbres.on('end',function(){
      console.log("end");
      var exercises =JSON.parse(data).rows;
      var result=[];
      var numberOfExercises=exercises.length;
      exercises.forEach(function(exercise,index){
        console.log("next exercise");
        result.push(exercise.doc);
        if(result.length==exercises.length)
        {

          console.log("last exercise");
          res.send(result);
        }
      });
      
    });


  }).on('error',function(err){
    console.log("got Error");
    console.dir(err);
    res.status(err.statusCode);

  });
});

router.post('/',function(req,res){
  try
  {
    console.log("POST:");
    console.log(req.body);
    var exercise=req.body;
  
    console.log("parsed body");
    console.dir(exercise);
    //create a new exercise
    var options = {
      hostname: cloudantAccountHost,
      port:443,
      method: 'POST',
      auth:auth,
      path:"/exercises",
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
  
    var dbResponseString="";
    console.log("creating request to " + options.hostname + options.path);
    var dbReq = https.request(options, function(dbres) {
      console.log('STATUS: ' + dbres.statusCode);
      console.log('HEADERS: ' + JSON.stringify(dbres.headers));
      dbres.setEncoding('utf8');
      dbres.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        dbResponseString=dbResponseString+chunk;
      });
      dbres.on('end',function(){
        var dbResponseObject=JSON.parse(dbResponseString);
        res.send(dbResponseObject);
      });
    });
  
    console.log("created request");
    dbReq.on('error', function(err) {
      console.log('problem with request: ' + err.message);
      //TODO
      console.dir(err);
      res.status(err.statusCode);
    });
  
    // write data to request body
    var dbReqString = JSON.stringify(exercise);
    console.log("writing: " + dbReqString);
    dbReq.write(dbReqString);
    dbReq.end();
  } catch(err)
  {
    console.log("Caught error");
    console.dir(err);

  }
});

module.exports = router;
