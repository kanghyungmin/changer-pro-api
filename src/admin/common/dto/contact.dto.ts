import { ApiProperty } from '@nestjs/swagger';
import { ContactDocument } from '../../../entities/contact.entity';
import { AggregateDto } from './account.dto';

export class ChangerContactListResDto extends AggregateDto {
  @ApiProperty({
    example: [
      {
        message: 'test',
        name: 'test1',
        email: 'test16@test.com',
        createdAt: '2022-04-14T02:58:03.329Z',
        updatedAt: '2022-04-14T02:58:03.329Z',
        __v: 0,
        id: '62578dbb357d9a57f79fd2ba',
      },
    ],
  })
  contacts: ContactDocument[];
}
