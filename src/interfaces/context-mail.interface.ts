import { IReservation } from './reservation.interface';

export interface TContextMail {
  name?: string;
  code?: string;
  reservation?: IReservation;
}
