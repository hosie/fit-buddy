'use strict';

// Declare app level module which depends on views, and components
angular.module('FitBuddyApp', [
        'ngRoute',
        'FitBuddyApp.Exercises'
    ])
    .config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/main', {
            templateUrl: 'views/main/main.html',
            controller:  'MainController'
        })
        .when('/exercises', {
            templateUrl: 'exercises.html',
            controller: 'ExercisesController'
        });
    }])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/exercises'});
    }])
    .controller('MainController', function () {

    });
