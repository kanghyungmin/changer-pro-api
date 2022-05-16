import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AdminAccount, AdminAccountDocument } from './admin.entity';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ActionLogDocument = ActionLog & Document;

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
export class ActionLog {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: AdminAccount.name,
  })
  user: AdminAccountDocument;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({})
  content: string;

  constructor(partial?: Partial<ActionLog>) {
    if (partial) Object.assign(this, partial);
  }
}

export const ActionLogSchema = SchemaFactory.createForClass(ActionLog);
