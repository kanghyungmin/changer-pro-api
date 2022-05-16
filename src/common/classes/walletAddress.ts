import { AccountDocument } from '../../entities/account.entity';
import { CurrencyDocument } from '../../entities/currency.entity';

export class WalletAddressQueryFilter {
  account: string;
  currency?: string;
  type?: string;
  assigned?: boolean;
}

export class WalletAddressWebHookQueryFilter {
  currency: string;
  address: string;
  addressTag?: string;
}

export class WalletAddressAssignQueryFilter {
  account: string;
  currency?: string;
  currencyName: string;
}

export class WalletAddressCreateBody {
  account: AccountDocument;
  currency: CurrencyDocument;
  address: string;
  addressTag: string;
  assigned: boolean;
}
