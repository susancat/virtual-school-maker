//better to have two sets of keys, one store remotely in heroku to prevent local meachine lost
//keys.js figure out what set of credential returns
//ENV tells us if we run in prodution/dev 
if (process.env.NODE_ENV === 'production') {
    //production mode
    module.exports = require('./prod');
} else {
    //dev mode
    module.exports = require('./dev');
}