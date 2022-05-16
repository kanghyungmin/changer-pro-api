import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

let app: INestApplication;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();
});
// describe('Market', () => {
//   it('No Data Provider Service', async () => {
//     const response = await request(app.getHttpServer()).get(
//       '/v1/common/market',
//     );
//     console.log(response);
//     expect(response.body.message).toEqual(
//       ErrorType.E301_CHANGER_DATA_PROVIDER_ERROR,
//     );
//   });
// });

describe('Announcement', () => {
  it('No Data Provider Service', async () => {
    const response = await request(app.getHttpServer()).get(
      '/v1/common/announcement',
    );
    expect(response.body.status).toEqual('ok');
  });
});

describe('Currency', () => {
  it('depositEnable: true, withdrawEnable: true', async () => {
    const response = await request(app.getHttpServer()).get(
      '/v1/common/currency?depositEnable=true&withdrawEnable=true',
    );
    const depositEnableField = response.body.currencies[0].depositEnable;
    const withdrawEnableField = response.body.currencies[0].withdrawEnable;
    expect({ depositEnableField, withdrawEnableField }).toEqual({
      depositEnableField: true,
      withdrawEnableField: true,
    });
  });

  it('depositEnable: true, withdrawEnable: false', async () => {
    const response = await request(app.getHttpServer()).get(
      '/v1/common/currency?depositEnable=true&withdrawEnable=false',
    );
    const depositEnableField = response.body.currencies[0].depositEnable;
    const withdrawEnableField = response.body.currencies[0].withdrawEnable;
    expect({ depositEnableField, withdrawEnableField }).toEqual({
      depositEnableField: true,
      withdrawEnableField: false,
    });
  });

  it('depositEnable: false, withdrawEnable: false', async () => {
    const response = await request(app.getHttpServer()).get(
      '/v1/common/currency?depositEnable=false&withdrawEnable=false',
    );
    const depositEnableField = response.body.currencies[0].depositEnable;
    const withdrawEnableField = response.body.currencies[0].withdrawEnable;
    expect({ depositEnableField, withdrawEnableField }).toEqual({
      depositEnableField: false,
      withdrawEnableField: false,
    });
  });

  // it('No argument', async () => {
  //   const response = await request(app.getHttpServer()).get(
  //     '/v1/common/currency',
  //   );

  //   const depositEnableField = response.body.currencies[0].depositEnable;
  //   const withdrawEnableField = response.body.currencies[0].withdrawEnable;
  //   console.log(depositEnableField, withdrawEnableField);
  //   expect({ depositEnableField, withdrawEnableField }).toEqual({
  //     depositEnableField: false,
  //     withdrawEnableField: false,
  //   });
  // });
});

describe('Contact', () => {
  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/common/contact')
      .send({ email: 'example@mail.com', name: 'test', message: 'test' });
    expect(response.body.status).toEqual('ok');
  });
  it('No Email Field', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/common/contact')
      .send({ name: 'test', message: 'test' });
    expect(response.body.statusCode).toEqual(400);
  });
  it('No Email format', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/common/contact')
      .send({ email: 'examplemail.com', name: 'test', message: 'test' });
    expect(response.body.statusCode).toEqual(400);
  });
  it('No Name Field', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/common/contact')
      .send({ email: 'example@mail.com', message: 'test' });
    expect(response.body.statusCode).toEqual(400);
  });
  it('No Msg Field', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/common/contact')
      .send({ email: 'example@mail.com', name: 'test' });
    expect(response.body.statusCode).toEqual(400);
  });
});

afterAll(async () => {
  await app.close();
});
