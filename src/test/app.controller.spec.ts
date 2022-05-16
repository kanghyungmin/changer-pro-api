// process.env.NODE_ENV = 'development';

// import { Test } from '@nestjs/testing';
// import { AppModule } from 'src/app.module';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';

// describe('Controller ', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleRef.createNestApplication();
//     await app.init();
//   });

//   it('should return status ok an array of announcements', async () => {
//     const response = await request(app.getHttpServer())
//       .get('/v1/common/announcements')
//       .query('start=0&length=10');
//     expect(response.body.status).toEqual('ok');
//   });

//   it('should return statusCode error an array of announcements', async () => {
//     const response = await request(app.getHttpServer())
//       .get('/v1/common/announcements')
//       .query('start=-1&length=-1');
//     expect(response.body.statusCode).toEqual(500);
//   });

//   it('should return status ok an array of currency', async () => {
//     const response = await request(app.getHttpServer()).get(
//       '/v1/common/currency',
//     );
//     expect(response.body.status).toEqual('ok');
//   });

//   it('should return status ok an array of markets', async () => {
//     const response = await request(app.getHttpServer()).get(
//       '/v1/common/markets',
//     );
//     expect(response.body.status).toEqual('ok');
//   });

//   it('should return status ok an contacts', async () => {
//     const response = await request(app.getHttpServer())
//       .post('/v1/common/contact')
//       .set('Accept', 'application/json')
//       .send({
//         email: 'test0123@test.com',
//         name: 'test',
//         message: 'test',
//       });

//     expect(response.body.status).toEqual('ok');
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
