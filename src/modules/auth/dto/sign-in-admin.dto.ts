import { IsNotEmpty, IsString } from 'class-validator';

export class SignInAdminDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
