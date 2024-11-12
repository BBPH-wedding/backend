import { IReservation } from './reservation.interface';

export interface TContextMail {
  email?: string;
  name?: string;
  code?: string;
  reservation?: IReservation;
  url?: string;
}
