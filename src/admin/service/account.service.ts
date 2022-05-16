import { Injectable } from '@nestjs/common';
import { CustomError } from '../../common/classes/error';

import { AccountDocument } from '../../entities/account.entity';
import { ErrorType } from '../common/enum/errorType';
import { AccountRepository } from '../repository/account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAccountById(id: string): Promise<AccountDocument> {
    const res = await this.accountRepository.getAccountById(id);

    if (res === ErrorType.E202_ACCOUNT_NOT_FOUND)
      throw new CustomError(ErrorType.E202_ACCOUNT_NOT_FOUND, 202);

    return res as AccountDocument;
  }
}
