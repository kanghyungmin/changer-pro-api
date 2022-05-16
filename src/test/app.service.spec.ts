// process.env.NODE_ENV = 'development';

// import { MongooseModule } from '@nestjs/mongoose';
// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule } from 'src/app.module';
// import {
//   Announcement,
//   AnnouncementDocument,
//   AnnouncementSchema,
// } from 'src/entities/announcement.entity';
// import { AnnouncementRepository } from 'src/v1/repository/announcement.repository';
// import { AnnouncementService } from 'src/v1/service/announcement.service';

// describe('AnnounceService', () => {
//   let announcementService: AnnouncementService;

//   beforeEach(async () => {
//     const app: TestingModule = await Test.createTestingModule({
//       providers: [AnnouncementService, AnnouncementRepository],
//       imports: [
//         MongooseModule.forFeature([
//           { name: Announcement.name, schema: AnnouncementSchema },
//         ]),
//         AppModule,
//       ],
//     }).compile();

//     announcementService = app.get<AnnouncementService>(AnnouncementService);
//   });

//   it('should be defined', async () => {
//     expect(announcementService).toBeDefined();
//   });

//   it('findAll', async () => {
//     const start = 0;
//     const length = 10;
//     const announcements: AnnouncementDocument[] =
//       await announcementService.getAnnouncements(start, length);
//     expect(announcements).toBeInstanceOf(Array);
//   });

//   it('count', async () => {
//     const result: number = await announcementService.getAnnouncementCount();
//     // expect(result).toBeInstanceOf(Number);
//     expect(typeof result).toBe('number');
//   });
// });
