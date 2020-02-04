
const { validationResult } = require('express-validator');

module.exports.validate = (req,res, next)=> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }
  next()
}