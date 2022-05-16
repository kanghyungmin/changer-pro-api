import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Trade, TradeDocument } from '../../entities/trade.entity';

@Injectable()
export class TradeRepository {
  constructor(
    @InjectModel(Trade.name)
    private readonly tradeMdoel: Model<Trade>,
  ) {}

  async getTrades(start: number, length: number): Promise<TradeDocument[]> {
    const trades: TradeDocument[] = await this.tradeMdoel
      .find(
        {},
        'info side status type account price volume amount quoteOrigin createdAt updatedAt',
      )
      .populate({ path: 'account', select: '-_id email' })
      .populate({ path: 'market', select: '-_id name' })
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);
    return trades;
  }

  async getMarketCount(): Promise<number> {
    const totalCount: number = await this.tradeMdoel.countDocuments();
    return totalCount;
  }

  async getTradesBetweenDates(
    startDate: Date,
    endDate: Date,
  ): Promise<TradeDocument[]> {
    const trades: TradeDocument[] = await this.tradeMdoel
      .find(
        { createdAt: { $gte: endDate, $lte: startDate } },
        'side status type price volume amount quoteOrigin createdAt',
      )
      .populate({ path: 'account', select: '-_id email' })
      .populate({ path: 'market', select: '-_id name' })
      .sort({ createdAt: -1 });
    return trades;
  }
}
