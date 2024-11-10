import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from 'src/modules/reservations/schemas/reservation.schema';
import * as bcrypt from 'bcrypt';
import { ReservationStatus } from 'src/constants/reservations.enum';
import { generateConfirmationToken } from 'src/utils/generate-confirmation-token';
import { CreateReservationDto } from 'src/modules/reservations/dto/create-reservation.dto';
import { ConfirmReservationDto } from 'src/modules/reservations/dto/confirm-reservation.dto';
import { UpdateReservationDto } from 'src/modules/reservations/dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<string> {
    const { email, password } = createReservationDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newReservation = new this.reservationModel({
        email,
        password: hashedPassword,
        confirmationToken: generateConfirmationToken(),
    });
    await newReservation.save();
    return 'Reserva creada exitosamente.';
  }

  async confirm(confirmReservationDto: ConfirmReservationDto): Promise<Reservation | null> {
    const { email, password, confirmationToken } = confirmReservationDto;

    const reservationToActivate = await this.reservationModel.findOne({ email }).exec();
    if (!reservationToActivate)
      throw new UnauthorizedException('Credenciales Inválidas.');

    const checkPassword = await bcrypt.compare(password, reservationToActivate.password);
    if (!checkPassword)
      throw new UnauthorizedException('Credenciales Inválidas.');

    if (confirmationToken != reservationToActivate.confirmationToken)
      throw new UnauthorizedException('Confirmation Token Inválido.');

    reservationToActivate.confirmationToken = 'VALIDATED';
    reservationToActivate.status = ReservationStatus.PENDING;

    return await reservationToActivate.save();
  }

  async update(updateReservationDto: UpdateReservationDto): Promise<Reservation | null> {
    const { email, password, ...updateFields } = updateReservationDto;

    const reservationToConfirm = await this.reservationModel.findOne({ email }).exec();
    if (!reservationToConfirm)
      throw new UnauthorizedException('Credenciales Inválidas.');

    const checkPassword = await bcrypt.compare(password, reservationToConfirm.password);
    if (!checkPassword)
      throw new UnauthorizedException('Credenciales Inválidas.');

    if (reservationToConfirm.confirmationToken != 'VALIDATED')
      throw new UnauthorizedException('Email no validado.');

    reservationToConfirm.set(updateFields);

    return await reservationToConfirm.save();
  }

  async findByEmail(email: string): Promise<Reservation | null> {
    const reservationFound = await this.reservationModel.findOne({ email }).exec();
    if (!reservationFound) throw new NotFoundException(`Reserva no encontrada para el mail ${email}`);
    return reservationFound
  }

  async deleteByEmail(email: string): Promise<Reservation | null> {
    const reservationToDelete = await this.reservationModel.findOneAndDelete({ email }).exec();
    if (!reservationToDelete) throw new NotFoundException(`Reserva no encontrada para el mail ${email}`);
    return reservationToDelete;
  }
}
