import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
