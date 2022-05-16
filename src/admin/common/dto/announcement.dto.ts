import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Announcement } from '../../../entities/announcement.entity';
import { AggregateDto, HttpResDto } from './common.dto';

export class AnnouncementResponseDto extends AggregateDto {
  @ApiProperty({
    example: [
      {
        enable: true,
        title: 'New Announcement',
        content: 'Hi,\n\nWelcome to Changer',
        createdAt: '1611883303972',
        updatedAt: '1611883352121',
        __v: 0,
        readableCreatedAt: '2022-04-21T02:41:50.386Z',
        readableUpdatedAt: '2022-04-21T02:41:50.386Z',
        id: '60372ab56b5f3569041dd21c',
      },
    ],
  })
  announcements: Announcement[];
}

export class AnnouncementDto extends HttpResDto {
  @ApiProperty({
    example: {
      enable: true,
      title: 'New Announcement',
      content: 'Hi,\n\nWelcome to Changer',
      createdAt: '1611883303972',
      updatedAt: '1611883352121',
      __v: 0,
      readableCreatedAt: '2022-04-21T02:41:50.386Z',
      readableUpdatedAt: '2022-04-21T02:41:50.386Z',
      id: '60372ab56b5f3569041dd21c',
    },
  })
  announcement?: Announcement;
}

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test announcement title',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test announcement content',
  })
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  enable: boolean;
}

export class UpdateAnnouncementDto extends CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '6278581a80d2c6b36a1360a1',
  })
  id: string;
}
