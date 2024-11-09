import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { envs } from 'src/config/envs';
import { MailsService } from './mails.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: envs.smtpHost,
        port: envs.smtpPort,
        auth: {
          user: envs.smtpUser,
          pass: envs.smtpPass,
        },
      },
      defaults: {
        from: `Tores Pies <${envs.smtpFrom}>`,
      },
      template: {
        dir: join(__dirname, '../../../templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
