import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import { Connection } from 'mongoose';
import { ContactRepository } from '../repository/contact.repository';
import { ContactDocument } from '../../entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,

    @InjectConnection(process.env.REPL_MONGO_DB)
    private readonly mongoChangerConnection: Connection,
  ) {}

  async getChangerContactListSvc(
    start: number,
    length: number,
  ): Promise<ContactDocument[]> {
    try {
      const contacts: ContactDocument[] =
        await this.contactRepository.getChangerContactListRepo(start, length);

      return contacts;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getChangerContactCount(): Promise<number> {
    const changerContactCount =
      await this.contactRepository.getChangerContactCount();
    return changerContactCount;
  }
}
