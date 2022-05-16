import BigNumber from 'bignumber.js';
import { Side } from './enums/side';
import { TradeType } from './enums/trade';

export type ElementUSDTPrices = {
  ticker: string | null;
  base: string | null;
  quote: string | null;
  price: BigNumber;
};

export type TypePlaceOrder = {
  ticker: string;
  amount: string;
  price: string;
  quantity: string;
  action: Side;
  currency: string;
  type: TradeType;
  quotePrice: string | undefined;
  origin: string;
};
