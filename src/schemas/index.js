import Joi from 'joi';

const user = {
  email: Joi.string()
    .email()
    .required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  password: Joi.string().required(),
}

export default {
  user,
};
