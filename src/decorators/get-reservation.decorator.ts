import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetReservationInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.reservation)
      throw new InternalServerErrorException(
        'Reservation not found in request (AuthGuard called?)',
      );

    return request.reservation;
  },
);
