var sinon = require('sinon');
var chai = require('chai');
var expect=chai.expect;
var exercises = require('../../exercises/exercises.js');
var db = require('../../persistence/db.js');
var q = require('q');
describe('exercise', function() {
    describe('list', function() {
        var dbClient_stub;
        var testData_allExercises = [
            {
                name: "shoulder press"
            },
            {
                name: "squats"
            }
        ];
        var mockDbClient = {
            list: function() { return q.resolve(testData_allExercises);}
        };
        beforeEach(function() {
            dbClient_stub = sinon.stub(db,'Client');
            dbClient_stub.withArgs('exercises').returns(mockDbClient);
        });
        afterEach(function() {
            dbClient_stub.restore();
        });
        it('resolves with all exercises', function(done) {
            exercises.list()
                .then(function(exercises) {
                    expect(exercises).to.be.an('array');
                    expect(exercises).to.deep.equal(testData_allExercises);
                    done();

                }).catch(done);

        });
    });
});