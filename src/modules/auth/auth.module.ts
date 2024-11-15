import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailsService } from '../mails/mails.service';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [ ReservationsModule],
  controllers: [AuthController],
  providers: [AuthService, MailsService],
  exports: [AuthService],
})
export class AuthModule {}
