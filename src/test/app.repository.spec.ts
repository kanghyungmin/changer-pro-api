// process.env.NODE_ENV = 'development';

// import { MongooseModule } from '@nestjs/mongoose';
// import { Test } from '@nestjs/testing';
// import { AppModule } from 'src/app.module';
// import {
//   Announcement,
//   AnnouncementDocument,
//   AnnouncementSchema,
// } from 'src/entities/announcement.entity';
// import { AnnouncementRepository } from 'src/v1/repository/announcement.repository';

// describe('AnnounceRepository', () => {
//   let announcementRepository: AnnouncementRepository;
//   beforeEach(async () => {
//     const app = await Test.createTestingModule({
//       providers: [AnnouncementRepository],
//       imports: [
//         MongooseModule.forFeature([
//           { name: Announcement.name, schema: AnnouncementSchema },
//         ]),
//         AppModule,
//       ],
//     }).compile();

//     announcementRepository = app.get<AnnouncementRepository>(
//       AnnouncementRepository,
//     );

//     const dbStatus = announcementRepository.mongoConnection.readyState;
//     console.log('beforeEach dbStatus', dbStatus);
//   });

//   it('should be defined', async () => {
//     expect(announcementRepository).toBeDefined();
//   });

//   it('findAll', async () => {
//     const start = 0;
//     const length = 10;
//     const announcements: AnnouncementDocument[] =
//       await announcementRepository.getAnnouncements(start, length);

//     const dbStatus = announcementRepository.mongoConnection.readyState;
//     console.log('findAll dbStatus', dbStatus);

//     expect(announcements).toBeInstanceOf(Array);
//   });

//   it('count', async () => {
//     const result: number = await announcementRepository.getAnnouncementCount();

//     const dbStatus = announcementRepository.mongoConnection.readyState;
//     console.log('count dbStatus', dbStatus);

//     expect(typeof result).toBe('number');
//   });

//   afterAll(async () => {
//     const startDbStatus = announcementRepository.mongoConnection.readyState;
//     console.log('afterAll dbStatus', startDbStatus);

//     const endDbStatus = announcementRepository.mongoConnection.readyState;
//     console.log('close afterAll dbStatus', endDbStatus);
//   });
// });
