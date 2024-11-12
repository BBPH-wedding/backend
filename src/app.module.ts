import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config/envs';
import { AuthModule } from './modules/auth/auth.module';
import { MailsModule } from './modules/mails/mails.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpiresIn },
    }),
    MongooseModule.forRoot(envs.databaseUrl),
    AuthModule,
    MailsModule,
    ReservationsModule,
  ],
})
export class AppModule {}
