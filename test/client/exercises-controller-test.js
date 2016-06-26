
var expect=chai.expect;
describe('ExecisesController', function() {
    var $scope;
    var controller;

    beforeEach(module('FitBuddyApp'));

    beforeEach(inject(function($rootScope, $controller) {
        // create a new $scope for each test
        $scope = $rootScope.$new();

        // use the new $scope in creating the controller
        controller = $controller("ExercisesController", {
            $scope: $scope
        });

    }));

    it('does stuff', function() {
        expect(controller).not.to.equal(null);
    });
});
