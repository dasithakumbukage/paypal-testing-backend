/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(5000).required(),
  PAYPAL_CLIENT_ID: Joi.string().required(),
  PAYPAL_CLIENT_SECRET: Joi.string().required(),
  PAYPAL_BASE_URL: Joi.string().required(),
});
