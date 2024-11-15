import 'dotenv/config';
import * as joi from 'joi';

interface IEnvVars {
  PORT: number;

  CLIENT_BASE_URL: string;

  DATABASE_URL: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

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

    CLIENT_BASE_URL: joi.string().uri().required(),

    DATABASE_URL: joi.string().required(),

    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().required(),

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

  clientBaseUrl: envVars.CLIENT_BASE_URL,

  databaseUrl: envVars.DATABASE_URL,

  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,

  smtpHost: envVars.SMTP_HOST,
  smtpPort: envVars.SMTP_PORT,
  smtpUser: envVars.SMTP_USER,
  smtpPass: envVars.SMTP_PASS,
  smtpFrom: envVars.SMTP_FROM,

  reservationDeadline: envVars.RESERVATION_DEADLINE,
};
