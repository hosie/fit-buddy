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

var fitBuddyApp = angular.module('FitBuddyApp', []);

fitBuddyApp.controller('ExercisesController', function ($scope, $http) {


    $http.get('exercises').success(function (data) {
        $scope.exercises = data;
    });

    $scope.update = function (exercise) {
        console.log("posting" + exercise);
        $http.post('exercises', exercise);
    };

    $scope.create = function (name) {
        console.log("new " + name);
        var newExercise = {
            "name": name
        };
        var newExerciseString = JSON.stringify(newExercise);
        console.log("posting " + newExerciseString);
        $http.post('exercises', newExerciseString).success(function (data) {
            console.log("got POST response" + data);
            $scope.exercises.push(newExercise);

        });


    };
});
