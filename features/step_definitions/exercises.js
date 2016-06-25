var q = require('Q');
var db = require('../../persistence/db.js');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;

var myStepDefinitionsWrapper = function () {

    var homePage;
    var currentExerciseName;

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


    this.Given(/^I click on exercise (.*)$/, function (exerciseName) {

        currentExerciseName=exerciseName;
        return element.all(by.repeater("exercise in exercises"))
        .all(by.css('.exerciseTitle'))
        .filter(function(elem) {
            return elem.getText()
            .then(function(text) {
                return text === exerciseName;
            });
        })
        .first()
        .click();
    });

    this.Given(/^I click on finish button Smashed it$/, function () {
        return element.all(by.css(".smashedItButton"))
        .first()
        .click();
    });

    this.When(/^I enter a new target of (.*)$/, function (target) {
        var form =  element.all(by.repeater("exercise in exercises"))
        .filter(function(elem) {
            return elem.element(by.css('.exerciseTitle'))
            .getText()
            .then(function(text) {
                return text === currentExerciseName;
            });
        })
        .first()
        .element(by.css(".new-target-form"));

        return form.element(by.model("exercise.currentTarget"))
        .sendKeys(target)
        .then(function() {
            return form.element(by.css(".btn"))
            .click();
        });


    });

    this.Then(/^Current target for bench press is (.*)$/, function (expectedTarget) {
        return element.all(by.repeater("exercise in exercises"))
        .filter(function (elem) {
            return elem.element(by.css('.exerciseTitle'))
            .getText()
            .then(function (text) {
                return text === currentExerciseName;
            });
        })
        .first()
        .element(by.css(".current-target-display"))
        .getText()
        .then(function (updatedText) {
            expect(updatedText).to.equal(expectedTarget);
        });
    });

    this.Then(/^After page reload, current target for bench press is (.*)$/, function (expectedTarget) {
        return browser.get("http://localhost:3000")
        .then(function() {
            return element.all(by.repeater("exercise in exercises"))
            .filter(function (elem) {
                return elem.element(by.css('.exerciseTitle'))
                .getText()
                .then(function (text) {
                    return text === currentExerciseName;
                });
            })
            .first()
            .element(by.css(".current-target-display"))
            .getText()
        })
        .then(function (updatedText) {
            expect(updatedText).to.equal(expectedTarget);
        });
    });

};
module.exports = myStepDefinitionsWrapper;