import 'dotenv/config';
import * as joi from 'joi';

interface IEnvVars {
  PORT: number;

  DATABASE_URL: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  ACCESS_PASSWORD: string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  MAX_FILE_SIZE: number;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),

    DATABASE_URL: joi.string().required(),

    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().required(),

    ACCESS_PASSWORD: joi.string().required(),

    CLOUDINARY_CLOUD_NAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),

    MAX_FILE_SIZE: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message} `);
}

const envVars: IEnvVars = value;

export const envs = {
  port: envVars.PORT,

  databaseUrl: envVars.DATABASE_URL,

  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,

  accessPassword: envVars.ACCESS_PASSWORD,

  cloudinaryCloudName: envVars.CLOUDINARY_CLOUD_NAME,
  cloudinaryKey: envVars.CLOUDINARY_API_KEY,
  cloudinarySecret: envVars.CLOUDINARY_API_SECRET,

  maxFileSize: envVars.MAX_FILE_SIZE,
};
