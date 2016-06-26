var sinon = require('sinon');
var chai = require('chai');
var expect=chai.expect;
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

var exercises = require('../../exercises/exercises.js');
var db = require('../../persistence/db.js');
var q = require('q');
describe('exercise', function() {

    var dbClient_stub;

    var mockDbClient = {
        list:   function() { return q.resolve([]);},
        upsert: function() { return q.resolve();}
    };
    beforeEach(function() {
        dbClient_stub = sinon.stub(db,'Client');
        dbClient_stub.withArgs('exercises').returns(mockDbClient);
    });
    afterEach(function() {
        dbClient_stub.restore();
    });

    describe('list', function() {
        var testData_allExercises = [
            {
                name: "shoulder press"
            },
            {
                name: "squats"
            }
        ];
        var mockDbClientList_stub;
        beforeEach(function() {
            mockDbClientList_stub = sinon.stub(mockDbClient,'list');
            mockDbClientList_stub.returns(q.resolve(testData_allExercises));
        });
        afterEach(function() {
            mockDbClientList_stub.restore();
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

    describe('upsert', function() {
        var mockDbClientUpsert_stub;

        beforeEach(function() {
            mockDbClientUpsert_stub = sinon.spy(mockDbClient,'upsert');
        });

        afterEach(function() {
            mockDbClientUpsert_stub.restore();
        });

        it('calls upsert on the persistence layer', function(done) {
            exercises.upsert({name: "testDoc"})
                .then(function() {
                    expect(mockDbClientUpsert_stub).to.have.been.calledWith(sinon.match({name: "testDoc"}));
                    done();
                })
                .catch(done);
        });
    });
});