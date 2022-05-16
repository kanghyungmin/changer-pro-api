import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../entities/account.entity';
import {
  Announcement,
  AnnouncementSchema,
} from '../entities/announcement.entity';
import { ApiKey, ApiKeySchema } from '../entities/apiKey.entity';
import { Balance, BalanceSchema } from '../entities/balance.entity';
import { Contact, ContactSchema } from '../entities/contact.entity';
import { Currency, CurrencySchema } from '../entities/currency.entity';
import { Deposit, DepositSchema } from '../entities/deposit.entity';
import { Market, MarketSchema } from '../entities/market.entity';
import {
  Notification,
  NotificationSchema,
} from '../entities/notification.entity';
import { Trade, TradeSchema } from '../entities/trade.entity';
import {
  Transaction,
  TransactionSchema,
} from '../entities/transactions.entity';
import {
  WalletAddress,
  WalletAddressSchema,
} from '../entities/walletAddress.entity';
import { Withdraw, WithdrawSchema } from '../entities/withdraw.entity';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '../config/config.service';
import { AdminAccountService } from './service/adminAccount.service';
import { AccountService } from './service/account.service';
import { AdminAccountRepository } from './repository/adminAccount.repository';
import { AdminAccountController } from './controller/adminAccount.controller';
import { EmailNotiService } from '../common/utils/email/emailNoti.service';
import { ApiKeyController } from './controller/apiKey.controller';
import { ApiKeyService } from './service/apiKey.service';
import { ApiKeyRepository } from './repository/apiKey.repository';
import { BalanceService } from './service/balance.service';
import { BalanceRepository } from './repository/balance.repository';
import { BalanceController } from './controller/balance.controller';
import {
  AdminAccount,
  AdminAccountSchema,
} from './common/entities/admin.entity';
import { ActionLog, ActionLogSchema } from './common/entities/actionLog.entity';
import { UserActionService } from './service/userAction.service';
import { UserActionRepository } from './repository/userAction.repository';
import { WithdrawService } from './service/withdraw.service';
import { WithdrawRepository } from './repository/withdraw.repository';
import { WithdrawController } from './controller/withdraw.controller';
import { DepositController } from './controller/deposit.controller';
import { DepositService } from './service/deposit.service';
import { DepositRepository } from './repository/deposit.repository';
import { CurrencyController } from './controller/currency.controller';
import { CurrencyRepository } from './repository/currency.repository';
import { CurrencyService } from './service/currency.service';
import { ContactController } from './controller/contact.controller';
import { ContactService } from './service/contact.service';
import { ContactRepository } from './repository/contact.repository';
import { MarketService } from './service/market.service';
import { MarketRepository } from './repository/market.repository';
import { MarketController } from './controller/market.controller';
import { TradeController } from './controller/trade.controller';
import { TradeService } from './service/trade.service';
import { TradeRepository } from './repository/trade.repository';
import { TransactionController } from './controller/transaction.controller';
import { TransactionService } from './service/transaction.service';
import { TransactionRepository } from './repository/transaction.repository';
import { AnnouncementController } from './controller/announcement.controller';
import { AnnouncementService } from './service/announcement.service';
import { AnnouncementRepository } from './repository/announcement.repository';
import { AccountRepository } from './repository/account.repository';
import { UserActionController } from './controller/userAction.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Account.name, schema: AccountSchema },
        { name: Withdraw.name, schema: WithdrawSchema },
        { name: Notification.name, schema: NotificationSchema },
        { name: Announcement.name, schema: AnnouncementSchema },
        { name: Currency.name, schema: CurrencySchema },
        { name: Market.name, schema: MarketSchema },
        { name: Contact.name, schema: ContactSchema },
        { name: ApiKey.name, schema: ApiKeySchema },
        { name: Balance.name, schema: BalanceSchema },
        { name: Deposit.name, schema: DepositSchema },
        { name: Trade.name, schema: TradeSchema },
        { name: Transaction.name, schema: TransactionSchema },
        { name: WalletAddress.name, schema: WalletAddressSchema },
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
      useFactory: async () => ({
        secret: process.env.ADMIN_JWT_SECRET,
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [
    AdminAccountController,
    WithdrawController,
    DepositController,
    ApiKeyController,
    BalanceController,
    CurrencyController,
    ContactController,
    MarketController,
    TradeController,
    TransactionController,
    AnnouncementController,
    UserActionController,
  ],
  providers: [
    AdminAccountService,
    AdminAccountRepository,
    EmailNotiService,
    ApiKeyService,
    ApiKeyRepository,
    BalanceService,
    BalanceRepository,
    UserActionService,
    UserActionRepository,
    WithdrawService,
    WithdrawRepository,
    DepositService,
    DepositRepository,
    CurrencyService,
    CurrencyRepository,
    ContactService,
    ContactRepository,
    MarketService,
    MarketRepository,
    TradeService,
    TradeRepository,
    TransactionService,
    TransactionRepository,
    AnnouncementService,
    AnnouncementRepository,
    AccountService,
    AccountRepository,
  ],
  exports: [],
})
export class ApiModule {}
