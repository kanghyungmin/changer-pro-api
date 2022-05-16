import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../../../entities/transactions.entity';
import { AggregateDto } from './common.dto';

export class TransactionResponseDto extends AggregateDto {
  @ApiProperty({
    example: [
      {
        amount: '-0.00721',
        fee: '0.02',
        type: 'withdraw',
        account: {
          email: 'example@mail.com',
        },
        balance: {
          currency: {
            name: 'eth',
          },
        },
        createdAt: '2022-05-04T03:48:44.492Z',
        updatedAt: '2022-05-04T03:48:44.492Z',
        readableCreatedAt: '2022-05-04 12:48:44',
        readableUpdatedAt: '2022-05-04 12:48:44',
        readableAmount: '-0.00721',
        readableFee: '+0.02',
        id: '6271f79cde39f5208968d7c7',
      },
    ],
  })
  transactions: Transaction[];
}
