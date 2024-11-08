import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config/envs';
import { AuthModule } from './modules/auth/auth.module';
import { CredentialsModule } from './modules/credentials/credentials.module';

@Module({
  imports: [
    MongooseModule.forRoot(envs.databaseUrl),
    AuthModule,
    CredentialsModule,
  ],
})
export class AppModule {}
