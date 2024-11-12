import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { envs } from 'src/config/envs';
import { EntryVerificationDto, SignInDto } from './dto';
import { MailsService } from '../mails/mails.service';
import { ReservationService } from '../reservations/reservations.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailsService: MailsService,
    private readonly reservationService: ReservationService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const checkReservation = await this.reservationService.findByEmail(email);
    if (!checkReservation)
      throw new UnauthorizedException('Invalid Credentials');

    const checkPass = await bcrypt.compare(password, checkReservation.password);
    if (!checkPass) throw new UnauthorizedException('Invalid Credentials');

    if (!checkReservation.isConfirmedEmail)
      return {
        message:
          'You must confirm your email to complete your reservation details. Vuelve a crear la reserva',
      };

    const payload = {
      email: checkReservation.email,
    };

    const token = this.jwtService.sign(payload);

    return token;
  }

  async pruebaEmail(body: any) {
    const email = body.email;

    await this.mailsService.sendMail(email, 'prueba', body.template, {
      [body.key]: body.context,
    });
  }
}
