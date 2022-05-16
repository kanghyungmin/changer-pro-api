export type Ticker = `${Currency}_${Currency}`;
export type Amount = string;
export type Quantity = string;
export type RequestId = `${Ticker}:${Currency}:${Amount | Quantity}`;
export type Currency = string;

export enum CurrencyType {
  Spot = 'spot',
  Fiat = 'fiat',
}
