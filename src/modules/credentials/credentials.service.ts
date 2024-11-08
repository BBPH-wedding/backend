import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { Credential, CredentialDocument } from './schemas/credentials.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../auth/dto';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectModel(Credential.name)
    private credentialModel: Model<CredentialDocument>,
  ) {}

  async create(createCredential: SignInDto) {
    const { password } = createCredential;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (hashedPassword) {
      createCredential.password = hashedPassword;
    } else {
      throw new ConflictException('Error creando reserva');
    }

    const createdCredential =
      await this.credentialModel.create(createCredential);

    return createdCredential;
  }

  async findByEmail(email: string) {
    const credential = await this.credentialModel.findOne({ email });

    return credential;
  }

  remove(id: string) {
    return this.credentialModel.findByIdAndDelete({ _id: id });
  }
}
