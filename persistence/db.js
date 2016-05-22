var q = require('Q');
var cdbUrl;
var request = require('request-promise');

function addExercise(name) {

    var requestBody = {
        name: name
    };

    var options = {
        url: cdbUrl+"/exercises",
        json: true,
        body: requestBody,
        auth: {
            user: cdbUser,
            pass: cdbPass,
            sendImmediately: true
        }
    };

    return request.post(options);
}

function init(env) {
    cdbUrl  = env.cdbUrl;
    cdbUser = env.cdbUser;
    cdbPass = env.cdbPass;
}

function clearAllExercises() {
    var options = {
        url: cdbUrl+"/exercises",
        auth: {
            user: cdbUser,
            pass: cdbPass,
            sendImmediately: true
        }
    };
    return request.delete(options)
        .then(function() {
            return request.put(options);
        });
}

module.exports = {
    clearAllExercises: clearAllExercises,
    addExercise: addExercise,
    init: init
};
