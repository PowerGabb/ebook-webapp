import Joi from 'joi';

export const registerValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});