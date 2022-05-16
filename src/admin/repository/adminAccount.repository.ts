import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { RegisterAccountDto } from '../common/dto/account.dto';
import { ErrorType } from '../../common/enums/errorType';
import {
  AdminAccount,
  AdminAccountDocument,
} from '../common/entities/admin.entity';
import { Account, AccountDocument } from '../../entities/account.entity';

export class AdminAccountRepository {
  constructor(
    @InjectModel(AdminAccount.name)
    private readonly accountModel: Model<AdminAccount>,

    @InjectModel(Account.name)
    private readonly changerAccountModel: Model<Account>,
  ) {}

  async registerAccount(
    registerAccountDto: RegisterAccountDto,
    sixDigit: string,
  ): Promise<AdminAccountDocument | ErrorType> {
    let account: AdminAccountDocument = new this.accountModel({
      email: registerAccountDto.email,
      password: registerAccountDto.password,
    });
    account.password = await account.encryptPassword(account.password);
    account.sixDigit = { val: sixDigit, createdAt: new Date() };
    account = await account.save();

    if (!account) {
      return ErrorType.E202_ACCOUNT_NOT_FOUND;
    }

    return account;
  }

  async updateAccountInfo(
    account: AdminAccountDocument,
    session?: ClientSession,
  ) {
    await this.accountModel
      .updateOne(
        { _id: account._id },
        {
          $set: {
            sixDigit: account.sixDigit,
            otp_verified: account.otp_verified,
            secret_for_otp: account.secret_for_otp,
            password: account.password,
            createdPassword: account.createdPassword,
            type: account.type,
            address: account.address,
            accessIP: account.accessIP,
            email_verified: account.email_verified,
          },
        },
      )
      .session(session);
  }
  async getAccountByEmail(email: string): Promise<AdminAccountDocument> {
    const account = await this.accountModel.findOne({ email });
    return account;
  }

  async getChangerAccountList(
    start: number,
    length: number,
  ): Promise<AccountDocument[]> {
    const accounts: AccountDocument[] = await this.changerAccountModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);
    return accounts;
  }
  async getChangerAccountCount(): Promise<number> {
    const totalCount = await this.changerAccountModel.countDocuments();
    return totalCount;
  }
}
