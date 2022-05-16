import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Market, MarketDocument } from '../../entities/market.entity';

@Injectable()
export class MarketRepository {
  constructor(
    @InjectModel(Market.name)
    private readonly marketMdoel: Model<Market>,
  ) {}

  async getMarkets(start: number, length: number): Promise<MarketDocument[]> {
    const markets: MarketDocument[] = await this.marketMdoel
      .find({}, 'makerFee takerFee bidEnable askEnable createdAt updatedAt')
      .populate({ path: 'baseCurrency', select: '-_id name' })
      .populate({ path: 'quoteCurrency', select: '-_id name' })
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);
    return markets;
  }

  async getMarketCount(): Promise<number> {
    const totalCount: number = await this.marketMdoel.countDocuments();
    return totalCount;
  }
}
