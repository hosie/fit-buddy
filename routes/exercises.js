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
var exerciseManager = require('../exercises/exercises.js');
var services = {};

if (typeof process.env.VCAP_SERVICES !== 'undefined') {
    services = JSON.parse(process.env.VCAP_SERVICES);
}

router.get('/', function (req, res) {

    exerciseManager.list()
    .then(
        function(exercises) {
            console.log("got exercises");
            console.log(JSON.stringify(exercises,null,2));
            res.json(exercises);
        }
    );
});

router.post('/', function (req, res) {
    try {

        console.log("POST:");
        console.log(req.body);
        var exercise = req.body;
        exerciseManager.upsert(exercise)
        .then(function() {
            res.status(200);
            res.end();
        })
        .catch(function (error) {
            console.log("Error " + error.message);
            res.status(500);
            res.json(error.message);
        });
    } catch (err) {
        console.log("Caught error");
        console.dir(err);
        console.log(err.stack);
        res.status(500);
        res.json(err.message);
        res.end();

    }
});

module.exports = router;
