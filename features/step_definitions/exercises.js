var q = require('Q');
var db = require('../../persistence/db.js');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;

module.exports = function () {

    var homePage;
    this.World = function() {
        db.init(
            {
                cdbUrl: process.env.CDB_URL,
                cdbUser: process.env.CDB_USER,
                cdbPass: process.env.CDB_PASS
            }
        );

        homePage=process.env.APP_ROUTE;

    };

    this.Given(/^The following exercises exist$/, function (exerciseList) {
        return db.clearAllExercises()
            .then(function() {
                var exercises = exerciseList.hashes();
                var promises=[];
                exercises.forEach(function(exercise) {
                    promises.push(db.addExercise(exercise.name));
                });

                return q.all(promises);
            });

    });

    this.Given(/^I navigate to exercises page$/, function () {
        return browser.get("http://localhost:3000");
    });

    this.When(/^I search for (.*)$/, function (searchString) {
        return element(by.model('searchString')).sendKeys(searchString);
    });

    this.Then(/^the filtered list is (.*)$/, function (filtered) {
        var filteredArray = filtered.split(',');
        filteredArray=filteredArray.sort();
        return element.all(by.css('.exerciseTitle'))
            .then(function(list) {
                return q.all(list.map(function (entry) {
                    var text = entry.getText();
                    return text.then(function(actualText) {
                        return actualText;
                    });
                }));
            })
            .then(function(textList) {
                textList=textList.sort();
                expect(textList).to.deep.equal(filteredArray);

            });
    });
};