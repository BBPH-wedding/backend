import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { CredentialsService } from '../credentials/credentials.service';
import { CredentialsModule } from '../credentials/credentials.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpiresIn },
    }),
    CredentialsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
