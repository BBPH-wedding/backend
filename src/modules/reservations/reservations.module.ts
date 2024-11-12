import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsController } from 'src/modules/reservations/reservations.controller';
import { ReservationService } from 'src/modules/reservations/reservations.service';
import {
  Reservation,
  ReservationSchema,
} from 'src/modules/reservations/schemas/reservation.schema';
import { MailsService } from '../mails/mails.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ReservationsController],
  providers: [ReservationService, MailsService],
  exports: [ReservationService],
})
export class ReservationsModule {}
