import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Deposit, DepositDocument } from '../../entities/deposit.entity';

export class DepositRepository {
  constructor(
    @InjectModel(Deposit.name)
    private readonly changerDepositModel: Model<Deposit>,
  ) {}

  async getChangerDepositList(
    start: number,
    length: number,
  ): Promise<DepositDocument[]> {
    const deposits: DepositDocument[] = await this.changerDepositModel
      .find({})
      .populate('currency', 'name')
      .populate('account', 'email')
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);
    return deposits;
  }
  async getChangerDepositCount(): Promise<number> {
    const totalCount = await this.changerDepositModel.countDocuments();
    return totalCount;
  }
}
