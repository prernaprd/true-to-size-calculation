const errorMessage = require('./utils/errorMessage');
const config = require('config');
const LOG = config.logEnable ? console.log.bind(console) : function(){};

/**
 * @function allowHeaders
 * @description Set access control header for the allowed method, origins, credentials and headers.
 * @param {Object} req - the http request.
 * @param {Object} res - the http response.
 * @param {function()} next - the function to be called on completion.
 */
exports.allowHeaders = function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); 
  next();
}

/**
 * @function authentication
 * @description Validate request based on api key.
 * @param {Object} req - the http request.
 * @param {Object} res - the http response.
 * @param {function()} next - the function to be called on completion.
 */
exports.authentication = function(req, res, next) {
  if(req.method === 'OPTIONS') {
    LOG('OPTIONS is sent');
    res.sendStatus(200);
  }
  else if(req.body != null && req.query != null && req.headers['x-api-key'] === config.apiKey) {
    LOG(`${req.method} : ${req.url}`);
    LOG(`Passed authentication for IP address: ${req.connection.remoteAddress}`);
    next();
  }
  else {
    LOG(`Failed authentication for IP address: ${req.connection.remoteAddress}`);
    res.sendStatus(errorMessage.ER_403.errorCode);
  }
}