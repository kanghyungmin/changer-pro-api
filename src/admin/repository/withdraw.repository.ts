import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { CustomError } from '../../common/classes/error';
import { ErrorType } from '../../common/enums/errorType';

import { Withdraw, WithdrawDocument } from '../../entities/withdraw.entity';

export class WithdrawRepository {
  constructor(
    @InjectModel(Withdraw.name)
    private readonly withdrawModel: Model<Withdraw>,
  ) {}

  async getChangerWithdrawalList(
    start: number,
    length: number,
  ): Promise<WithdrawDocument[]> {
    const withdrawals: WithdrawDocument[] = await this.withdrawModel
      .find({})
      .populate('account')
      .populate('currency')
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);
    return withdrawals;
  }
  async getChangerWithdrawCount(): Promise<number> {
    const totalCount = await this.withdrawModel.countDocuments();
    return totalCount;
  }

  async findWithdraw(
    id: string,
    session: ClientSession,
  ): Promise<WithdrawDocument> {
    const withdraw: WithdrawDocument = await this.withdrawModel
      .findById(id)
      .populate('currency')
      .populate('account')
      .session(session);

    if (!withdraw) {
      throw new CustomError(ErrorType.E1005_NO_WITHDRAW_TUPLE, 1005);
    }
    return withdraw;
  }
  async updateWithdrawInfo(
    withdraw: WithdrawDocument,
    session?: ClientSession,
  ) {
    await this.withdrawModel
      .updateOne(
        { _id: withdraw._id }, //확인
        {
          $set: {
            status: withdraw.status,
            state: withdraw.state,
            trxId: withdraw.trxId,
          },
        },
      )
      .session(session);
  }
}
