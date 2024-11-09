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

  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;

  RESERVATION_DEADLINE: string;
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

    SMTP_HOST: joi.string().required(),
    SMTP_PORT: joi.number().required(),
    SMTP_USER: joi.string().required(),
    SMTP_PASS: joi.string().required(),
    SMTP_FROM: joi.string().required(),

    RESERVATION_DEADLINE: joi.string().isoDate().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
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

  smtpHost: envVars.SMTP_HOST,
  smtpPort: envVars.SMTP_PORT,
  smtpUser: envVars.SMTP_USER,
  smtpPass: envVars.SMTP_PASS,
  smtpFrom: envVars.SMTP_FROM,

  reservationDeadline: envVars.RESERVATION_DEADLINE,
};
