import * as Joi from 'joi';

const configSchema = Joi.object({
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_HOST: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),

  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASSWORD_CODE: Joi.string().required(),

  JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
  JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.number().required(),
  EMAIL_CONFIRMATION_URL: Joi.string().required(),

  STRIPE_PUBLISHABLE_KEY: Joi.string().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_CURRENCY: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  CALLBACK_URL: Joi.string().required(),

  FB_CLIENT_ID: Joi.string().required(),
  FB_CLIENT_SECRET: Joi.string().required(),
  FB_CALLBACK_URL: Joi.string().required(),
});

export default configSchema;
