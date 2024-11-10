import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmReservationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  confirmationToken: string;
}
