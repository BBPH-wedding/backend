import { IsNotEmpty, IsString } from 'class-validator';

export class EntryVerificationDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
