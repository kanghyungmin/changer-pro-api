import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ErrorType } from '../../common/enums/errorType';

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

describe('Balance', () => {
  it('No argument', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/balances')
      .set(
        'Authorization',
        'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI2MzEwYWQzMS02NGU5LTQwY2MtOWYzOC05MTYxNjM3MmI2MjAiLCJub25jZSI6Im5vdW5jZSIsImlhdCI6MTY0NzcwMTcyMH0.naISnS7XWNpmpir5v1DPIhHwyokC840VYTNNWXvoB0k',
      );
    expect(response.body.status).toEqual('ok');
  });
});

describe('Deposit', () => {
  it('start=1, length=5, type=deposit, currency=btc', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/deposits?start=1&length=5&type=deposit&currency=btc')
      .set(
        'Authorization',
        'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI2MzEwYWQzMS02NGU5LTQwY2MtOWYzOC05MTYxNjM3MmI2MjAiLCJub25jZSI6Im5vdW5jZSIsImlhdCI6MTY0NzcwMTcyMH0.naISnS7XWNpmpir5v1DPIhHwyokC840VYTNNWXvoB0k',
      );
    expect(response.body.status).toEqual('ok');
  });
});

describe('Withdraw', () => {
  it('start=0, length=10, status=requested, status=cancel, status=success, status=rejected, currency=ETH', async () => {
    const response = await request(app.getHttpServer())
      .get(
        '/v1/withdraws?start=0&length=10&status=requested&status=cancel&status=success&status=rejected&currency=ETH',
      )
      .set(
        'Authorization',
        'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI2MzEwYWQzMS02NGU5LTQwY2MtOWYzOC05MTYxNjM3MmI2MjAiLCJub25jZSI6Im5vdW5jZSIsImlhdCI6MTY0NzcwMTcyMH0.naISnS7XWNpmpir5v1DPIhHwyokC840VYTNNWXvoB0k',
      );
    expect(response.body.status).toEqual('ok');
  });
});

describe('withdraws Request', () => {
  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/withdraws/request')
      .set(
        'Authorization',
        'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI2MzEwYWQzMS02NGU5LTQwY2MtOWYzOC05MTYxNjM3MmI2MjAiLCJub25jZSI6Im5vdW5jZSIsImlhdCI6MTY0NzcwMTcyMH0.naISnS7XWNpmpir5v1DPIhHwyokC840VYTNNWXvoB0k',
      )
      .send({
        amount: '0.00715',
        currency: 'eth',
        address: '0xCDa9709f7bBDA46D12c6aDafef8168FECD662A16',
        networkType: 'ERC-20',
        token: '311060',
      });
    expect(response.body.status).toEqual('ok');
  });
  it('Invalid OTP token', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/withdraws/request')
      .set(
        'Authorization',
        'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI2MzEwYWQzMS02NGU5LTQwY2MtOWYzOC05MTYxNjM3MmI2MjAiLCJub25jZSI6Im5vdW5jZSIsImlhdCI6MTY0NzcwMTcyMH0.naISnS7XWNpmpir5v1DPIhHwyokC840VYTNNWXvoB0k',
      )
      .send({
        amount: '0.00715',
        currency: 'eth',
        address: '0xCDa9709f7bBDA46D12c6aDafef8168FECD662A16',
        networkType: 'ERC-20',
        token: '454083',
      });
    expect(response.body.message).toEqual(ErrorType.E228_INVALID_OTP);
  });
});

describe('withdraws Cancel', () => {
  // it('Success', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/v1/withdraws/cancel')
  //     .set(
  //       'Authorization',
  //       'Bearer ' +
  //         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI2MzEwYWQzMS02NGU5LTQwY2MtOWYzOC05MTYxNjM3MmI2MjAiLCJub25jZSI6Im5vdW5jZSIsImlhdCI6MTY0NzcwMTcyMH0.naISnS7XWNpmpir5v1DPIhHwyokC840VYTNNWXvoB0k',
  //     )
  //     .send({
  //       withdrawId: '624e91b227ce765af738d129',
  //     });
  //   expect(response.body.status).toEqual('ok');
  // });

  it('invalid withdrawstatus', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/withdraws/cancel')
      .set(
        'Authorization',
        'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI2MzEwYWQzMS02NGU5LTQwY2MtOWYzOC05MTYxNjM3MmI2MjAiLCJub25jZSI6Im5vdW5jZSIsImlhdCI6MTY0NzcwMTcyMH0.naISnS7XWNpmpir5v1DPIhHwyokC840VYTNNWXvoB0k',
      )
      .send({
        withdrawId: '624e91b227ce765af738d129',
      });
    expect(response.body.message).toEqual(
      ErrorType.E305_INVALID_WITHDRAWSTATUS,
    );
  });
});

describe('assign Wallet address', () => {
  // it('Success', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/v1/depositAddr/assign/bsv')
  //     .set(
  //       'Authorization',
  //       'Bearer ' +
  //         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI2MzEwYWQzMS02NGU5LTQwY2MtOWYzOC05MTYxNjM3MmI2MjAiLCJub25jZSI6Im5vdW5jZSIsImlhdCI6MTY0NzcwMTcyMH0.naISnS7XWNpmpir5v1DPIhHwyokC840VYTNNWXvoB0k',
  //     );
  //   expect(response.body.status).toEqual('ok');
  // });

  it('already exist address', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/depositAddr/assign/eth')
      .set(
        'Authorization',
        'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI2MzEwYWQzMS02NGU5LTQwY2MtOWYzOC05MTYxNjM3MmI2MjAiLCJub25jZSI6Im5vdW5jZSIsImlhdCI6MTY0NzcwMTcyMH0.naISnS7XWNpmpir5v1DPIhHwyokC840VYTNNWXvoB0k',
      );
    expect(response.body.message).toEqual(ErrorType.E313_ALREADY_EXIST_ADDRESS);
  });
});

afterAll(async () => {
  await app.close();
});
