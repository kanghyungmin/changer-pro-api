import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Balance, BalanceDocument } from '../../entities/balance.entity';
import { AccountDocument } from '../../entities/account.entity';
import { CurrencyDocument } from '../../entities/currency.entity';
import { ClientSession } from 'mongoose';

@Injectable()
export class BalanceRepository {
  constructor(
    @InjectModel(Balance.name)
    private readonly balanceModel: Model<Balance>,
  ) {}

  async getBalances(start: number, length: number): Promise<BalanceDocument[]> {
    const balances: BalanceDocument[] = await this.balanceModel
      .find({ enable: true }, 'available locked createdAt updatedAt')
      .populate({ path: 'currency', select: '-_id, name' })
      .populate({
        path: 'account',
        select: '-_id, email',
      })
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);
    return balances;
  }

  async getBalanceCount(): Promise<number> {
    const totalCount: number = await this.balanceModel.countDocuments();
    return totalCount;
  }

  async getBalanceWithCurrency(
    account: AccountDocument,
    currency: CurrencyDocument,
    session?: ClientSession,
  ): Promise<BalanceDocument> {
    const query = {
      account: account._id,
      currency: currency._id,
    };
    let balance;

    if (session) {
      balance = await this.balanceModel.findOne(query).session(session);
    } else {
      balance = await this.balanceModel.findOne(query);
    }

    if (!balance) {
      // session 있는 경우와 없는 경우에 create retur값이 달리진다
      // 기존에 session이 없는 경우를 대비한 방어코드
      if (session) {
        const balances = await this.balanceModel.create([query], {
          session: session,
        });
        balance = balances[0];
      } else {
        balance = await this.balanceModel.create(query);
      }
    }
    return balance;
  }

  async updateBalanceInfo(balance: BalanceDocument, session?: ClientSession) {
    console.log(balance);
    await this.balanceModel
      .updateOne(
        { _id: balance._id }, //확인
        {
          $set: {
            available: balance.available,
            locked: balance.locked,
          },
        },
      )
      .session(session);
  }
}
