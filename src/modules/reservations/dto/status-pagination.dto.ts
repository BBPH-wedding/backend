import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { ReservationStatus } from 'src/constants';

export class StatusPaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;
}
