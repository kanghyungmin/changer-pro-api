import { Injectable } from '@nestjs/common';

import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { WithdrawRepository } from '../repository/withdraw.repository';
import { WithdrawDocument } from '../../entities/withdraw.entity';
import { CustomError } from '../../common/classes/error';
import { WithdrawState } from '../../common/enums/withdrawState';
import { WithdrawStatus } from '../../common/enums/withdrawStatus';
import { BalanceRepository } from '../repository/balance.repository';
import { EmailNotiService } from '../../common/utils/email/emailNoti.service';
import { EmailNotiType } from '../../common/utils/email/iNoti';
import { UserActionService } from './userAction.service';
import { AdminAccountDocument } from '../common/entities/admin.entity';

@Injectable()
export class WithdrawService {
  constructor(
    private actionLogService: UserActionService,
    private readonly withdrawRepository: WithdrawRepository,
    private readonly balanceRepository: BalanceRepository,
    private emailNotiService: EmailNotiService,

    @InjectConnection(process.env.REPL_MONGO_DB)
    private readonly mongoChangerConnection: Connection,
  ) {}

  async getChangerWithdrawListSvc(
    start: number,
    length: number,
  ): Promise<WithdrawDocument[]> {
    try {
      const withdrawals: WithdrawDocument[] =
        await this.withdrawRepository.getChangerWithdrawalList(start, length);

      return withdrawals;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getChangerWithdrawCount(): Promise<number> {
    const changerWithdrawalCount =
      await this.withdrawRepository.getChangerWithdrawCount();
    return changerWithdrawalCount;
  }

  async approveWithdrawSvc(
    account: AdminAccountDocument,
    id: string,
  ): Promise<boolean> {
    const session = await this.mongoChangerConnection.startSession();
    try {
      const res = await session.withTransaction(async () => {
        const withdraw: WithdrawDocument =
          await this.withdrawRepository.findWithdraw(id, session);

        if (
          withdraw.state !== WithdrawState.Done &&
          withdraw.status === WithdrawStatus.Requested
        ) {
          withdraw.status = WithdrawStatus.Processing;
          await this.withdrawRepository.updateWithdrawInfo(withdraw, session);

          this.actionLogService.writeLogToDB(
            account,
            `Approve ${withdraw.amount} ${withdraw.currency.name} withdrawal to ${withdraw.account.email}`,
          );

          return true;
        }
        return false;
      });

      return res;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.message, error.code);
      }
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }

  async rejectWithdrawSvc(
    account: AdminAccountDocument,
    id: string,
  ): Promise<boolean> {
    const session = await this.mongoChangerConnection.startSession();
    try {
      const res = await session.withTransaction(async () => {
        const withdraw: WithdrawDocument =
          await this.withdrawRepository.findWithdraw(id, session);

        if (
          withdraw.state !== WithdrawState.Done &&
          withdraw.status === WithdrawStatus.Requested
        ) {
          const totalAmount = withdraw.amount.plus(withdraw.fee);
          const balance = await this.balanceRepository.getBalanceWithCurrency(
            withdraw.account,
            withdraw.currency,
            session,
          );

          balance.available = balance.available.plus(totalAmount);
          balance.locked = balance.locked.minus(totalAmount);

          await this.balanceRepository.updateBalanceInfo(balance, session);

          withdraw.status = WithdrawStatus.Rejected;
          withdraw.state = WithdrawState.Done;

          await this.withdrawRepository.updateWithdrawInfo(withdraw, session);

          this.actionLogService.writeLogToDB(
            account,
            `Reject ${withdraw.amount} ${withdraw.currency.name} withdrawal to ${withdraw.account.email}`,
          );
          return true;
        } else {
          return false;
        }
      });
      return res;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.message, error.code);
      }
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }

  async registerTrxID(
    account: AdminAccountDocument,
    id: string,
    trxId: string,
  ): Promise<boolean> {
    const session = await this.mongoChangerConnection.startSession();
    try {
      const res = await session.withTransaction(async () => {
        const withdraw: WithdrawDocument =
          await this.withdrawRepository.findWithdraw(id, session);
        withdraw.trxId = trxId;
        this.withdrawRepository.updateWithdrawInfo(withdraw, session);

        const emailInfo = await this.emailNotiService.getWithdrawalInfo(id);
        const data = {
          email: emailInfo.email,
          currency: emailInfo.currency,
          amount: emailInfo.amount,
          address: withdraw.address,
          txid: withdraw.trxId,
        };

        this.emailNotiService.send(EmailNotiType.WITHDARW, data);

        this.actionLogService.writeLogToDB(
          account,
          `Register ${withdraw.trxId} for ${withdraw.amount} ${withdraw.currency.name} withdrawal to ${withdraw.account.email}`,
        );

        return true;
      });
      return res;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.message, error.code);
      }
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }
}
