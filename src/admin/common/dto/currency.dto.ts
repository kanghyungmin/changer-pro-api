import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Currency } from '../../../entities/currency.entity';
import { CurrencyType } from '../enum/currencyType';
import { AggregateDto } from './common.dto';
import { DepositFee } from './deposit.dto';
import { WithdrawFee } from './withdraw.dto';

export class CurrencyResponseDto extends AggregateDto {
  @ApiProperty({
    example: [
      {
        depositFee: {
          _id: '62722e962468ad41eed08afe',
          amount: '0',
          type: 'no-fee',
        },
        withdrawFee: {
          _id: '62722e962468ad41eed08aff',
          amount: '0',
          type: 'no-fee',
        },
        depositEnable: false,
        withdrawEnable: false,
        name: 'esgd',
        createdAt: '2022-05-02T10:33:19.452Z',
        updatedAt: '2022-05-02T10:40:25.034Z',
        id: '626fb36fde39f5208968d7c2',
      },
    ],
  })
  currencies: Currency[];
}

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'escc',
  })
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: 'false',
  })
  depositEnable: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: 'false',
  })
  withdrawEnable: boolean;

  /**
   * @see https://github.com/typestack/class-validator#validating-nested-objects
   */
  @ValidateNested()
  @Type(() => DepositFee)
  @ApiProperty({ type: () => DepositFee })
  depositFee: DepositFee;

  /**
   * @see https://github.com/typestack/class-validator#validating-nested-objects
   */
  @ValidateNested()
  @Type(() => WithdrawFee)
  @ApiProperty({ type: () => WithdrawFee })
  withdrawFee: WithdrawFee;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'https://etherscan.io/tx/' })
  txExplorerLink: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example:
      'https://changer-resource.s3.ap-northeast-2.amazonaws.com/xxxx.svg',
  })
  icon: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'eSCC' })
  fullName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '4' })
  decimalPoint: string;

  @ApiProperty({
    example: `'spot' | 'fiat'`,
  })
  @IsEnum(CurrencyType)
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '1.1234' })
  usdPrice: string;
}

export class UpdateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '627c8fe9a9ebd519a227504a' })
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: 'false' })
  depositEnable: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: 'false' })
  withdrawEnable: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: 'false' })
  enabled: boolean;
}
