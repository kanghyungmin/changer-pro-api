import { ApiProperty } from '@nestjs/swagger';
import { Market } from '../../../entities/market.entity';
import { AggregateDto } from './common.dto';

export class MarketResponseDto extends AggregateDto {
  @ApiProperty({
    example: [
      {
        makerFee: '0.001',
        takerFee: '0.001',
        baseCurrency: {
          name: 'eusd',
        },
        quoteCurrency: {
          name: 'esgd',
        },
        bidEnable: true,
        askEnable: true,
        createdAt: '2022-05-02T10:33:43.106Z',
        updatedAt: '2022-05-02T10:33:43.106Z',
        id: '626fb387de39f5208968d7c3',
      },
    ],
  })
  markets: Market[];
}
