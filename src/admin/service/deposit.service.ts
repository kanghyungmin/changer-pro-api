import { Injectable } from '@nestjs/common';

import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { DepositRepository } from '../repository/deposit.repository';
import { DepositDocument } from '../../entities/deposit.entity';

@Injectable()
export class DepositService {
  constructor(
    private readonly depositRepository: DepositRepository,

    @InjectConnection(process.env.REPL_MONGO_DB)
    private readonly mongoChangerConnection: Connection,
  ) {}

  async getChangeDepositListSvc(
    start: number,
    length: number,
  ): Promise<DepositDocument[]> {
    try {
      const deposits: DepositDocument[] =
        await this.depositRepository.getChangerDepositList(start, length);

      return deposits;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getChangerDepoistCount(): Promise<number> {
    const changerDepositCount =
      await this.depositRepository.getChangerDepositCount();
    return changerDepositCount;
  }
}
