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

  async entryVerification(entryVerificationDto: EntryVerificationDto) {
    const { password } = entryVerificationDto;

    // console.log(bcrypt.hashSync(password, 10));

    const isOkPassword = bcrypt.compareSync(password, envs.accessPassword);

    if (!isOkPassword) throw new ForbiddenException('Contraseña Incorrecta');

    return true;
  }

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
          'You must confirm your email to complete your reservation details.',
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
