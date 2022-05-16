import { ApiProperty } from '@nestjs/swagger';
import { ActionLogDocument } from '../entities/actionLog.entity';

import { AggregateDto } from './account.dto';

export class ActionLogGetListResDto extends AggregateDto {
  @ApiProperty({
    example: {
      logs: [
        {
          user: '627b62f20a7b5a9e63aa9a04',
          content: 'Generate eugene2@chainpartners.net user',
          createdAt: '2022-05-11T07:17:06.684Z',
          updatedAt: '2022-05-11T07:17:06.684Z',
          __v: 0,
          adminAccount: {
            email: 'eugene2@chainpartners.net',
            password:
              '$2b$10$fMpCQa4VIh.YKJYmWyWCVekU5rJnxCjTscB2NuWeYn8GwdtDzFjbq',
            type: 'Viewer',
            email_verified: false,
            otp_verified: false,
            createdAt: '2022-05-11T07:17:06.499Z',
            updatedAt: '2022-05-11T07:17:06.689Z',
            createdPassword: '2022-05-11T07:17:06.499Z',
            sixDigit: {
              val: '447881',
              createdAt: '2022-05-11T07:17:06.563Z',
            },
            __v: 0,
            secret_for_otp: 'MM5VOVBWOBBGQWTP',
            id: '627b62f20a7b5a9e63aa9a04',
          },
          id: '627b62f20a7b5a9e63aa9a06',
        },
      ],
      count: {
        total: 1,
      },
    },
  })
  logs: ActionLogDocument[];
  count: number;
}
