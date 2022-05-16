import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  Transaction,
  TransactionDocument,
} from '../../entities/transactions.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionMdoel: Model<Transaction>,
  ) {}

  async getTransactions(
    start: number,
    length: number,
  ): Promise<TransactionDocument[]> {
    const transactions: TransactionDocument[] = await this.transactionMdoel
      .find({}, 'amount fee type createdAt updatedAt')
      .populate({ path: 'account', select: '-_id email' })
      .populate({
        path: 'balance',
        select: '-_id currency',
        populate: {
          path: 'currency',
          select: '-_id name',
        },
      })
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);
    return transactions;
  }

  async getTransactionCount(): Promise<number> {
    const totalCount: number = await this.transactionMdoel.countDocuments();
    return totalCount;
  }

  async getTransactionsBetweenDates(
    startDate: Date,
    endDate: Date,
  ): Promise<TransactionDocument[]> {
    const transactions: TransactionDocument[] = await this.transactionMdoel
      .find(
        { createdAt: { $gte: endDate, $lte: startDate } },
        'amount fee costFee type createdAt',
      )
      .populate({ path: 'account', select: '-_id email' })
      .populate({
        path: 'balance',
        select: '-_id currency',
        populate: {
          path: 'currency',
          select: '-_id name',
        },
      })
      .sort({ createdAt: -1 });
    return transactions;
  }
}
