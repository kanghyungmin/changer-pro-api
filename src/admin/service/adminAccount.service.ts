import { Injectable } from '@nestjs/common';
import { EmailNotiService } from '../../common/utils/email/emailNoti.service';
import {
  ChangeRolesDto,
  genOtpDtoRes,
  RegisterAccountDto,
  regOtpReq,
} from '../common/dto/account.dto';
import { AdminAccountDocument } from '../common/entities/admin.entity';
import { AdminAccountRepository } from '../repository/adminAccount.repository';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import { ADMINROLETYPE } from '../../common/enums/adminType';
import { CustomError } from '../../common/classes/error';
import { ErrorType } from '../../common/enums/errorType';
import { AccountDocument } from '../../entities/account.entity';
import { UserActionService } from './userAction.service';

@Injectable()
export class AdminAccountService {
  constructor(
    private readonly adminAccountRepository: AdminAccountRepository,
    private jwtService: JwtService,
    private emailNotiService: EmailNotiService,
    private actionLogService: UserActionService,

    @InjectConnection(process.env.REPL_ADMIN_MONGO_DB)
    private readonly mongoConnection: Connection,
    @InjectConnection(process.env.REPL_MONGO_DB)
    private readonly mongoChangerConnection: Connection,
  ) {}

  async registerAccount(
    registerAccountDto: RegisterAccountDto,
  ): Promise<AdminAccountDocument> {
    const sixDigit = this.emailNotiService.createVerfiySixDigit();

    const res: AdminAccountDocument | ErrorType =
      await this.adminAccountRepository.registerAccount(
        registerAccountDto,
        sixDigit,
      );

    this.actionLogService.writeLogToDB(
      res as AdminAccountDocument, //action user
      `Generate ${registerAccountDto.email} user`, //log content
    );
    return res as AdminAccountDocument;
  }

  async getToken(account: AdminAccountDocument): Promise<string> {
    const payload = {
      email: account.email,
      email_verified: account.email_verified,
      otp_verified: account.otp_verified,
      type: account.type,
    };

    const token: string = this.jwtService.sign(payload);

    return token;
  }
  async login(account: AdminAccountDocument): Promise<string> {
    const token: string = await this.getToken(account);
    const duration: number =
      new Date().valueOf() - account.createdPassword.valueOf();

    if (
      duration >
      Number(process.env.PW_VALID_PERIOD) * 1000 * 60 * 60 * 24 * 180
    ) {
      throw new CustomError(ErrorType.E1003_NEED_UPDATE_PW, 1003);
    }

    return token;
  }
  async findOne(registerAccount: RegisterAccountDto) {
    const account = await this.adminAccountRepository.getAccountByEmail(
      registerAccount.email,
    );
    if (!account) return null;
    return account;
  }

  async getAccountByEmail(email: string) {
    const account: AdminAccountDocument =
      await this.adminAccountRepository.getAccountByEmail(email);
    if (!account) {
      throw new CustomError(ErrorType.E202_ACCOUNT_NOT_FOUND, 202);
    }
    return account;
  }
  async changeRoles(reqDto: ChangeRolesDto) {
    const account: AdminAccountDocument =
      await this.adminAccountRepository.getAccountByEmail(reqDto.email);
    account.type = reqDto.newRole;
    const session = await this.mongoConnection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.adminAccountRepository.updateAccountInfo(account, session);
      });
    } catch (error) {
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }
  async getListRoles(): Promise<ADMINROLETYPE[]> {
    const keys = Object.keys(ADMINROLETYPE);
    const values: any = keys.map((k) => ADMINROLETYPE[k as any]);

    return values;
  }
  async cngPwSvc(account: AdminAccountDocument, newPw: string): Promise<void> {
    //비번이 같으면 throw를 던지는 에러 처리 필요.

    account.createdPassword = new Date();
    account.password = await account.encryptPassword(newPw);
    await this.adminAccountRepository.updateAccountInfo(account);
  }
  async generateOtp(account: AdminAccountDocument): Promise<genOtpDtoRes> {
    if (account.otp_verified) {
      throw new CustomError(ErrorType.E205_ALREADY_VERIFIED_OTP, 205);
    }

    if (account.secret_for_otp) {
      const url = `otpauth://totp/Changer(${account.email})?secret=${account.secret_for_otp}`;
      return { secret: account.secret_for_otp, otpauthURL: url };
    }

    const secret = speakeasy.generateSecret({
      length: 10,
      name: `Changer(${account.email})`,
    });

    account.otp_verified = false;
    account.secret_for_otp = secret.base32;
    const session = await this.mongoConnection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.adminAccountRepository.updateAccountInfo(account, session);
      });
    } catch (error) {
      throw new Error(error.message);
    } finally {
      session.endSession();
    }

    return {
      // message: 'success to generate otp',
      secret: secret.base32,
      otpauthURL: secret.otpauth_url,
    };
  }
  async verifyOtpService(
    account: AdminAccountDocument,
    token: string,
  ): Promise<boolean> {
    if (!token) {
      throw new CustomError(ErrorType.E208_NO_OTP_TOKEN, 208);
    } else if (!account || !account.secret_for_otp) {
      throw new CustomError(ErrorType.E206_USER_NOT_HAVE_SECRET_OTP, 206);
    } else {
      const verified = speakeasy.totp.verify({
        secret: account.secret_for_otp,
        encoding: 'base32',
        token: token,
      });
      return verified;
    }
  }
  async regOtp(emailToken: regOtpReq) {
    //이메일정보 가지고 AdminAccount 얻기.
    const account: AdminAccountDocument = await this.getAccountByEmail(
      emailToken.email,
    );
    //otp verified 하기.
    const otp_verified = await this.verifyOtpService(account, emailToken.token);
    if (!otp_verified) {
      throw new CustomError(ErrorType.E214_INVALID_TOKEN, 214);
    }
    if (account.otp_verified) {
      throw new CustomError(ErrorType.E207_ALREADY_VERIFIED_OTP, 207);
    } else {
      account.otp_verified = true;
      const session = await this.mongoConnection.startSession();
      try {
        await session.withTransaction(async () => {
          await this.adminAccountRepository.updateAccountInfo(account, session);
        });
      } catch (error) {
        throw new Error(error.message);
      } finally {
        session.endSession();
      }
    }
  }
  async getChangerAccountList(
    start: number,
    length: number,
    adminUser?: AdminAccountDocument,
  ): Promise<AccountDocument[]> {
    try {
      const accounts: AccountDocument[] =
        await this.adminAccountRepository.getChangerAccountList(start, length);

      // admin이 아닐 경우,
      if (adminUser.type !== ADMINROLETYPE.ADMIN) {
        accounts.forEach((account) => (account.email = ''));
      }
      return accounts;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getChangerAccountCount(): Promise<number> {
    const changerAccountCount =
      await this.adminAccountRepository.getChangerAccountCount();
    return changerAccountCount;
  }
}
