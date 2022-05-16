export enum TradeStatus {
  Idle = 'idle',
  Rejected = 'Rejected',
  Filled = 'filled',
}
export enum TradeState {
  Idle = 'idle',
  Trading = 'trading',
}
export enum TradeType {
  Trade = 'trade',
  Liquidation = 'liquidation',
  Settlement = 'settlement',
}

export enum TransactionType {
  MetaApi = 'meta-api',
  Deposit = 'deposit',
  Trade = 'trade',
  Withdraw = 'withdraw',
  Fee = 'fee',
}
