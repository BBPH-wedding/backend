import { Inject, Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { Credential, CredentialDocument } from './schemas/credentials.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectModel(Credential.name)
    private credentialModel: Model<CredentialDocument>,
  ) {}

  create(createCredentialDto: CreateCredentialDto) {
    return 'This action adds a new credential';
  }

  findAll() {
    return `This action returns all credentials`;
  }

  findOne(id: string) {
    return `This action returns a #${id} credential`;
  }

  async findByEmail(email: string) {
    const credential = await this.credentialModel.findOne({ email });

    return credential;
  }

  update(id: string, updateCredentialDto: UpdateCredentialDto) {
    return `This action updates a #${id} credential`;
  }

  remove(id: string) {
    return `This action removes a #${id} credential`;
  }
}
