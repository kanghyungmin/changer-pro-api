import BigNumber from 'bignumber.js';
import { AccountDocument } from '../../entities/account.entity';
import { CurrencyDocument } from '../../entities/currency.entity';

export class DepositQueryFilter {
  account: string;
  currency?: string;
}

export class DepositCreateQueryFilter {
  account?: AccountDocument;
  amount: BigNumber;
  currency: CurrencyDocument;
  trxId: string;
  memo?: string;
}
