import BigNumber from 'bignumber.js';
import { AccountDocument } from '../../entities/account.entity';
import { CurrencyDocument } from '../../entities/currency.entity';

export class WithdrawQueryFilter {
  account: string;
  currency?: string;
  status?: string[];
}

export class WithdrawRequestQueryFilter {
  account: AccountDocument;
  currency: CurrencyDocument;
  amount: BigNumber;
  memo?: string;
  address?: string;
  addressMemo?: string;
}

export class WithdrawCancelQueryFilter {
  _id: string;
  account: string;
}
