const Joi = require("joi");


const shortStr = Joi.string().min(2).max(50);
const longStr = Joi.string().min(2).max(1000);
const dt = Joi.date();

const createNewTicketValidation = (req, res, next) => {
    const schema = Joi.object({
      subject: shortStr.required(),
      sender: shortStr.required(),
      message: longStr.required(),
      
    });
  
    console.log(req.body);
    const value = schema.validate(req.body);
  
    if (value.error) {
      return res.json({ status: "error", message: value.error.message });
    }
  
    next();
  };
  const replyTicketMessageValidation = (req, res, next) => {
    const schema = Joi.object({
      sender: shortStr.required(),
      message: longStr.required(),
    });
  
    console.log(req.body);
    const value = schema.validate(req.body);
  
    if (value.error) {
      return res.json({ status: "error", message: value.error.message });
    }
  
    next();
  };

  module.exports = {
    createNewTicketValidation,
    replyTicketMessageValidation,
  };