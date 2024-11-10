import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { MailsService } from '../mails/mails.service';
import { ReservationService } from '../reservations/reservations.service';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpiresIn },
    }),
    ReservationsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, MailsService],
})
export class AuthModule {}
