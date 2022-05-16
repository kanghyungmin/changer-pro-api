import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { ErrorType } from '../enums/errorType';

@Injectable()
export class OtpAuth implements CanActivate {
  private _context: ExecutionContext | null = null;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this._context = context;
    const res: boolean = await this.authOPT();
    return res;
  }
  async authOPT() {
    const req = this._context.switchToHttp().getRequest();

    const account = req.user;
    const { token } = req.body;
    if (!token) {
      throw new HttpException(
        {
          status: 'error',
          code: 229,
          message: ErrorType.E229_NO_OTP_TOKEN,
        },
        HttpStatus.OK,
      );
    } else if (!account || !account.secret_for_otp) {
      throw new HttpException(
        {
          status: 'error',
          code: 206,
          message: ErrorType.E206_USER_NOT_HAVE_SECRET_OTP,
        },
        HttpStatus.OK,
      );
    } else if (!account.otp_verified) {
      throw new HttpException(
        {
          status: 'error',
          code: 1004,
          message: ErrorType.E1004_NO_VERIFIED_OTP_USER,
        },
        HttpStatus.OK,
      );
    } else {
      const verified = speakeasy.totp.verify({
        secret: account.secret_for_otp,
        encoding: 'base32',
        token: token,
      });
      if (verified) {
        return true;
      } else {
        throw new HttpException(
          {
            status: 'error',
            code: 228,
            message: ErrorType.E228_INVALID_OTP,
          },
          HttpStatus.OK,
        );
      }
    }
  }
}
