const errorMessage = require('./../utils/errorMessage');

exports.VALIDATION_RULE = {
  'pid' : {
    in: ['params'],
    isInt : {
      options : [{min: 1}],
      errorMessage : `${errorMessage.ER_INVALID_VALUE.description} > 1`
    }
  },
  'trueToSize' : {
    in: ['body'],
    notEmpty : true,
    errorMessage : errorMessage.ER_MISSING_MANDATORY_FIELD.description,
    bail: true,
    isInt : {
      options : [{min: 1, max: 5}],
      errorMessage : `${errorMessage.ER_INVALID_VALUE.description} 1|2|3|4|5`
    }
  }
};