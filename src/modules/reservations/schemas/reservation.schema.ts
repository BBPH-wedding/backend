import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ReservationStatus } from 'src/constants/reservations.enum';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  confirmationToken: string;

  @Prop()
  isConfirmedEmail: boolean;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: [{ firstName: String, lastName: String }] })
  peopleComing: { firstName: string; lastName: string }[];

  @Prop({
    type: String,
    enum: ReservationStatus,
  })
  status: ReservationStatus;

  @Prop({ type: String })
  notes: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
