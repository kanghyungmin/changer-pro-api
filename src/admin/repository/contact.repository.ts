import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Contact, ContactDocument } from '../../entities/contact.entity';

export class ContactRepository {
  constructor(
    @InjectModel(Contact.name)
    private readonly changerContactModel: Model<Contact>,
  ) {}

  async getChangerContactListRepo(
    start: number,
    length: number,
  ): Promise<ContactDocument[]> {
    const contacts: ContactDocument[] = await this.changerContactModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);
    return contacts;
  }
  async getChangerContactCount(): Promise<number> {
    const totalCount = await this.changerContactModel.countDocuments();
    return totalCount;
  }
}
