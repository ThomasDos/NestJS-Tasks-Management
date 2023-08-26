import * as Joi from '@hapi/joi';
export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.number(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  HASH_SECRET_JWT: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
});
