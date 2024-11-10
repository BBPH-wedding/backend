import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ReservationStatus } from 'src/constants/reservations.enum';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  confirmationToken: string;

  @Prop()
  phoneNumber: string;

  @Prop({ type: [{ firstName: String, lastName: String }] })
  peopleComing: { firstName: string; lastName: string }[];

  @Prop({
    type: String,
    enum: ReservationStatus
  })
  status: ReservationStatus;

  @Prop()
  notes: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);