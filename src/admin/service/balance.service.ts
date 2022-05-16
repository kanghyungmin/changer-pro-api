import { Injectable } from '@nestjs/common';
import { BalanceRepository } from '../repository/balance.repository';
import { BalanceDocument } from '../../entities/balance.entity';
import { AccountDocument } from '../../entities/account.entity';
import { CurrencyDocument } from '../../entities/currency.entity';
import { ClientSession } from 'mongoose';

@Injectable()
export class BalanceService {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  async getBalances(start: number, length: number): Promise<BalanceDocument[]> {
    const balances: BalanceDocument[] =
      await this.balanceRepository.getBalances(start, length);
    return balances;
  }

  async getBalanceCount(): Promise<number> {
    const totalCount: number = await this.balanceRepository.getBalanceCount();
    return totalCount;
  }
  async getBalance(
    account: AccountDocument,
    currency: CurrencyDocument,
    session?: ClientSession,
  ) {
    return await this.balanceRepository.getBalanceWithCurrency(
      account,
      currency,
      session,
    );
  }
}
