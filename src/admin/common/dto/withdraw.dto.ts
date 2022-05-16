import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { WithdrawDocument } from '../../../entities/withdraw.entity';
import { FeeType } from '../enum/feeType';
import { AggregateDto } from './account.dto';

export class ChangerWithdrawalListResDto extends AggregateDto {
  @ApiProperty({
    example: [
      {
        address: '0xCDa9709f7bBDA46D12c6aDafef8168FECD662A16',
        fee: '0.02',
        amount: '0.00721',
        balance: '5fdb02eef2c04d76fa268d6e',
        currency: {
          depositFee: {
            _id: '626fa0ab7c3f8e21dc6ab17c',
            amount: '0',
            type: 'no-fee',
          },
          withdrawFee: {
            _id: '626fa0ab7c3f8e21dc6ab17d',
            type: 'amount',
            amount: '0.02',
          },
          depositEnable: true,
          withdrawEnable: true,
          name: 'eth',
          fullName: 'Ethereum',
          icon: 'https://changer-resource.s3.ap-northeast-2.amazonaws.com/crypto_logo_ETH.svg',
          decimalPoint: '6',
          createdAt: '2019-05-14T11:49:40.518Z',
          updatedAt: '2022-05-02T09:13:13.700Z',
          __v: 0,
          txExplorerLink: 'https://etherscan.io/tx/',
          withdrawMinimum: '0.005',
          enabled: true,
          hasMemoAddr: false,
          isOnlyAddr: true,
          usdPrice: '2838.85',
          id: '5cdaab544fee8b2a6dd64e7e',
        },
        account: {
          state: 2,
          email_verified: true,
          otp_verified: true,
          email: 'example@mail.com',
          password:
            '$2b$10$xIfqsG6gIEBRRuRov0vGKejTewpHelKaUU1wZrBUfXObvsLvOAu8.',
          name: 'whoiam',
          key_for_verify:
            'bfa5aa5b65640e20d0e1414a09b97f3f8740776b42bb7de499056d980cbf3c85',
          createdAt: '2020-11-25T05:22:43.311Z',
          updatedAt: '2022-04-14T07:46:12.022Z',
          __v: 0,
          secret_for_otp: 'KQ3SS4RFM56XWSLS',
          trade_state: 'idle',
          address: 'seoul',
          type: 'business',
          sixDigit: {
            val: '147434',
            createdAt: '2022-04-14T00:16:55.824Z',
          },
          country: '111South Korea, KOR',
          kyc: {
            state: 2,
          },
          fireblocksVaultId: '29',
          accessIP: '125.180.153.7',
          id: '5fbdea23d41b4c40cc21243b',
        },
        type: 'api',
        status: 'requested',
        state: 'wait',
        createdAt: 1650387038943,
        updatedAt: 1650387038943,
        __v: 0,
        readableCreatedAt: '2022-04-20 01:50:38',
        readableUpdatedAt: '2022-04-20 01:50:38',
        id: '625ee85e7bd66ab0a7b6cabd',
      },
    ],
  })
  withdrawals: WithdrawDocument[];
}

export class WithdrawIdDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'withdrawal ID',
    example: 'j12kl3jlkjdf93jkhk',
  })
  id: string;
}

export class RegisterTxIdReqDto extends WithdrawIdDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'txId',
    example: 'asfklajfdoa[ui9pojkfdasfklj',
  })
  txId: string;
}

export class WithdrawFee {
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
