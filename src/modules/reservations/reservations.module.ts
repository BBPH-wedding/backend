import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsController } from 'src/modules/reservations/reservations.controller';
import { ReservationService } from 'src/modules/reservations/reservations.service';
import { Reservation, ReservationSchema } from 'src/modules/reservations/schemas/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }])
  ],
  controllers: [ReservationsController],
  providers: [ReservationService],
})
export class ReservationsModule {}
