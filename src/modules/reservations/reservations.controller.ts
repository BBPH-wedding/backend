import { Controller, Post, Body, Patch, Get, Delete, Param, UseInterceptors } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ConfirmReservationDto } from './dto/confirm-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ExcludeSensitiveFieldsInterceptor } from 'src/interceptors/exclude-sensitive-fields.interceptor';

@Controller('reservations')
// @UseInterceptors(ExcludeSensitiveFieldsInterceptor)
export class ReservationsController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async createReservation(@Body() createReservationDto: CreateReservationDto): Promise<string> {
    return await this.reservationService.create(createReservationDto);
  }

  @Post('confirm')
  async confirmReservation(@Body() confirmReservationDto: ConfirmReservationDto) {
    return await this.reservationService.confirm(confirmReservationDto);
  }

  @Patch()
  async updateReservation(@Body() updateReservationDto: UpdateReservationDto) {
    return await this.reservationService.update(updateReservationDto);
  }

  @Get(':email')
  async findReservationByEmail(@Param('email') email: string) {
    return await this.reservationService.findByEmail(email);
  }

  @Delete(':email')
  async deleteReservationByEmail(@Param('email') email: string) {
    return await this.reservationService.deleteByEmail(email);
  }
}
