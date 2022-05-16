import { Injectable } from '@nestjs/common';
import { exportCsv } from '../../common/utils/exportCsv';
import { TransactionDocument } from '../../entities/transactions.entity';
import { TransactionRepository } from '../repository/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getTransactions(
    start: number,
    length: number,
  ): Promise<TransactionDocument[]> {
    const transactions: TransactionDocument[] =
      await this.transactionRepository.getTransactions(start, length);
    return transactions;
  }

  async getTransactionCount(): Promise<number> {
    const totalCount: number =
      await this.transactionRepository.getTransactionCount();
    return totalCount;
  }

  async downloadTransactions(
    startDate: string | Date,
    endDate: string | Date,
  ): Promise<string> {
    startDate = new Date(Number(startDate));
    endDate = new Date(Number(endDate));

    const transactions: TransactionDocument[] =
      await this.transactionRepository.getTransactionsBetweenDates(
        startDate,
        endDate,
      );

    const fields = [
      'type',
      {
        label: 'account',
        value: 'account.email',
      },
      {
        label: 'currency',
        value: 'balance.currency.name',
      },
      'amount',
      'fee',
      'costFee',
      {
        label: 'createdAt',
        value: 'readableCreatedAt',
      },
    ];

    return exportCsv(transactions, fields);
  }
}
