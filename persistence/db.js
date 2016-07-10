var conf    = require('nconf');
var request = require('request-promise');


function Client(name) {
    this.name    = name;
    this.cdbUrl  = conf.get('CDB_URL');
    this.cdbUser = conf.get('CDB_USER');
    this.cdbPass = conf.get('CDB_PASS');
}

Client.prototype.list = function () {

    var options = {
        url: this.cdbUrl + "/"  + this.name + "/_all_docs?include_docs=true",
        json: true,
        auth: {
            user: this.cdbUser,
            pass: this.cdbPass,
            sendImmediately: true
        }
    };

    return request.get(options)
        .then(function (response) {
            return response.rows.map(function(row) {
                return row.doc;
            });
        });
};


Client.prototype.upsert = function (doc) {

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
