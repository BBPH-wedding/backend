import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config/envs';

@Module({
  imports: [MongooseModule.forRoot(envs.databaseUrl)],
})
export class AppModule {}
