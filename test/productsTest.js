const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const config = require('config');
const pgSql = require('pg');

chai.use(chaiHttp);

/**
 * @function prepareDbForTesting
 * @description Prepare the database to original state to validate the test cases.
 * @param {function()} done - to be called on completion.
 */
function prepareDbForTesting(done) {
  let pgClient = new pgSql.Client(config.pgSql);
  pgClient.connect(function(err) {
    if(err) {
      throw err;
    }
    else {
      pgClient.query('SELECT unit_test_func();', function(err) {
        if(err) {
          throw err;
        }
        else {
          pgClient.end(function(err) {
            if(err) {
              throw err;
            }
            else {
              done();
            }
          });
        }
      });       
    }
  });
}

describe('Products Unit and Integration test', function() {
  
  let agent;
  let pid = 1;
  before(function(done){
    agent = chai.request.agent(server);
    done();
  });

  describe('POST /v1.0/api/products/:pid/true-to-size with valid request and incorrect authorization', function() {
    it('it should not insert any true-to-size data for invalid api key', function(done) {
      let sizeData = {};

      agent
      .post(`/v1.0/api/products/${pid}/true-to-size`)
      .send(sizeData)
      .end(function(err,res) {
        res.should.have.status(403);
        done();
      });
    });
  }); 

  describe('POST /v1.0/api/products/:pid/true-to-size with invalid request', function() {
    it('it should not add true-to-size data for invalid true to size value', function(done) {
      let sizeData = {"trueToSize": "invalidNumber"};

      agent
      .post(`/v1.0/api/products/${pid}/true-to-size`)
      .set('x-api-key', config.apiKey)
      .send(sizeData)
      .end(function(err,res) {
        res.should.have.status(400);
        res.body.errors[0].value.should.equal('invalidNumber');
        res.body.errors[0].param.should.equal('trueToSize');
        res.body.errors[0].location.should.equal('body');
        done();
      });
    });

    it('it should not add true-to-size data for missing true to size value', function(done) {
      let sizeData = {};

      agent
      .post(`/v1.0/api/products/${pid}/true-to-size`)
      .set('x-api-key', config.apiKey)
      .send(sizeData)
      .end(function(err,res) {
        res.should.have.status(400);
        res.body.errors[0].param.should.equal('trueToSize');
        res.body.errors[0].location.should.equal('body');
        res.body.errors[0].msg.should.equal('Missing mandatory field');
        done();
      });
    });

    it('it should not add true-to-size data for invalid product id value', function(done) {
      let sizeData = {"trueToSize": 2};
      let invalidPid = "invalidNumber"

      agent
      .post(`/v1.0/api/products/${invalidPid}/true-to-size`)
      .set('x-api-key', config.apiKey)
      .send(sizeData)
      .end(function(err,res) {
        res.should.have.status(400);
        res.body.errors[0].param.should.equal('pid');
        res.body.errors[0].location.should.equal('params');
        res.body.errors[0].value.should.equal('invalidNumber');
        done();
      });
    });

    it('it should not add true-to-size data for invalid product id value which doesn not exist in system', function(done) {
      let sizeData = {"trueToSize": 2};
      let invalidPid = 3989;

      agent
      .post(`/v1.0/api/products/${invalidPid}/true-to-size`)
      .set('x-api-key', config.apiKey)
      .send(sizeData)
      .end(function(err,res) {
        res.should.have.status(400);
        res.body.errors[0].param.should.equal('pid');
        res.body.errors[0].msg.should.equal('Violates foreign key constraint');
        done();
      });
    });
  }); 

  describe('POST /v1.0/api/products/:pid/true-to-size with valid request and correct authorization', function() {
    before(function(done){
      setTimeout(function(){
        prepareDbForTesting(function () {
          done();
        });
      }, 10000);
    });
    
    it('it should successfully add true-to-size data and get the product details with the calculated true-to-size', function(done) {
      let sizeData = {"trueToSize": 2};

      setTimeout(function(){
        agent
        .post(`/v1.0/api/products/${pid}/true-to-size`)
        .set('x-api-key', '0fc6ef76-5b40-11ea-bc55-0242ac130003')
        .send(sizeData)
        .end(function(err,res) {
          res.should.have.status(200);
          res.body.pid.should.equal(1);
          res.body.category.should.equal('Sneakers');
          res.body.brand.should.equal('Adidas');
          res.body.name.should.equal('Yeezy');
          res.body.calculatedTrueToSize.should.equal(2);
          done();
        });
      }, 10000);
    });

    it('it should successfully add true-to-size data and calculated true-to-size value should be correct average value of all true-to-size data', function(done) {
      let sizeData = {"trueToSize": 4};

      setTimeout(function(){
        agent
        .post(`/v1.0/api/products/${pid}/true-to-size`)
        .set('x-api-key', '0fc6ef76-5b40-11ea-bc55-0242ac130003')
        .send(sizeData)
        .end(function(err,res) {
          res.should.have.status(200);
          res.body.pid.should.equal(1);
          res.body.category.should.equal('Sneakers');
          res.body.brand.should.equal('Adidas');
          res.body.name.should.equal('Yeezy');
          res.body.calculatedTrueToSize.should.equal(3);
          done();
        });
      }, 10000);
    });
  }); 
});