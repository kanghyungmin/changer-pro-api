import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorType } from '../../common/enums/errorType';
import { Account, AccountDocument } from '../../entities/account.entity';
import { Model } from 'mongoose';

export class AccountRepository {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<Account>,
  ) {}

  async getAccountById(id: string): Promise<AccountDocument | ErrorType> {
    let account: AccountDocument;
    try {
      account = await this.accountModel.findById({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    //User not found
    if (!account) {
      return ErrorType.E202_ACCOUNT_NOT_FOUND;
    }

    return account;
  }
}
