import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AdminAccountDocument } from 'src/admin/common/entities/admin.entity';
import { AppConfigService } from 'src/config/config.service';

import { AdminAccountService } from '../../service/adminAccount.service';
import { ErrorType } from '../../../common/enums/errorType';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private adminAccountService: AdminAccountService,

    private config: AppConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (authorization === undefined) {
      throw new HttpException(
        {
          status: 'error',
          code: 401,
          message: ErrorType.E401_UNAUTHRIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authorization.replace('Bearer ', '');
    const res = await this.validateToken(token);
    request.user = res;

    return true;
  }

  async validateToken(token: string) {
    let retVal: AdminAccountDocument | null = null;
    let verifiedRes: AdminAccountDocument = null;
    try {
      // const decodeVal: string | { [key: string]: any } =
      //   this.jwtService.decode(token);
      //token
      const secretKey = this.config.jwtSecret;
      verifiedRes = this.jwtService.verify(token, { secret: secretKey });
      retVal = await this.adminAccountService.getAccountByEmail(
        verifiedRes.email,
      );

      return retVal;
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          code: 401,
          message: ErrorType.E401_UNAUTHRIZED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
