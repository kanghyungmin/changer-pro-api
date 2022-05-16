import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ADMINROLETYPE } from '../../../common/enums/adminType';

export type AdminAccountDocument = AdminAccount & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class AdminAccount {
  @Prop({ required: true, unique: true, match: /.+\@.+\..+/ })
  email: string;

  @Prop({ requred: false })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ requred: true, default: Date.now })
  createdPassword: Date;

  @Prop({
    default: ADMINROLETYPE.VIEWER,
  })
  type: string;

  @Prop({})
  address: string;

  @Prop({})
  country: string;

  @Prop({})
  accessIP: string;

  @Prop({})
  state: number;

  @Prop({
    default: false,
  })
  email_verified: boolean;

  @Prop({})
  key_for_verified: string;

  @Prop({
    default: false,
  })
  otp_verified: boolean;

  @Prop({})
  secret_for_otp: string;

  @Prop({ type: Object })
  sixDigit: {
    val: string;
    createdAt: Date;
  };

  encryptPassword: (string) => string;
  verifyPassword: (string) => boolean;

  constructor(partial?: Partial<AdminAccount>) {
    if (partial) Object.assign(this, partial);
  }
}

export const AdminAccountSchema = SchemaFactory.createForClass(AdminAccount);

AdminAccountSchema.methods.encryptPassword = async function (password: string) {
  return await bcrypt.hash(password, 10);
};

AdminAccountSchema.methods.verifyPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};
