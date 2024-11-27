import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInAdminDto, SignInDto } from './dto';
import { MailsService } from '../mails/mails.service';
import { ReservationService } from '../reservations/reservations.service';
import { Role } from 'src/constants';
import { envs } from 'src/config/envs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
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
      throw new BadRequestException(
        'You must confirm your email to complete your reservation details. Go back to create reservation',
      );

    const payload = {
      email: checkReservation.email,
      roles: [Role.USER],
    };

    const token = this.jwtService.sign(payload);

    return token;
  }

  async signInAdmin(signInAdminDto: SignInAdminDto) {
    const { username, password } = signInAdminDto;
    
    const isOkUsername = username === envs.usernameAdmin;
    const isOkPassword = bcrypt.compareSync(password, envs.passwordAdmin);
    if (!isOkPassword || !isOkUsername)
      throw new ForbiddenException('Invalid Credentials');

    const payload = {
      roles: [Role.ADMIN],
    };

    const token = this.jwtService.sign(payload);

    return token;
  }
}
