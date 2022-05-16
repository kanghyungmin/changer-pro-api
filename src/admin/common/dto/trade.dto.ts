import { ApiProperty } from '@nestjs/swagger';
import { TradeDocument } from '../../../entities/trade.entity';
import { AggregateDto } from './common.dto';

export class TradeResponseDto extends AggregateDto {
  @ApiProperty({
    example: [
      {
        info: {
          tradeId: '460d12ea-5efd-4e19-b7a3-c617bf078c3a',
          ticker: 'ETH_USDT',
          currency: 'ETH',
          action: 'buy',
          amount: '7099.75000000',
          quantity: '2.5000000000',
          price: '2839.90000000',
          origin: 'b2c2',
        },
        quoteOrigin: 'b2c2',
        amount: '7099.025',
        volume: '2.5',
        price: '2839.61',
        account: {
          email: 'demo@changer.io',
        },
        side: 'buy',
        market: {
          name: 'eth_usdt',
        },
        status: 'filled',
        type: 'settlement',
        createdAt: 1651561203048,
        updatedAt: 1651561203048,
        readableCreatedAt: '2022-05-03 16:00:03',
        readableUpdatedAt: '2022-05-03 16:00:03',
        id: '6270d2f3fae7c0266d830b59',
      },
    ],
  })
  trades: TradeDocument[];
}
