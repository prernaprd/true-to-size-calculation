const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const config = require('config');
const LOG = config.logEnable ? console.log.bind(console) : function(){};
const auth = require('./auth');
const errorMessage = require('./utils/errorMessage');
const products = require('./routes/products');
const schema = require('./routes/productsSchema');
const {checkSchema, validationResult} = require('express-validator');
const app = express();
const port = config.port;

/**
 * @function getPath
 * @description Joins the path with the base path and the version.
 * @param {string} path - the requested path.
 * @returns {string} - the concatenated path with version and base path.
 */
function getPath(path) {
  return `/${config.version}${config.basePath}${path}`;
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    res.status(error.status).send({errors: [{msg: error.message}]});
  } 
  else {
    next();
  }
});

// add cors and authentication
app.use(auth.allowHeaders);
app.use(auth.authentication);

// route mapping
app.post(getPath('/products/:pid/true-to-size'), [checkSchema(schema.VALIDATION_RULE)], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    LOG(errors.array());
    res.status(errorMessage.ER_400.errorCode).send({errors: errors.array()});
  }
  else {
    products.insertProductTrueToSize(req, res);
  }
});

http.createServer(app).listen(port, () =>
  LOG(`Express server listening on port ${port}`)
);

module.exports = app;