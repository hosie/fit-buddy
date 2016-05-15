var q = require('Q');
var db = require('../../persistence/db.js');
module.exports = function () {

    this.World = function() {
        db.init(
            {
                cdbUrl: process.env.CDB_URL,
                cdbUser: process.env.CDB_USER,
                cdbPass: process.env.CDB_PASS
            }
        );
    };

    this.Given(/^The following exercises exist$/, function (exerciseList) {
        var exercises = exerciseList.hashes();
        var promises=[];
        exercises.forEach(function(exercise) {
            promises.push(db.addExercise(exercise.name));
        });
        return q.all(promises);
    });

    this.When(/^I search for (.*)$/, function (searchString) {

    });

    this.Then(/^the filtered list is (.*)$/, function (filtered) {


    });
};