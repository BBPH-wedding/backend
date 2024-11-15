import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateReservationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=(.*[A-Z]))(?=(.*\d)).{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain an uppercase letter, and a number',
  })
  password: string;
}
