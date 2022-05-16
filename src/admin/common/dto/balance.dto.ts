import { ApiProperty } from '@nestjs/swagger';
import { BalanceDocument } from '../../../entities/balance.entity';
import { AggregateDto } from './common.dto';

export class BalancesResponseDto extends AggregateDto {
  @ApiProperty({
    example: [
      {
        available: '3.05',
        locked: '0',
        account: {
          email: 'ceon3040@gmail.com',
        },
        currency: {
          name: 'eth',
        },
        createdAt: '2022-04-14T07:52:26.308Z',
        updatedAt: '2022-05-04T03:48:12.072Z',
        id: '6257d2ba1d7d4f67b26624e8',
      },
    ],
  })
  balances: BalanceDocument[];
}
