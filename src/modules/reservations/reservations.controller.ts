import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ConfirmReservationDto } from './dto/confirm-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ExcludeSensitiveFieldsInterceptor } from 'src/interceptors/exclude-sensitive-fields.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('reservations')
// @UseInterceptors(ExcludeSensitiveFieldsInterceptor)
export class ReservationsController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return await this.reservationService.create(createReservationDto);
  }

  @Post('confirm')
  async confirmReservation(
    @Body() confirmReservationDto: ConfirmReservationDto,
  ) {
    return await this.reservationService.confirm(confirmReservationDto);
  }

  @Get('re-send-token/:email')
  async reSendConfirmationToken(@Param('email') email: string) {
    await this.reservationService.reSendConfirmationToken(email);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async updateReservation(@Body() updateReservationDto: UpdateReservationDto) {
    return await this.reservationService.update(updateReservationDto);
  }

  @UseGuards(AuthGuard)
  @Get(':email')
  async findReservationByEmail(@Param('email') email: string) {
    return await this.reservationService.findByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Delete(':email')
  async deleteReservationByEmail(@Param('email') email: string) {
    return await this.reservationService.deleteByEmail(email);
  }
}
