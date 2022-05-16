import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategyService } from './local.strategy.service';
import { JwtStrategyService } from './jwt.strategy.service';

import { JwtModule } from '@nestjs/jwt';
import { EmailNotiService } from 'src/common/utils/email/emailNoti.service';
import { AppConfigService } from 'src/config/config.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AdminAccount,
  AdminAccountSchema,
} from 'src/admin/common/entities/admin.entity';

import { AdminAccountService } from '../service/adminAccount.service';
import { AdminAccountRepository } from '../repository/adminAccount.repository';
import { Withdraw, WithdrawSchema } from '../../entities/withdraw.entity';
import { Account, AccountSchema } from '../../entities/account.entity';
import { UserActionService } from '../service/userAction.service';
import { UserActionRepository } from '../repository/userAction.repository';
import {
  ActionLog,
  ActionLogSchema,
} from '../common/entities/actionLog.entity';
import { AccountService } from '../service/account.service';
import { AccountRepository } from '../repository/account.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    MongooseModule.forFeature(
      [
        { name: Withdraw.name, schema: WithdrawSchema },
        { name: Account.name, schema: AccountSchema },
      ],
      process.env.REPL_MONGO_DB,
    ),

    MongooseModule.forFeature(
      [
        { name: AdminAccount.name, schema: AdminAccountSchema },
        { name: ActionLog.name, schema: ActionLogSchema },
      ],

      process.env.REPL_ADMIN_MONGO_DB,
    ),

    JwtModule.registerAsync({
      // useFactory: async (configService: AppConfigService) => ({
      useFactory: async () => ({
        secret: process.env.ADMIN_JWT_SECRET,
      }),
      inject: [AppConfigService],
    }),
  ],

  providers: [
    AuthService,
    LocalStrategyService,
    JwtStrategyService,
    AdminAccountService,
    AdminAccountRepository,
    AccountService,
    AccountRepository,
    UserActionService,
    UserActionRepository,
    EmailNotiService,
    AppConfigService,
  ],
})
export class AuthModule {}
