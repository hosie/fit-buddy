var db = require('../persistence/db.js');

module.exports = {

    list: function() {
        var dbClient = new db.Client('exercises');
        return dbClient.list();
    }

};