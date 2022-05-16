/**
 * @todo 배치 변경
 */
export type Ticker = `${Currency}_${Currency}`;
export type Amount = string;
export type Quantity = string;
export type RequestId = `${Ticker}:${Currency}:${Amount | Quantity}`;

export enum Currency {
  USD = 'USD',
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT',
  LINK = 'LINK',
  LTC = 'LTC',
  BCH = 'BCH',
  UNI = 'UNI',
  COMP = 'COMP',
  UST = 'UST',

  LNK = 'LNK',
  DOGE = 'DOGE',
  DOG = 'DOG',
  USDC = 'USDC',
  USC = 'USC',
  //IBKR Currency
  // AUD = "AUD",
  // JPY = "JPY",
}

export enum CurrencyType {
  Spot = 'spot',
  Fiat = 'fiat',
}
