
var expect=chai.expect;
describe('ExecisesController', function() {
    var $scope;
    var controller;
    var $httpBackend;
    var testExercises = [
        {
            name: "exercise 1"
        },
        {
            name: "exercise 2"
        }
    ];

    beforeEach(module('FitBuddyApp'));

    beforeEach(inject(function($injector, $rootScope, $controller) {

        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');

        // backend definition common for all tests
        $httpBackend.when('GET', 'exercises')
        .respond(testExercises);

        // create a new $scope for each test
        $scope = $rootScope.$new();

        // use the new $scope in creating the controller
        controller = $controller("ExercisesController", {
            '$scope': $scope
        });
        $httpBackend.flush();

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('does stuff', function() {
        expect($scope.update).to.be.a('function');
        expect($scope.create).to.be.a('function');
        expect($scope.exercises).to.deep.equal(testExercises);
    });

    describe('create', function() {
        it('posts an object', function() {
            $httpBackend.when('POST', 'exercises')
                .respond();
            $scope.create('testExerciseName');
            $httpBackend.flush();
        });
    });


    describe('update', function() {
        it('posts an object', function() {
            $httpBackend.when('POST', 'exercises')
            .respond();
            $scope.update('testExerciseName');
            $httpBackend.flush();
        });
    });
});
