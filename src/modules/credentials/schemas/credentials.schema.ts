import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CredentialDocument = Credential & Document;

@Schema()
export class Credential {
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);
