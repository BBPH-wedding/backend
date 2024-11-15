import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';
import { ReservationStatus } from 'src/constants';

export class UpdateReservationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsArray()
  @ArrayMinSize(1)
  peopleComing: { firstName: string; lastName: string }[];

  @IsEnum(ReservationStatus)
  @IsNotEmpty()
  status: ReservationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
