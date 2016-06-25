var q = require('Q');

var request = require('request-promise');


function Client(env) {
    this.name    = env.name;
    this.cdbUrl  = env.cdbUrl;
    this.cdbUser = env.cdbUser;
    this.cdbPass = env.cdbPass;
}

Client.prototype.insert = function (doc) {



    var options = {
        url: this.cdbUrl + "/"  + this.name,
        json: true,
        body: doc,
        auth: {
            user: this.cdbUser,
            pass: this.cdbPass,
            sendImmediately: true
        }
    };

    return request.post(options);
};

Client.prototype.splat= function () {
    var options = {
        url: this.cdbUrl + "/" + this.name,
        auth: {
            user: this.cdbUser,
            pass: this.cdbPass,
            sendImmediately: true
        },
        json: true
    };
    return request.delete(options)
        .then(function() {
            return request.put(options);
        })
        .catch(function(error) {
            console.log(error.message);
            console.dir(error);
            if(error.error.reason==='Database does not exist.') {
                //ignore this error and create the db anyway
                return request.put(options);
            }else {
                return error;
            }
        });
};

module.exports = {
    //clearAllExercises: clearAllExercises,
    //addExercise: addExercise,
    Client: Client
};
