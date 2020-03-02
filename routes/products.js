const pgsql = require('./../utils/pgsql')
const config = require('config');
const LOG = config.logEnable ? console.log.bind(console) : function(){};

const PRODUCTS_TRUE_TO_SIZE_TABLE = 'products_true_to_size';
const attributeToColumnMap = {pid: 'pid', category: 'category', brand: 'brand', name: 'name', calculatedTrueToSize: 'calculated_true_to_size'};

/**
 * Insert product true to size data and sends the product details with the calculated true to size information.
 * @param {Object} req - the http request.
 * @param {Object} res - the http response.
 */
exports.insertProductTrueToSize = function(req, res) {
  LOG('insertProductTrueToSize');

  let pid = parseInt(req.params.pid);
  let trueToSize = parseInt(req.body.trueToSize);

  //Add the true to size value for the product
  let query = `INSERT INTO ${PRODUCTS_TRUE_TO_SIZE_TABLE}(pid, true_to_size) VALUES($1, $2);` ;
  let values = [pid, trueToSize];
  LOG(query, 'Parameter Values:' , values.join());
  pgsql.executeQuery(res, query, values, function(results){
    
    //Get the product details with calculated true to size value with 4 significant digits
    query = `SELECT pt.pid, pt.category, pt.brand, pt.name, AVG(pts.true_to_size) as calculated_true_to_size FROM ${PRODUCTS_TRUE_TO_SIZE_TABLE} pts
    INNER JOIN products pt ON pt.pid = pts.pid WHERE pts.pid = $1
    GROUP BY pt.pid, pt.brand, pt.name;` ;
    values = [pid];
    LOG(query, 'Parameter Values:' , values.join());
    pgsql.executeQuery(res, query, values, function(results){
      res.status(200).send(mapResult(results));
    });
  });
};

/**
 * Map the database column to the api attrubte name.
 * @param {Object} results - the database resultset for the product.
 * @returns {Object} - the mapped result with the attribute name.
 */
function mapResult(results) {
  let mappedResult = {};
  //Map the result for product details
  if (results != null && results.rows != null && Array.isArray(results.rows) && results.rows.length === 1) {
    let attributeKeys = Object.keys(attributeToColumnMap);
    for(let attribute of attributeKeys) {
      mappedResult[attribute] = results.rows[0][attributeToColumnMap[attribute]];
    }
  }
  else {
    //Nothing to map
  }
  return mappedResult;
}