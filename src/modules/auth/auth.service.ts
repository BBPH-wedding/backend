import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { envs } from 'src/config/envs';
import { EntryVerificationDto, SignInDto } from './dto';
import { CredentialsService } from '../credentials/credentials.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly credentialsService: CredentialsService, //Eliminar cuando este listo Reservations
    // private readonly reservationsService: ReservationsService,
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

    const checkCredential = await this.credentialsService.findByEmail(email); //Eliminar cuando este listo Reservations
    // const checkCredential = await this.reservationsService.findByEmail(email);
    if (!checkCredential)
      throw new UnauthorizedException('Credenciales Inválidas');

    const checkPass = await bcrypt.compare(password, checkCredential.password);
    if (!checkPass) throw new UnauthorizedException('Credenciales Inválidas');

    const payload = {
      id: checkCredential._id,
      email: checkCredential.email,
    };

    const token = this.jwtService.sign(payload);

    return token;
  }
}
