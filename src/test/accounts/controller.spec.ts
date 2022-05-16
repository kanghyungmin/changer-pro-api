import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ErrorType } from 'src/common/enums/errorType';

let app: INestApplication;
const accountEmail = 'example@mail.com';
const pw = '1234';
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
describe('Common', () => {
  // it('Api Key JWT Auth', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get('/v1/accounts/noties')
  //     .set(
  //       'Authorization',
  //       'Bearer ' +
  //         'kjdfkaijfekC840VYTNNWXvoB0k',
  //     );
  //   expect(response.body.status).toEqual('error');
  // });
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
      .send({ email: accountEmail, password: pw });
    expect(response.body.message).toEqual(
      ErrorType.E201_ACCOUNT_ALREADY_EXISTS,
    );
  });

  it('No Input Password', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/register')
      .send({ email: accountEmail });
    expect(response.body.statusCode).toEqual(400);
  });

  it('No Input Email', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/register')
      .send({ password: pw });
    expect(response.body.statusCode).toEqual(400);
  });

  it('No Email Format', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/register')
      .send({ email: 'examplemail.com', password: pw });
    expect(response.body.statusCode).toEqual(400);
  });
});

describe('Login', () => {
  // beforeEach(async () => {});

  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    expect(response.body.status).toEqual('ok');
  });

  it('No Input Password', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail });
    expect(response.body.statusCode).toEqual(401);
  });

  it('No Wrong Password', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: '12' });
    expect(response.body.message).toEqual(ErrorType.E222_INCORRECT_PASSWORD);
  });

  it('No Input Email ', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ password: pw });
    expect(response.body.statusCode).toEqual(401);
  });

  it('No account in DB', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: 'example11111111@mail.com', password: pw });

    expect(response.body.message).toEqual(ErrorType.E225_NO_USER);
  });
});

describe('Generate OTP', () => {
  let token = '';
  const invalidToken = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    token = response.body.token;
  });

  it.skip('Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/gen-otp')
      .set('Authorization', 'Bearer ' + token);
    expect(response.body.status).toEqual('ok');
  });

  it('Already Verified', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/gen-otp')
      .set('Authorization', 'Bearer ' + token);
    expect(response.body.status).toEqual('error');
  });

  it('Unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/gen-otp')
      .set('Authorization', 'Bearer ' + invalidToken)
      .send({ email: accountEmail, password: pw });
    expect(response.body.message).toEqual(ErrorType.E401_UNAUTHRIZED);
  });
});

describe('Register OTP', () => {
  let jwttoken = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    jwttoken = response.body.token;
  });

  it.skip('Already verify OTP', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/reg-otp')
      .send({ token: '052420' })
      .set('Authorization', 'Bearer ' + jwttoken);
    expect(response.body.message).toEqual(ErrorType.E207_ALREADY_VERIFIED_OTP);
  });

  it('No Opt Token', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/reg-otp')
      .send()
      .set('Authorization', 'Bearer ' + jwttoken);
    expect(response.body.message).toEqual(ErrorType.E229_NO_OTP_TOKEN);
  });
}); //

describe('Verify OTP', () => {
  let jwttoken = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    jwttoken = response.body.token;
  });

  it('No Opt Token', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/verify-otp')
      .send()
      .set('Authorization', 'Bearer ' + jwttoken);
    expect(response.body.statusCode).toEqual(400);
  });
}); //

describe('Send code to email', () => {
  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/send-code-to-email')
      .send({ email: accountEmail });
    expect(response.body.status).toEqual('ok');
  });

  it('No email Format', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/send-code-to-email')
      .send({ email: 'examplemail.com' });
    expect(response.body.statusCode).toEqual(400);
  });

  it('No Input Email', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/send-code-to-email')
      .send();
    expect(response.body.statusCode).toEqual(400);
  });

  it('No email in DB', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/send-code-to-email')
      .send({ email: 'example11111111@mail.com' });
    expect(response.body.message).toEqual(ErrorType.E217_NOT_EXISTS_EMAIL);
  });

  it('Send Email With JWT', async () => {
    let response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    const token = response.body.token;

    response = await request(app.getHttpServer())
      .post('/v1/accounts/send-code-to-email-jwt')
      .set('Authorization', 'Bearer ' + token);
    expect(response.body.status).toEqual('ok');
  });
});

describe('Get KYC Status', () => {
  let token = '';
  const invalidToken = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
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
      .send({ email: accountEmail, password: pw });
    expect(response.body.message).toEqual(ErrorType.E401_UNAUTHRIZED);
  });
});

describe('Get notification', () => {
  let token = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    token = response.body.token;
  });

  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/accounts/noties')
      .set('Authorization', 'Bearer ' + token)
      .send();
    expect(response.body.status).toEqual('ok');
  });
});

describe('Set Address', () => {
  let token = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    token = response.body.token;
  });

  it('Success', async () => {
    let response = await request(app.getHttpServer())
      .post('/v1/accounts/address')
      .set('Authorization', 'Bearer ' + token)
      .send({ address: 'busan', accountType: 'business' });

    response = await request(app.getHttpServer())
      .post('/v1/accounts/address')
      .set('Authorization', 'Bearer ' + token)
      .send({ address: 'seoul', accountType: 'business' });
    expect(response.body.status).toEqual('ok');
  });

  it('No input address', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/address')
      .set('Authorization', 'Bearer ' + token)
      .send({ accountType: 'business' });
    expect(response.body.statusCode).toEqual(400);
  });
  it('No input accountType', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/address')
      .set('Authorization', 'Bearer ' + token)
      .send({ address: 'seoul' });
    expect(response.body.statusCode).toEqual(400);
  });
  it('AccountType is not enum', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/address')
      .set('Authorization', 'Bearer ' + token)
      .send({ address: 'seoul', accountType: 'busine' });
    expect(response.body.statusCode).toEqual(400);
  });
});

describe('Change Password', () => {
  let token = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    token = response.body.token;
  });

  it.skip('Success', async () => {
    let response = await request(app.getHttpServer())
      .post('/v1/accounts/change-pw')
      .set('Authorization', 'Bearer ' + token)
      .send({
        orgPw: pw,
        newPw: '12345',
        confirmPw: '12345',
      });
    response = await request(app.getHttpServer())
      .post('/v1/accounts/change-pw')
      .set('Authorization', 'Bearer ' + token)
      .send({
        orgPw: '12345',
        newPw: pw,
        confirmPw: pw,
      });
    expect(response.body.code).toEqual(200);
  });

  it.skip('Org Pw is equal New Pw', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/change-pw')
      .set('Authorization', 'Bearer ' + token)
      .send({
        orgPw: pw,
        newPw: pw,
        confirmPw: pw,
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
        newPw: pw,
        confirmPw: pw,
      });
    expect(response.body.message).toEqual(ErrorType.E222_INCORRECT_PASSWORD);
  });
});
describe('disable OTP', () => {
  let jwtToken = '';
  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    jwtToken = response.body.token;
  });

  it('No otp Token', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/disable-otp')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({});
    expect(response.body.message).toEqual(ErrorType.E229_NO_OTP_TOKEN);
  });
});
describe('Verify Code', () => {
  //Read이니 code field를 가져오자
  let jwtToken = '';
  let code = '';
  beforeAll(async () => {
    let response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    jwtToken = response.body.token;
    response = await request(app.getHttpServer())
      .get('/v1/accounts/code')
      .set('Authorization', 'Bearer ' + jwtToken);
    code = response.text;
  });

  it('No input Email', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/verify-code')
      .send({ code });
    expect(response.body.statusCode).toEqual(400);
  });
  it('Not Email Format', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/verify-code')
      .send({ email: 'examplemail.com', code });
    expect(response.body.statusCode).toEqual(400);
  });
  it('No Code Input', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/verify-code')
      .send({ email: 'examplemail.com' });
    expect(response.body.statusCode).toEqual(400);
  });

  it('Wrong Code Input', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/verify-code')
      .send({ email: 'example@mail.com', code: '123456' });
    expect(response.body.message).toEqual(ErrorType.E209_NOT_MATCHED_SIXDIGIT);
  });
  it('Success(w/o JWT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/verify-code')
      .send({ email: 'example@mail.com', code: code });
    expect(response.body.status).toEqual('ok');
  });

  it('No Code Field(w/ JWT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/verify-code-jwt')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({});
    expect(response.body.statusCode).toEqual(400);
  });
  it('Wrong Code Field(w/ JWT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/verify-code-jwt')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({ code: '123456' });
    expect(response.body.message).toEqual(ErrorType.E209_NOT_MATCHED_SIXDIGIT);
  });
  it('Success(w/ JWT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/verify-code-jwt')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({ code: code });
    expect(response.body.status).toEqual('ok');
  });
});
describe('Forgot-password-precheck', () => {
  let jwtToken = '';
  let code = '';

  beforeAll(async () => {
    let response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    jwtToken = response.body.token;
    response = await request(app.getHttpServer())
      .get('/v1/accounts/code')
      .set('Authorization', 'Bearer ' + jwtToken);
    code = response.text;
  });

  it('Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/forgot-password-precheck')
      .send({ email: accountEmail, code: code });
    expect(response.body.status).toEqual('ok');
  });

  it('No input email field', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/forgot-password-precheck')
      .send({ code: code });
    expect(response.body.statusCode).toEqual(400);
  });

  it('Not email format', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/forgot-password-precheck')
      .send({ email: 'examplemail.com', code: code });
    expect(response.body.statusCode).toEqual(400);
  });

  it('No code filed', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/forgot-password-precheck')
      .send({ email: accountEmail });
    expect(response.body.message).toEqual(ErrorType.E211_NO_SIXDIGIT_CODE);
  });

  it('wrong code filed', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/forgot-password-precheck')
      .send({ email: 'example@mail.com', code: '123456' });
    expect(response.body.message).toEqual(ErrorType.E209_NOT_MATCHED_SIXDIGIT);
  });
});
describe('Reset Password', () => {
  //token 필드 필요.
  let jwtToken = '';
  let code = '';
  let key = '';
  beforeAll(async () => {
    let response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    jwtToken = response.body.token;
    response = await request(app.getHttpServer())
      .get('/v1/accounts/code')
      .set('Authorization', 'Bearer ' + jwtToken);
    code = response.text;
    response = await request(app.getHttpServer())
      .post('/v1/accounts/forgot-password-precheck')
      .send({ email: 'example@mail.com', code: code });
    key = response.body.token;
  });

  it('Email info != key email info', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/reset-password')
      .send({
        email: 'hmkkang0922@daum.net',
        newPw: '12345',
        confirmPw: '12345',
        token: key,
      });
    expect(response.body.message).toEqual(ErrorType.E230_EMAIL_INVALID);
  });

  it('Success', async () => {
    let response = await request(app.getHttpServer())
      .post('/v1/accounts/reset-password')
      .send({
        email: accountEmail,
        newPw: '12345',
        confirmPw: '12345',
        token: key,
      });
    response = await request(app.getHttpServer())
      .post('/v1/accounts/reset-password')
      .send({
        email: accountEmail,
        newPw: pw,
        confirmPw: pw,
        token: key,
      });
    expect(response.body.status).toEqual('ok');
  });

  it('No input token', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/reset-password')
      .send({
        email: accountEmail,
        newPw: '12345',
        confirmPw: '12345',
      });
    expect(response.body.statusCode).toEqual(400);
  });

  it('Wrong input token', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/reset-password')
      .send({
        email: accountEmail,
        newPw: '12345',
        confirmPw: '12345',
        token: '123456',
      });
    expect(response.body.status).toEqual('error');
  });

  it('No input email', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/reset-password')
      .send({
        newPw: pw,
        confirmPw: pw,
        token: key,
      });
    expect(response.body.statusCode).toEqual(400);
  });

  it('Validate email field', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/reset-password')
      .send({
        email: 'examplemail.com',
        newPw: pw,
        confirmPw: pw,
        token: key,
      });
    expect(response.body.statusCode).toEqual(400);
  });

  it('No newPW field', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/reset-password')
      .send({
        email: accountEmail,
        confirmPw: pw,
        token: key,
      });
    expect(response.body.statusCode).toEqual(400);
  });

  it('No confirmPW field', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/reset-password')
      .send({
        email: accountEmail,
        newPw: pw,

        token: key,
      });
    expect(response.body.statusCode).toEqual(400);
  });

  it('New Pw != Confirm Pw', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/accounts/reset-password')
      .send({
        email: accountEmail,
        newPw: pw,
        confirmPw: '1234567',
        token: key,
      });
    expect(response.body.message).toEqual(
      ErrorType.E221_NEW_PW_AND_CONFIRM_PW_DIFF,
    );
  });
});
describe('KYC', () => {
  let jwtToken = '';
  beforeAll(async () => {
    let response = await request(app.getHttpServer())
      .post('/v1/accounts/login')
      .send({ email: accountEmail, password: pw });
    jwtToken = response.body.token;
    response = await request(app.getHttpServer())
      .get('/v1/accounts/code')
      .set('Authorization', 'Bearer ' + jwtToken);
  });

  it('Get KYC(Approve) ', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/accounts/kyc')
      .set('Authorization', jwtToken);
    expect(response.body.status).toEqual('ok');
  });
});

afterAll(async () => {
  await app.close();
});
