import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ErrorType } from '../enum/errorType';
import { Schema as MongooseSchema } from 'mongoose';
import { FeeType } from '../enum/feeType';

export class HttpResDto {
  @ApiProperty({
    example: 'ok',
  })
  status?: string;
  code?: number | ErrorType;
  message?: string;
}

export class AggregateDto extends HttpResDto {
  @ApiProperty({
    example: '10',
  })
  totalCount?: number;
}

export class ArrayNum<T> {
  arr: T[];
  totalCount: number;
}

export class ErrorResDto {
  message: string;
  code: number;
}

export class quoteDto {
  @IsNotEmpty()
  @IsString()
  ticker: string;

  @IsNotEmpty()
  @IsString()
  quantity: string;
}

export class QueryPaginate {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    type: 'number',
    required: false,
    example: '0',
  })
  start = 0;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    type: 'number',
    required: false,
    example: '1',
  })
  length = 10;
}

export class QueryDates {
  @IsString()
  @Type(() => String)
  @ApiProperty({
    type: 'string',
    required: false,
    example: '1651733156932',
  })
  startDate;

  @IsString()
  @Type(() => String)
  @ApiProperty({
    type: 'string',
    required: false,
    example: '1651561203385',
  })
  endDate;
}

export class MongooseID {
  @ApiProperty({
    type: 'MongooseSchema.Types.ObjectId',
    example: '5ffc1c72a2d32e41296b50b5',
  })
  id: MongooseSchema.Types.ObjectId;
}

// todo 추후 class 폴더로 변경 예정
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

// todo 추후 class 폴더로 변경 예정
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
