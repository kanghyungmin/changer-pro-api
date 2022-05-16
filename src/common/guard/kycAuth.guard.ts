import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AccountService } from '../../v1/service/account.service';
import { KycState } from '../../common/enums/kycState';
import { ArgosService } from '../../providers/kyc/argos.service';

import { ErrorType } from '../enums/errorType';

@Injectable()
export class KycGuard implements CanActivate {
  private _context: ExecutionContext | null = null;

  constructor(
    private readonly accountService: AccountService,
    private readonly argosService: ArgosService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this._context = context;
    const res: boolean = await this.checkKYC();
    return res;
  }
  async checkKYC() {
    const req = this._context.switchToHttp().getRequest();
    const account = req.user;
    const kycState = account.kyc.state;

    if (!kycState || kycState == KycState.NotRequested) {
      throw new HttpException(
        {
          status: 'error',
          code: 226,
          message: ErrorType.E226_NEED_KYC,
        },
        HttpStatus.OK,
      );
    }

    switch (kycState) {
      case KycState.Approved:
        return true;
      case KycState.Rejected:
      case KycState.Pending:
        const kycResult = await this.argosService.getKycState(account.email);
        if (kycResult) {
          const kycData = kycResult.data;
          const kyc = kycResult.kyc;
          const kycResultStatus = kyc.result;
          const kycComment = kyc.comment;
          console.log('kycResultStatus', kycResultStatus);
          console.log('kycComment', kycComment);
          let kycStateVal = KycState.NotRequested;
          if (kycResultStatus == 'pending') {
            kycStateVal = KycState.Pending;
          } else if (kycResultStatus == 'approved') {
            kycStateVal = KycState.Approved;
          } else if (kycResultStatus == 'rejected') {
            kycStateVal = KycState.Rejected;
          }

          //update account and return updated account
          account.firstName = kycData.first_name;
          account.lastName = kycData.last_name;
          account.gender = kycData.gender;
          account.country = kycData.nationality;
          account.kyc = { state: kycStateVal, comment: kycComment };

          this.accountService.updateAccountService(account);

          //request argument에 Assign이 이루어지지 않음. 해당 코드는 Kyc Api에서 수행
          // this._context.getArgs()[0].user =
          //   await this.accountService.getAccountByEmail(account.email);
          return true;
        } else {
          throw new HttpException(
            {
              status: 'error',
              code: 227,
              message: ErrorType.E227_REGISTERD_KYC,
            },
            HttpStatus.OK,
          );
        }
    }
  }
  async getAccount() {
    const res = await this.accountService.getAccountByEmail('example@mail.com');
    console.log(res);
  }
}
