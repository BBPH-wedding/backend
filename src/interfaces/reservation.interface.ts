export interface IReservation {
  email: string;

  members: IMember[];
  nMembers: number;
  contact: string;
  notes: string;
}

interface IMember {
  first_name: string;
  last_name: string;
}
