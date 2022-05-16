import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ErrorType } from 'src/common/enums/errorType';

let app: INestApplication;
beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();
});
describe('Common', () => {
  it('Api Key JWT Auth', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/accounts/noties')
      .set(
        'Authorization',
        'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI2MzEwYWQzMS02NGU5LTQwY2MtOWYzOC05MTYxNjM3MmI2MjAiLCJub25jZSI6Im5vdW5jZSIsImlhdCI6MTY0NzcwMTcyMH0.naISnS7XWNpmpir5v1DPIhHwyokC840VYTNNWXvoB0k',
      );
    expect(response.body.status).toEqual('ok');
  });
  it('Invalid Token', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/accounts/noties')
      .set(
        'Authorization',
        'Bearer ' +
          'JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI2MzEwYWQzMS02NGU5LTQwY2MtOWYzOC05MTYxNjM3MmI2MjAiLCJub25jZSI6Im5vdW5jZSIsImlhdCI6MTY0NzcwMTcyMH0.naISnS7XWNpmpir5v1DPIhHwyokC840VYTNNWXvoB0k',
      );
    expect(response.body.status).toEqual('error');
  });
  it('No token', async () => {
    const response = await request(app.getHttpServer()).get(
      '/v1/accounts/noties',
    );

    expect(response.body.status).toEqual('error');
  });
});
describe('Register', () => {
  // beforeEach(async () => {});
  // it('Create User', async () => {});

  it('Already User', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/register')
      .send({ email: 'example@mail.com', password: '1234' });
    expect(response.body.message).toEqual(
      ErrorType.E201_ACCOUNT_ALREADY_EXISTS,
    );
  });

  it.only('No Input Password', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/register')
      .send({ email: 'example@mail.com' });
    console.log(response);
    expect(response.body.Status).toEqual(400);
  });

  it('Already User', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/register')
      .send({ email: 'example@mail.com', password: '1234' });
    expect(response.body.message).toEqual(
      ErrorType.E201_ACCOUNT_ALREADY_EXISTS,
    );
  });

  it('Already User', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/register')
      .send({ email: 'example@mail.com', password: '1234' });
    expect(response.body.message).toEqual(
      ErrorType.E201_ACCOUNT_ALREADY_EXISTS,
    );
  });

  it('Already User', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/register')
      .send({ email: 'example@mail.com', password: '1234' });
    expect(response.body.message).toEqual(
      ErrorType.E201_ACCOUNT_ALREADY_EXISTS,
    );
  });
});

describe('Login', () => {
  // beforeEach(async () => {});

  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: 'example@mail.com', password: '1234' });
    expect(response.body.status).toEqual('ok');
  });

  it('Invalid User', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: 'example11111111@mail.com', password: '1234' });

    expect(response.body.message).toEqual(ErrorType.E225_NO_USER);
  });
});

describe('Generate OTP', () => {
  let token = '';
  const invalidToken = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: 'example@mail.com', password: '1234' });
    token = response.body.token;
  });

  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/gen-otp')
      .set('Authorization', 'Bearer ' + token)
      .send({ email: 'example@mail.com', password: '1234' });
    expect(response.body.status).toEqual('ok');
  });

  it('Unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/gen-otp')
      .set('Authorization', 'Bearer ' + invalidToken)
      .send({ email: 'example@mail.com', password: '1234' });
    expect(response.body.message).toEqual(ErrorType.E401_UNAUTHRIZED);
  });
});

describe('Send code to email', () => {
  // beforeEach(async () => {});

  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/send-code-to-email')
      .send({ email: 'example@mail.com' });
    expect(response.body.status).toEqual('ok');
  });

  it('Invalid Email', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/send-code-to-email')
      .send({ email: 'example11111111@mail.com', password: '1234' });
    expect(response.body.message).toEqual(ErrorType.E217_NOT_EXISTS_EMAIL);
  });
});

describe('Get KYC Status', () => {
  let token = '';
  const invalidToken = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: 'example@mail.com', password: '1234' });
    token = response.body.token;
  });

  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/accounts/kyc')
      .set('Authorization', 'Bearer ' + token)
      .send();
    expect(response.body.status).toEqual('ok');
  });

  it('Unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/accounts/kyc')
      .set('Authorization', 'Bearer ' + invalidToken)
      .send({ email: 'example@mail.com', password: '1234' });
    expect(response.body.message).toEqual(ErrorType.E401_UNAUTHRIZED);
  });
});

describe('Get notification', () => {
  let token = '';
  const invalidToken = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: 'example@mail.com', password: '1234' });
    token = response.body.token;
  });

  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/accounts/noties')
      .set('Authorization', 'Bearer ' + token)
      .send();
    expect(response.body.status).toEqual('ok');
  });

  it('Unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/accounts/noties')
      .set('Authorization', 'Bearer ' + invalidToken)
      .send();
    expect(response.body.message).toEqual(ErrorType.E401_UNAUTHRIZED);
  });
});

describe('Set Address', () => {
  let token = '';
  const invalidToken = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: 'example@mail.com', password: '1234' });
    token = response.body.token;
  });

  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/address')
      .set('Authorization', 'Bearer ' + token)
      .send({ address: 'seoul', accountType: 'business' });
    expect(response.body.status).toEqual('ok');
  });

  it('Unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/address')
      .set('Authorization', 'Bearer ' + invalidToken)
      .send({ address: 'seoul', accountType: 'business' });
    expect(response.body.message).toEqual(ErrorType.E401_UNAUTHRIZED);
  });
});

describe('Change Password', () => {
  let token = '';
  const invalidToken = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: 'example@mail.com', password: '1234' });
    token = response.body.token;
  });

  it.skip('Success', async () => {
    let response = await request(app.getHttpServer())
      .post('/v1/accounts/change-pw')
      .set('Authorization', 'Bearer ' + token)
      .send({
        orgPw: '1234',
        newPw: '12345',
        confirmPw: '12345',
      });
    response = await request(app.getHttpServer())
      .post('/v1/accounts/change-pw')
      .set('Authorization', 'Bearer ' + token)
      .send({
        orgPw: '12345',
        newPw: '1234',
        confirmPw: '1234',
      });
    expect(response.body.code).toEqual(200);
  });

  it.skip('Org Pw is equal New Pw', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/change-pw')
      .set('Authorization', 'Bearer ' + token)
      .send({
        orgPw: '1234',
        newPw: '1234',
        confirmPw: '1234',
      });
    expect(response.body.message).toEqual(
      ErrorType.E223_NEW_PW_AND_ORIGIN_PW_SAME,
    );
  });

  it.skip('Org Pw is not correct', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/change-pw')
      .set('Authorization', 'Bearer ' + token)
      .send({
        orgPw: '12354dsf',
        newPw: '1234',
        confirmPw: '1234',
      });
    expect(response.body.message).toEqual(ErrorType.E222_INCORRECT_PASSWORD);
  });

  it.skip('Unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/change-pw')
      .set('Authorization', 'Bearer ' + invalidToken)
      .send({
        orgPw: '12354dsf',
        newPw: '1234',
        confirmPw: '1234',
      });
    expect(response.body.message).toEqual(ErrorType.E401_UNAUTHRIZED);
  });
});

// describe('Forgot-password-precheck', () => {}); // test 시나리오에 대해 확인 후 수행
// describe('Reset Password', () => {}); // 추가 로직 개발 confirmemail endpoint랑 연동 시켜서
// describe('Verify OTP', () => {}); //
// describe('Register OTP', () => {}); // Mock 필요
// describe('disable OTP', () => {}); // Mock 필요
// describe('Verify Code', () => {}); // Mock 필요

afterAll(async () => {
  await app.close();
});
