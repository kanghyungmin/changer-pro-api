// process.env.NODE_ENV = 'development';

// import { Test } from '@nestjs/testing';
// import { AnnouncementController } from 'src/v1/controller/announcement.controller';
// import { AnnouncementService } from 'src/v1/service/announcement.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import {
//   Announcement,
//   AnnouncementSchema,
// } from 'src/entities/announcement.entity';
// import { AppModule } from 'src/app.module';
// import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

// const moduleMocker = new ModuleMocker(global);

// describe('AnnounceController', () => {
//   let announcementController: AnnouncementController;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       controllers: [AnnouncementController],
//       imports: [
//         MongooseModule.forFeature([
//           { name: Announcement.name, schema: AnnouncementSchema },
//         ]),
//         AppModule,
//       ],
//     })
//       .useMocker((token) => {
//         console.log('token ', token);
//         if (token === AnnouncementService) {
//           return { getAnnouncementCount: jest.fn().mockResolvedValue(this) };
//         }

//         if (typeof token === 'function') {
//           const mockMetadata = moduleMocker.getMetadata(
//             token,
//           ) as MockFunctionMetadata<any, any>;
//           const Mock = moduleMocker.generateFromMetadata(mockMetadata);
//           return new Mock();
//         }
//       })
//       .compile();

//     console.log('moduleRef', moduleRef);

//     announcementController = moduleRef.get(AnnouncementController);
//   });
// });
