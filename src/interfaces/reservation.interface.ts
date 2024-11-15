import { ReservationStatus } from 'src/constants';

export interface IReservation {
  email: string;

  peopleComing: IMember[];
  nMembers?: number;
  phoneNumber: string;
  status: ReservationStatus;
  notes: string;
}

interface IMember {
  firstName: string;
  lastName: string;
}
