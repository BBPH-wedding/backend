import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Credential, CredentialSchema } from './schemas/credentials.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Credential.name, schema: CredentialSchema },
    ]),
  ],
  providers: [CredentialsService],
  exports: [CredentialsService],
})
export class CredentialsModule {}
