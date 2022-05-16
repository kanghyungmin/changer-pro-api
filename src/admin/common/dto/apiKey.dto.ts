import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApiKey } from '../../../entities/apiKey.entity';
import { AggregateDto } from './common.dto';

export class ApiKeyResponseDto extends AggregateDto {
  @ApiProperty({
    example: [
      {
        _id: '623d836024e89d688ca11221',
        account: {
          email: 'bjjeon@chainpartners.net',
        },
        accessKey: '55aef29e-cbe2-442c-a32e-8bb2d27e2e39',
        createdAt: '2022-03-25T08:54:56.454Z',
        readableCreatedAt: '2022-03-25 17:54:56',
        readableUpdatedAt: '2022-05-04 16:25:24',
        id: '623d836024e89d688ca11221',
      },
    ],
  })
  apiKeys?: ApiKey[];
}

export class CreateApiKeyDto {
  account: string;
  accessKey: string;
  secretKey: string;
}

export class RequestApiKeyDto {
  @IsString()
  accountId: string;
}
