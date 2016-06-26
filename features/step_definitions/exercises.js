var q = require('Q');
var db = require('../../persistence/db.js');
var chai = require('chai');
var expect = chai.expect;

var myStepDefinitionsWrapper = function () {

    var homePage;
    var dbClient;

    this.World = function() {
        dbClient = new db.Client('exercises');

        homePage=process.env.APP_ROUTE;

    };

    this.Given(/^The following exercises exist$/, function (exerciseList) {
        return dbClient.splat()
        .then(function() {
            var exercises = exerciseList.hashes();
            var promises=[];
            exercises.forEach(function(exercise) {
                promises.push(dbClient.upsert({name: exercise.name}));
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

    this.When(/^I update target of (.*) to (.*)$/, function (exerciseName, target) {
        var form =  element.all(by.repeater("exercise in exercises"))
        .filter(function(elem) {
            return elem.element(by.css('.exerciseTitle'))
            .getText()
            .then(function(text) {
                return text === exerciseName;
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

    this.Then(/^Current target for (.*) is (.*)$/, function (exerciseName, expectedTarget) {
        return element.all(by.repeater("exercise in exercises"))
        .filter(function (elem) {
            return elem.element(by.css('.exerciseTitle'))
            .getText()
            .then(function (text) {
                return text === exerciseName;
            });
        })
        .first()
        .element(by.css(".current-target-display"))
        .getText()
        .then(function (actualTarget) {
            expect(actualTarget).to.equal(expectedTarget);
        });
    });

};
module.exports = myStepDefinitionsWrapper;