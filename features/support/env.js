var conf = require('nconf');
//use environmnet variables only
conf.env();
var configure = function () {
    this.setDefaultTimeout(60 * 1000);
};

module.exports = configure;
