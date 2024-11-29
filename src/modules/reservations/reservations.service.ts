import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { ReservationStatus, Role } from 'src/constants';
import { MailsService } from '../mails/mails.service';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from '../auth/auth.service';
import { StatusPaginationDto } from './dto/status-pagination.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { envs } from 'src/config/envs';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    @Inject(forwardRef(() => AuthService))
    private reservationModel: Model<ReservationDocument>,
    private readonly mailService: MailsService,
    private readonly jwtService: JwtService,
  ) {}

  private checkReservationDeadline() {
    const reservationDeadline = new Date(envs.reservationDeadline || '');
    const currentDate = new Date();

    if (currentDate > reservationDeadline) {
      throw new BadRequestException('Reservation deadline has passed');
    }
  }

  async create(createReservationDto: CreateReservationDto) {
    this.checkReservationDeadline();

    const { email, password } = createReservationDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const foundReservation = await this.findByEmail(email);

    if (foundReservation && foundReservation.isConfirmedEmail) {
      throw new BadRequestException('This email is already registered');
    } else if (foundReservation && !foundReservation.isConfirmedEmail) {
      foundReservation.password = hashedPassword;
      foundReservation.confirmationToken = generateConfirmationToken();

      await foundReservation.save();

      await this.mailService.sendConfirmationEmail(
        email,
        foundReservation.confirmationToken,
      );

      return 'Reservation created succesfully';
    }

    const newReservation = new this.reservationModel({
      email,
      password: hashedPassword,
      confirmationToken: generateConfirmationToken(),
      isConfirmedEmail: false,
    });

    await newReservation.save();

    await this.mailService.sendConfirmationEmail(
      email,
      newReservation.confirmationToken,
    );

    return 'Reservation created succesfully';
  }

  async confirm(confirmReservationDto: ConfirmReservationDto) {
    const { email, confirmationToken } = confirmReservationDto;

    const reservationToActivate = await this.reservationModel
      .findOne({ email })
      .exec();

    if (reservationToActivate?.isConfirmedEmail)
      throw new BadRequestException('This email is already validated');

    if (
      !reservationToActivate ||
      confirmationToken != reservationToActivate?.confirmationToken
    )
      throw new BadRequestException('Invalid code');

    reservationToActivate.confirmationToken = null;
    reservationToActivate.isConfirmedEmail = true;
    reservationToActivate.status = ReservationStatus.PENDING;

    const payload = { email: reservationToActivate.email, roles: [Role.USER] };
    const token = this.jwtService.sign(payload);

    await reservationToActivate.save();

    return token;
  }

  async findAll(statusPaginationDto: StatusPaginationDto) {
    const { page, limit, status } = statusPaginationDto;

    const filter = status ? { status, isConfirmedEmail: true } : {};

    const totalDocuments = await this.reservationModel.countDocuments(filter);

    const data = await this.reservationModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      data,
      meta: {
        total: totalDocuments,
        page: page,
        lastPage: Math.ceil(totalDocuments / limit),
      },
    };
  }

  async reSendConfirmationToken(email: string) {
    const reservation = await this.findByEmail(email);
    if (!reservation)
      throw new NotFoundException(`Reservation not found by email: ${email}`);

    const confirmationToken = (reservation.confirmationToken =
      generateConfirmationToken());

    await reservation.save();

    await this.mailService.sendConfirmationEmail(email, confirmationToken);
  }

  async requestPasswordReset(email: string) {
    const reservation = await this.findByEmail(email);
    if (!reservation)
      throw new NotFoundException(`Reservation not found by email: ${email}`);

    const payload = {
      email: reservation.email,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    await this.mailService.sendResetPassword(reservation.email, token);

    return 'An email with a password reset link has been sent to your email address. Please follow the instructions in the email to reset your password.';
  }

  async resetPassword(email: string, resetPasswordDto: ResetPasswordDto) {
    const { password } = resetPasswordDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedReservation = await this.reservationModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true },
    );

    if (!updatedReservation)
      throw new BadRequestException("We couldn't reset your password.");

    await this.mailService.sendPasswordChangeConfirmation(email);

    return true;
  }

  async update(
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation | null> {
    this.checkReservationDeadline();
    
    const { email, ...updateFields } = updateReservationDto;

    const reservationToConfirm = await this.reservationModel
      .findOne({ email })
      .exec();
    if (!reservationToConfirm)
      throw new NotFoundException('Reservation not found');

    const updatedReservation = await this.reservationModel.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true },
    );

    if (reservationToConfirm.status === ReservationStatus.PENDING) {
      await this.mailService.sendNewReservationEmail(email, updatedReservation);
    } else {
      await this.mailService.sendUpdatedReservationEmail(
        email,
        updatedReservation,
      );
    }

    return updatedReservation;
  }

  async findByEmail(email: string) {
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

  async exportToExcel(response: Response): Promise<void> {
    const reservations = await this.reservationModel.find().exec();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reservations');

    worksheet.columns = [
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Phone Number', key: 'phoneNumber', width: 20 },
      { header: 'Notes', key: 'notes', width: 50 },
      { header: 'People Coming', key: 'peopleComing', width: 50 },
      { header: 'Total People', key: 'totalPeople', width: 15 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: '263925' },
        size: 12,
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'f1f2ec' },
      };
    });

    reservations.forEach((reservation) => {
      worksheet.addRow({
        email: reservation.email,
        status: reservation.status,
        phoneNumber: reservation.phoneNumber,
        notes: reservation.notes || '',
        peopleComing: reservation.peopleComing
          ?.map((person) => `${person.firstName} ${person.lastName}`)
          .join(', '),
        totalPeople:
          reservation.status == ReservationStatus.CONFIRMED
            ? reservation.peopleComing.length
            : 0,
      });
    });

    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      'attachment; filename=reservations.xlsx',
    );

    await workbook.xlsx.write(response);
    response.end();
  }
}
