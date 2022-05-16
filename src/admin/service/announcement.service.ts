import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { AnnouncementDocument } from '../../entities/announcement.entity';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from '../common/dto/announcement.dto';
import { AnnouncementRepository } from '../repository/announcement.repository';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    @InjectConnection(process.env.REPL_MONGO_DB)
    private readonly mongoConnection: Connection,
  ) {}

  async getAnnouncements(
    start: number,
    length: number,
  ): Promise<AnnouncementDocument[]> {
    const announcements: AnnouncementDocument[] =
      await this.announcementRepository.getAnnouncements(start, length);
    return announcements;
  }

  async getAnnouncementCount(): Promise<number> {
    const totalCount = await this.announcementRepository.getAnnouncementCount();
    return totalCount;
  }

  async createAnnouncement(
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<AnnouncementDocument> {
    const announcement = await this.announcementRepository.createAnnouncement(
      createAnnouncementDto,
    );
    return announcement as AnnouncementDocument;
  }

  async updateAnnouncement(updateAnnouncementDto: UpdateAnnouncementDto) {
    const session = await this.mongoConnection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.announcementRepository.updateAnnouncement(
          updateAnnouncementDto,
          session,
        );
      });
    } catch (error) {
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }

  async deleteAnnouncement(id: string) {
    const session = await this.mongoConnection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.announcementRepository.deleteAnnouncement(id, session);
      });
    } catch (error) {
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }
}
