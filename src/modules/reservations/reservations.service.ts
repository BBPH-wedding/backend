import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Reservation,
  ReservationDocument,
} from 'src/modules/reservations/schemas/reservation.schema';
import * as bcrypt from 'bcrypt';
import { generateConfirmationToken } from 'src/utils/generate-confirmation-token';
import { CreateReservationDto } from 'src/modules/reservations/dto/create-reservation.dto';
import { ConfirmReservationDto } from 'src/modules/reservations/dto/confirm-reservation.dto';
import { UpdateReservationDto } from 'src/modules/reservations/dto/update-reservation.dto';
import { ReservationStatus } from 'src/constants';
import { MailsService } from '../mails/mails.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    private readonly mailService: MailsService,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const { email, password } = createReservationDto;

    const foundReservation = await this.findByEmail(email);

    if (foundReservation && foundReservation.isConfirmedEmail === true) {
      throw new BadRequestException('This email is already registered');
    } else if (
      foundReservation &&
      foundReservation.isConfirmedEmail === false
    ) {
      return {
        message:
          "You already have a reservation with this email. It needs verification; we'll redirect you to the verification form.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newReservation = new this.reservationModel({
      email,
      password: hashedPassword,
      confirmationToken: generateConfirmationToken(),
      isConfirmedEmail: false,
    });

    await this.mailService.sendConfirmationEmail(
      email,
      newReservation.confirmationToken,
    );

    return await newReservation.save();
  }

  async confirm(
    confirmReservationDto: ConfirmReservationDto,
  ): Promise<Reservation | null> {
    const { email, confirmationToken } = confirmReservationDto;

    const reservationToActivate = await this.reservationModel
      .findOne({ email })
      .exec();

    if (reservationToActivate.isConfirmedEmail === true)
      throw new BadRequestException('This email is already validated');

    if (
      !reservationToActivate ||
      confirmationToken != reservationToActivate.confirmationToken
    )
      throw new BadRequestException('Invalid code');

    reservationToActivate.confirmationToken = null;
    reservationToActivate.isConfirmedEmail = true;
    reservationToActivate.status = ReservationStatus.PENDING;

    return await reservationToActivate.save();
  }

  async reSendConfirmationToken(email: string) {
    const reservation = await this.reservationModel.findOne({ email }).exec();

    const confirmationToken = (reservation.confirmationToken =
      generateConfirmationToken());

    await reservation.save();

    await this.mailService.sendConfirmationEmail(email, confirmationToken);
  }

  async update(
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation | null> {
    const { email, ...updateFields } = updateReservationDto;

    const reservationToConfirm = await this.reservationModel
      .findOne({ email })
      .exec();
    if (!reservationToConfirm)
      throw new NotFoundException('Reservation not found');

    reservationToConfirm.set(updateFields);

    const updatedReservation = await reservationToConfirm.save();

    if (reservationToConfirm.peopleComing.length === 0) {
      await this.mailService.sendNewReservationEmail(email, updatedReservation);
    } else {
      await this.mailService.sendUpdatedReservationEmail(
        email,
        updatedReservation,
      );
    }

    return updatedReservation;
  }

  async findByEmail(email: string): Promise<Reservation | null> {
    const reservationFound = await this.reservationModel
      .findOne({ email })
      .exec();

    return reservationFound;
  }

  async deleteByEmail(email: string): Promise<Reservation | null> {
    const reservationToDelete = await this.reservationModel
      .findOneAndDelete({ email })
      .exec();
    if (!reservationToDelete)
      throw new NotFoundException(`Reservation not found by email: ${email}`);
    return reservationToDelete;
  }
}
