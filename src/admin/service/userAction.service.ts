import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ADMINROLETYPE } from '../../common/enums/adminType';
import { QueryPaginate } from '../common/dto/common.dto';
import { ActionLogGetListResDto } from '../common/dto/userAction.dto';
import { ActionLogDocument } from '../common/entities/actionLog.entity';
import { AdminAccountDocument } from '../common/entities/admin.entity';
import { UserActionRepository } from '../repository/userAction.repository';

@Injectable()
export class UserActionService {
  constructor(
    private readonly actionLogRepo: UserActionRepository,

    @InjectConnection(process.env.REPL_ADMIN_MONGO_DB)
    private readonly mongoConnection: Connection,
  ) {}

  async writeLogToDB(
    account: AdminAccountDocument | null,
    log: string,
  ): Promise<boolean> {
    const res = this.actionLogRepo.writeLogToDB(account, log);
    return res;
  }
  async getLogsSvc(
    account: AdminAccountDocument,
    queryPaginate: QueryPaginate,
  ): Promise<ActionLogGetListResDto> {
    const isAdmin: boolean =
      account.type === ADMINROLETYPE.ADMIN ? true : false;

    const logs: ActionLogDocument[] = await this.actionLogRepo.getLogs(
      isAdmin,
      account.email,
      queryPaginate.start,
      queryPaginate.length,
    );

    const count = await this.actionLogRepo.getLogCount(isAdmin, account.email);

    const res: ActionLogGetListResDto = {
      logs,
      count,
    };

    return res;
  }
}
