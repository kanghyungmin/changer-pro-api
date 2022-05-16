import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

let app: INestApplication;
jest.setTimeout(30000);

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
  const wait = (timeToDelay) =>
    new Promise((resolve) => setTimeout(resolve, timeToDelay));
  await wait(15000);
});

describe('Usdt-prices', () => {
  //data provider - 연결
  it('Get usdt-prices', async () => {
    const response = await request(app.getHttpServer()).get(
      '/v1/changer/usdt-prices',
    );

    //usdt 키를 가지고 있냐?
    // console.log(JSON.stringify(response.body.data.USDT));
    expect(JSON.stringify(response.body.data.USDT)).not.toBeUndefined();
  });
});

describe('Get Quote', () => {
  it('quote', async () => {
    const response = await request(app.getHttpServer()).get(
      '/v1/changer/quote?ticker=btc_usdt&quantity=1',
    );
    // console.log(response.body);
    expect(response.body.status).toEqual('ok');
  });

  it('quotes', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/changer/quotes')
      .send({
        quotePairs: ['btc_usdt:btc:10', 'btc_usdt:btc:20', 'et_usdt:et:10'],
      });

    // console.log(response.body);

    expect(response.body['BTC_USDT:BTC:10'].status).toEqual('ok');
    expect(response.body['BTC_USDT:BTC:20'].status).toEqual('ok');
    expect(response.body['ET_USDT:ET:10'].status).toEqual('error');
  });

  it('no quote', async () => {
    const response = await request(app.getHttpServer()).get(
      '/v1/changer/quote?ticker=btc_us&quantity=1',
    );
    // console.log(response.body);
    expect(response.body.status).toEqual('error');
  });
});

describe('Get trade lists', () => {
  let token = '';
  const accountEmail = 'example@mail.com',
    pw = '1234';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    token = response.body.token;
  });

  it('quote', async () => {
    //Authorization token 얻기.

    const response = await request(app.getHttpServer())
      .get('/v1/changer/trades?start=0&length=10&type=all')
      .set('Authorization', 'Bearer ' + token);
    // console.log(response.body);
    expect(response.body.status).toEqual('ok');
  });
});

describe('Place Order', () => {
  let token = '';
  const accountEmail = 'example@mail.com',
    pw = '1234';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    token = response.body.token;
  });

  it('trade', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/changer/trade')
      .send({
        ticker: 'BTC_USDT',
        quantity: '0.0005',
        action: 'buy',
      })
      .set('Authorization', 'Bearer ' + token);
    console.log(response.body);
    expect(response.body.status).toEqual('ok');
    const wait = (timeToDelay) =>
      new Promise((resolve) => setTimeout(resolve, timeToDelay));
    await wait(3000);
  });
});

afterAll(async () => {
  await app.close();
});
