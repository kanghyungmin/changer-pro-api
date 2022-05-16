import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AccountDocument } from 'src/entities/account.entity';

import { AccountService } from 'src/v1/service/account.service';
import { ErrorType } from '../enums/errorType';
import { AppConfigService } from 'src/config/config.service';
import { ApiKeyRepository } from 'src/v1/repository/apiKeys.repository';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private accountService: AccountService,
    private apiKeyService: ApiKeyRepository,
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
    let retVal: AccountDocument | null = null;
    let verifiedRes: AccountDocument = null;
    try {
      const decodeVal: string | { [key: string]: any } =
        this.jwtService.decode(token);
      if (typeof decodeVal !== 'string' && decodeVal.accessKey) {
        //API. 코드 개선 필요: 한 트랜잭션으로 묶어서 처리.
        //1) Secret Key 얻기
        const secretKey = await this.apiKeyService.findSecretKey(
          decodeVal.accessKey,
        );
        //2) Secret Key 검증
        verifiedRes = this.jwtService.verify(token, { secret: secretKey });
        retVal = await this.accountService.getAccountByAccessKey(
          decodeVal.accessKey,
        );
      } else {
        //token
        const secretKey = this.config.jwtSecret;
        verifiedRes = this.jwtService.verify(token, { secret: secretKey });
        retVal = await this.accountService.getAccountByEmail(verifiedRes.email);
      }
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
