import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  Announcement,
  AnnouncementDocument,
} from '../../entities/announcement.entity';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from '../common/dto/announcement.dto';
import { ErrorType } from '../common/enum/errorType';

@Injectable()
export class AnnouncementRepository {
  constructor(
    @InjectModel(Announcement.name)
    private readonly announcementModel: Model<Announcement>,
  ) {}

  async getAnnouncements(
    start: number,
    length: number,
  ): Promise<AnnouncementDocument[]> {
    const announcements: AnnouncementDocument[] = await this.announcementModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);
    return announcements;
  }

  async getAnnouncementCount(): Promise<number> {
    const totalCount: number = await this.announcementModel.countDocuments();
    return totalCount;
  }

  async createAnnouncement(
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<AnnouncementDocument | ErrorType> {
    let announcement: AnnouncementDocument = new this.announcementModel({
      title: createAnnouncementDto.title,
      content: createAnnouncementDto.content,
      enable: createAnnouncementDto.enable,
    });
    announcement = await announcement.save();

    if (!announcement) {
      return ErrorType.E1006_ANNOUNCEMENT_NOT_FOUND;
    }

    return announcement;
  }

  async updateAnnouncement(
    updateAnnouncementDto: UpdateAnnouncementDto,
    session: ClientSession,
  ) {
    await this.announcementModel
      .updateOne(
        { _id: updateAnnouncementDto.id },
        {
          $set: {
            title: updateAnnouncementDto.title,
            content: updateAnnouncementDto.content,
            enable: updateAnnouncementDto.enable,
          },
        },
      )
      .session(session)
      .then((result) => {
        if (!result.modifiedCount) {
          throw new Error(ErrorType.E1006_ANNOUNCEMENT_NOT_FOUND);
        }
      });
  }

  async deleteAnnouncement(id: string, session: ClientSession) {
    await this.announcementModel
      .deleteOne({
        _id: id,
      })
      .session(session)
      .then((result) => {
        if (!result.deletedCount) {
          throw new Error(ErrorType.E1006_ANNOUNCEMENT_NOT_FOUND);
        }
      });
  }
}
