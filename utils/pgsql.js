const config = require('config');
const LOG = config.logEnable ? console.log.bind(console) : function(){};
const errorMessage = require('./errorMessage');
const pgSql = require('pg');
const types = pgSql.types;
const dbConnection = config.pgSql;
const pool = new pgSql.Pool(dbConnection);

const FOREIGN_KEY_VIOLATION_CODE = '23503';
const CHECK_VIOLATION_CODE = '23514';
const PGSQL_DECIMAL_OID = 1700;

// set type to ensure database data type is maitanined while returning it
types.setTypeParser(PGSQL_DECIMAL_OID, function(stringValue) {
  return parseFloat(stringValue);
});

/**
 * Connect with Postgres database and execute query.
 * @param {Object} res - the response object.
 * @param {string} query - the query to be executed.
 * @param {*[]} values - array of values for parameters in query.
 * @param {function(Object)} next - the function to be called on the completion.
 */
exports.executeQuery = function(res, query, values, next) {
  LOG('executeQuery');

  //Connect to database
  pool.connect(function(error, client, done) {
    if(error) {
      LOG(`Error connecting database: ${error.message}`);
      res.status(errorMessage.ER_500.errorCode).send({errors: [{msg: errorMessage.ER_DATABASE_CONNECTION.description}]});
    }
    else {
      //Query execution
      client.query(query, values, function(error, result){
        done();
        if(error) {
          let errorResult = parseQueryError(error);
          LOG(`Query Error: ${errorResult.msg}`);
          res.status(errorMessage.ER_400.errorCode).send({errors: [errorResult]});
        }
        else {
          next(result);
        }
      });
    }
  });
}

/**
 * Parse the error object in the standard format.
 * @param {Object} error - the error object sent after exeuting query.
 * @returns {Object} - the parsed error object.
 */
function parseQueryError(error) {
  var errorResult = {};
  if (error != null && error.code != null && error.message != null) {
    switch(error.code) {
      case FOREIGN_KEY_VIOLATION_CODE:
        errorResult.msg = errorMessage.ER_FOREIGN_KEY_VIOLATION.description;
        errorResult.param = 'pid';
        break;
      case CHECK_VIOLATION_CODE:
        errorResult.msg = errorMessage.ER_CHECK_VIOLATION.description;
        errorResult.param = 'trueToSize';
        break;        
      default:
        errorResult.msg = errorMessage.ER_DATABASE_QUERY.description;
        break;
    }
  }
  else {
    //Nothig to parse
  }
  return errorResult;
}