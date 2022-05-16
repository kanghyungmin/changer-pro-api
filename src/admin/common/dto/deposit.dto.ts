import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DepositDocument } from '../../../entities/deposit.entity';
import { FeeType } from '../enum/feeType';
import { AggregateDto } from './account.dto';

export class ChangerDepositListResDto extends AggregateDto {
  @ApiProperty({
    example: [
      {
        memo: 'changer deposit fireblocks transactionId : 065b93fa-5003-4d1a-9d0f-ac29ca1fceae',
        trxId:
          '0xbd1ca3a8d438dad1ceb43457d5ee7b580ed3c903d1e38253e7cffc5bf15bd7cd',
        fee: '0',
        amount: '0.03',
        balance: '6257d2ba1d7d4f67b26624e8',
        currency: {
          name: 'eth',
          id: '5cdaab544fee8b2a6dd64e7e',
        },
        account: {
          email: 'ceon3040@gmail.com',
          id: '6257b381b0095360e682f0c2',
        },
        type: 'changer',
        status: 'success',
        state: 'done',
        createdAt: '2022-04-21T02:41:50.386Z',
        updatedAt: '2022-04-21T02:41:50.386Z',
        __v: 0,
        id: '6260c46efae7c0266d7af0b8',
      },
    ],
  })
  deposits: DepositDocument[];
}

export class DepositFee {
  @IsEnum(FeeType)
  @ApiProperty({
    example: `'no-fee' | 'amount' | 'rate'`,
  })
  type: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1.0',
  })
  amount: string;
}
