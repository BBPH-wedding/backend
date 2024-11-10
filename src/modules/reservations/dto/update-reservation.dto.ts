import { IsEmail, IsNotEmpty, IsString, IsArray, IsEnum } from 'class-validator';
import { ReservationStatus } from 'src/constants/reservations.enum';

export class UpdateReservationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsArray()
  @IsNotEmpty()
  peopleComing: { firstName: string; lastName: string }[];

  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status: ReservationStatus;

  @IsString()
  notes?: string;
}
