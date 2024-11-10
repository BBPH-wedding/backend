import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { SUBJECT_MAIL, TEMPLATES_MAIL } from 'src/constants';
import { TContextMail } from 'src/interfaces';
import { IReservation } from 'src/interfaces/reservation.interface';

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  private readonly CLIENT_BASE_URL = envs.clientBaseUrl;

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: TContextMail,
  ) {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }

  async sendConfirmationEmail(email: string, code: string) {
    const subject: SUBJECT_MAIL = SUBJECT_MAIL.CONFIRM_EMAIL;
    const template: TEMPLATES_MAIL = TEMPLATES_MAIL.CONFIRM_EMAIL;
    const context: TContextMail = {
      code,
    };

    await this.sendMail(email, subject, template, context);
  }

  async sendNewReservationEmail(email: string, reservation: IReservation) {
    const subject: SUBJECT_MAIL = SUBJECT_MAIL.NEW_RESERVATION;

    const templateUser: TEMPLATES_MAIL = TEMPLATES_MAIL.NEW_RESERVATION_USER;
    const templateCouple: TEMPLATES_MAIL =
      TEMPLATES_MAIL.NEW_RESERVATION_COUPLE;

    const context: TContextMail = {
      reservation,
    };

    //Enviar email al usuario
    await this.sendMail(email, subject, templateUser, context);

    //Enviar email a la pareja
    await this.sendMail(envs.smtpUser, subject, templateCouple, context);
  }

  async sendUpdatedReservationEmail(email: string, reservation: IReservation) {
    const subject: SUBJECT_MAIL = SUBJECT_MAIL.UPDATED_RESERVATION;

    const templateUser: TEMPLATES_MAIL =
      TEMPLATES_MAIL.UPDATED_RESERVATION_USER;
    const templateCouple: TEMPLATES_MAIL =
      TEMPLATES_MAIL.UPDATED_RESERVATION_COUPLE;

    const context: TContextMail = {
      reservation,
    };

    //Enviar email al usuario
    await this.sendMail(email, subject, templateUser, context);

    //Enviar email a la pareja
    await this.sendMail(envs.smtpUser, subject, templateCouple, context);
  }

  async sendResetPassword(user: string, email: string, token: string) {
    const url = `${this.CLIENT_BASE_URL}/resetPassword?token=${token}`;
    const subject: SUBJECT_MAIL = SUBJECT_MAIL.NEW_PASSWORD;
    const template: TEMPLATES_MAIL = TEMPLATES_MAIL.RESET_PASSWORD;
    const context: TContextMail = {
      url,
    };
    await this.sendMail(email, subject, template, context);
  }
}
