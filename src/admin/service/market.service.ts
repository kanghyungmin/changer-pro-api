import { Injectable } from '@nestjs/common';
import { MarketDocument } from '../../entities/market.entity';
import { MarketRepository } from '../repository/market.repository';

@Injectable()
export class MarketService {
  constructor(private readonly marketRepository: MarketRepository) {}

  async getMarkets(start: number, length: number): Promise<MarketDocument[]> {
    const markets: MarketDocument[] = await this.marketRepository.getMarkets(
      start,
      length,
    );
    return markets;
  }

  async getMarketCount(): Promise<number> {
    const totalCount: number = await this.marketRepository.getMarketCount();
    return totalCount;
  }
}
