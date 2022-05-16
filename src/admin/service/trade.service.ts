import { Injectable } from '@nestjs/common';
import { exportCsv } from '../../common/utils/exportCsv';
import { TradeDocument } from '../../entities/trade.entity';
import { TradeRepository } from '../repository/trade.repository';

@Injectable()
export class TradeService {
  constructor(private readonly tradeRepository: TradeRepository) {}

  async getTrades(start: number, length: number): Promise<TradeDocument[]> {
    const trades: TradeDocument[] = await this.tradeRepository.getTrades(
      start,
      length,
    );
    return trades;
  }

  async getTradeCount(): Promise<number> {
    const totalCount: number = await this.tradeRepository.getMarketCount();
    return totalCount;
  }

  async downloadTrades(startDate: string | Date, endDate: string | Date) {
    startDate = new Date(Number(startDate));
    endDate = new Date(Number(endDate));

    const trades: TradeDocument[] =
      await this.tradeRepository.getTradesBetweenDates(startDate, endDate);

    const fields = [
      'type',
      {
        label: 'email',
        value: 'account.email',
      },
      {
        label: 'market',
        value: 'market.name',
      },
      'amount',
      'price',
      'volume',
      'status',
      'side',
      {
        label: 'origin',
        value: 'quoteOrigin',
      },
      {
        label: 'createdAt',
        value: 'readableCreatedAt',
      },
    ];

    return exportCsv(trades, fields);
  }
}
