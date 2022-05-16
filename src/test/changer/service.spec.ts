import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import bignumber, { BigNumber } from 'bignumber.js';
import mongoose from 'mongoose';
import { CustomError } from '../../common/classes/error';
import { ErrorType } from '../../common/enums/errorType';
import { Side } from '../../common/enums/side';
import { TradeType } from '../../common/enums/trade';
import { EmailNotiService } from '../../common/utils/email/emailNoti.service';
import { AppConfigModule } from '../../config/config.module';

import {
  Account,
  AccountDocument,
  AccountSchema,
} from '../../entities/account.entity';
import { Balance, BalanceSchema } from '../../entities/balance.entity';
import { Currency, CurrencySchema } from '../../entities/currency.entity';
import { Market, MarketSchema } from '../../entities/market.entity';
import {
  Notification,
  NotificationSchema,
} from '../../entities/notification.entity';
import { Trade, TradeSchema } from '../../entities/trade.entity';
import {
  Transaction,
  TransactionSchema,
} from '../../entities/transactions.entity';
import { Withdraw, WithdrawSchema } from '../../entities/withdraw.entity';
import { DBconnectionMoudle } from '../../providers/database/connection.module';
import { DBconnectionService } from '../../providers/database/connection.service';
import { ChangerDataProviderService } from '../../providers/service/changerDataProvier.service';
import { AccountRepository } from '../../v1/repository/account.repository';
import { BalanceRepository } from '../../v1/repository/balance.repository';
import { ChangerRepository } from '../../v1/repository/changer.repository';
import { CurrencyRepository } from '../../v1/repository/currency.repository';
import { MarketRepository } from '../../v1/repository/market.repository';
import { BalanceService } from '../../v1/service/balance.service';
import { ChangerService } from '../../v1/service/changer.service';
import { CurrencyService } from '../../v1/service/currency.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ScheduleModule } from '@nestjs/schedule';

jest.setTimeout(30000);

describe('Changer Service', () => {
  let changerService: ChangerService;
  let marketRepository: MarketRepository;
  let balanceService: BalanceService;
  let accountRepository: AccountRepository;
  let dataProvider: ChangerDataProviderService;
  let account: AccountDocument;
  const accountMail = 'example@mail.com';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature(
          [
            { name: Account.name, schema: AccountSchema },
            { name: Currency.name, schema: CurrencySchema },
            { name: Trade.name, schema: TradeSchema },
            { name: Transaction.name, schema: TransactionSchema },
            { name: Notification.name, schema: NotificationSchema },
            { name: Market.name, schema: MarketSchema },
            { name: Balance.name, schema: BalanceSchema },
            { name: Withdraw.name, schema: WithdrawSchema },
          ],
          process.env.REPL_MONGO_DB,
        ),
        DBconnectionMoudle,
        AppConfigModule,
        ScheduleModule.forRoot(),
        MongooseModule.forRootAsync({
          connectionName: process.env.REPL_MONGO_DB,
          inject: [DBconnectionService],
          useFactory: async (ConfigService: DBconnectionService) =>
            ConfigService.getMongoConfig(),
        }),
        //Winston Module
        WinstonModule.forRoot({
          transports: [
            new winston.transports.DailyRotateFile({
              level: 'debug',
              datePattern: 'YYYY-MM-DD',
              filename: 'logs/application-%DATE%.log',
              zippedArchive: true,
              maxSize: '50m',
              maxFiles: '7d',
            }),

            //console transport. default level : info
            // new winston.transports.Console({
            //   format: winston.format.combine(
            //     winston.format.timestamp(),
            //     nestWinstonModuleUtilities.format.nestLike(),
            //   ),
            // }),
          ],
        }),
      ],
      providers: [
        ChangerService,
        ChangerRepository,
        AccountRepository,
        ChangerDataProviderService,
        CurrencyService,
        CurrencyRepository,
        MarketRepository,
        BalanceService,
        BalanceRepository,
        EmailNotiService,
        DBconnectionService,
      ],
    }).compile();

    changerService = module.get<ChangerService>(ChangerService);
    balanceService = module.get<BalanceService>(BalanceService);
    dataProvider = module.get<ChangerDataProviderService>(
      ChangerDataProviderService,
    );
    // changerRepository = module.get<ChangerRepository>(ChangerRepository);

    marketRepository = module.get<MarketRepository>(MarketRepository);
    accountRepository = module.get<AccountRepository>(AccountRepository);
    account = await accountRepository.getAccountByEmail(accountMail);
  });

  it('Invalid quote', async () => {
    dataProvider.getChangerQuote = jest.fn().mockImplementation(() => {
      throw new CustomError('ErrorType.E500_NO_QUOTE for BTC_USDT:BTC:1', 500);
    });

    try {
      await changerService.trade(
        account,
        {
          ticker: 'BTC_USDT',
          quantity: '1',
          action: Side.Buy,
        },
        TradeType.Trade,
      );
    } catch (error) {
      expect(error.message).toBe('ErrorType.E500_NO_QUOTE for BTC_USDT:BTC:1');
    }
  });
  it('Exceed the max credit', async () => {
    //데이터 provider
    dataProvider.getChangerQuote = jest.fn().mockResolvedValue({
      quoteData: {
        ticker: 'BTC_USDT',
        currency: 'BTC',
        buy: {
          quantity: '1',
          price: '40173.22',
          amount: 40169.2,
        },
        sell: {
          quantity: '1',
          price: '40060.99',
          amount: 40065,
        },
      },
    });
    balanceService.getAllBalanceTotalAssetAndDept = jest
      .fn()
      .mockResolvedValue([new bignumber(10), new bignumber(11)]); //plus asset, minus asset

    try {
      await changerService.trade(
        account,
        {
          ticker: 'BTC_USDT',
          quantity: '1',
          action: Side.Buy,
        },
        TradeType.Trade,
      );
    } catch (error) {
      console.log(error);
      expect(error.message).toBe(ErrorType.E501_CREDIT_INVALID);
    }
  });
  it('liquidation - Case #1', async () => {
    marketRepository.getMarkets = jest
      .fn()
      .mockResolvedValue([
        'BAT_BTC',
        'BAT_EUSD',
        'BCH_BTC',
        'BCH_EUSD',
        'BCH_USDT',
        'BSV_BTC',
        'BSV_EUSD',
        'BSV_USDT',
        'BTC_EUSD',
        'BTC_USDT',
        'EOS_BTC',
        'EOS_EUSD',
        'EOS_USDT',
        'ETH_BTC',
        'ETH_EUSD',
        'ETH_USDT',
        'LTC_BTC',
        'LTC_ETH',
        'LTC_EUSD',
        'LTC_USDT',
        'USDC_EUSD',
        'XTZ_BTC',
        'XTZ_EUSD',
        'XTZ_USDT',
        'XRP_USDT',
        'DOT_BTC',
        'DOT_EUSD',
        'DOT_USDT',
        'XRP_BTC',
        'XLM_BTC',
        'XRP_EUSD',
        'XLM_USDT',
        'LINK_EUSD',
        'XLM_EUSD',
        'EUSD_ECAD',
        'EUSD_ECHF',
        'EUSD_ECNH',
        'EUSD_ECZK',
        'EUSD_EDKK',
        'EUSD_EHKD',
        'EUSD_EHUF',
        'EUSD_EILS',
        'EUSD_EJPY',
        'EUSD_EMXN',
        'EUSD_ENOK',
        'EUSD_EPLN',
        'EUSD_ERUB',
      ]);

    dataProvider.getUsdtTickers = jest.fn().mockResolvedValue([
      {
        ticker: 'BAT_USD',
        currency: 'USD',
        buy: { price: '0.7360', quantity: '', amount: '' },
        sell: { price: '0.7220', quantity: '', amount: '' },
      },
      {
        ticker: 'BCH_USDT',
        currency: 'USDT',
        buy: { price: '315.1203', quantity: '', amount: '' },
        sell: { price: '314.9996', quantity: '', amount: '' },
      },
      {
        ticker: 'BTC_USDT',
        currency: 'USDT',
        buy: { price: '38981.9287', quantity: '', amount: '' },
        sell: { price: '38971.8987', quantity: '', amount: '' },
      },
      {
        ticker: 'EOS_USDT',
        currency: 'USDT',
        buy: { price: '2.3331', quantity: '', amount: '' },
        sell: { price: '2.3324', quantity: '', amount: '' },
      },
      {
        ticker: 'ETH_USDT',
        currency: 'USDT',
        buy: { price: '2912.9013', quantity: '', amount: '' },
        sell: { price: '2911.9987', quantity: '', amount: '' },
      },
      {
        ticker: 'LTC_USDT',
        currency: 'USDT',
        buy: { price: '105.7800', quantity: '', amount: '' },
        sell: { price: '105.7298', quantity: '', amount: '' },
      },
      {
        ticker: 'USDC_USD',
        currency: 'USD',
        buy: { price: '1.0002', quantity: '', amount: '' },
        sell: { price: '0.9997', quantity: '', amount: '' },
      },
      {
        ticker: 'XTZ_USDT',
        currency: 'USDT',
        buy: { price: '3.0308', quantity: '', amount: '' },
        sell: { price: '3.0011', quantity: '', amount: '' },
      },
      {
        ticker: 'LTC_USD',
        currency: 'USD',
        buy: { price: '105.8100', quantity: '', amount: '' },
        sell: { price: '105.7700', quantity: '', amount: '' },
      },
      {
        ticker: 'BCH_USD',
        currency: 'USD',
        buy: { price: '315.2200', quantity: '', amount: '' },
        sell: { price: '315.1000', quantity: '', amount: '' },
      },
      {
        ticker: 'BTC_USD',
        currency: 'USD',
        buy: { price: '38994.0000', quantity: '', amount: '' },
        sell: { price: '38984.0000', quantity: '', amount: '' },
      },
      {
        ticker: 'ETH_USD',
        currency: 'USD',
        buy: { price: '2913.7000', quantity: '', amount: '' },
        sell: { price: '2912.8000', quantity: '', amount: '' },
      },
      {
        ticker: 'XRP_USDT',
        currency: 'USDT',
        buy: { price: '0.7394', quantity: '', amount: '' },
        sell: { price: '0.7393', quantity: '', amount: '' },
      },
      {
        ticker: 'DOT_USD',
        currency: 'USD',
        buy: { price: '17.3820', quantity: '', amount: '' },
        sell: { price: '17.3770', quantity: '', amount: '' },
      },
      {
        ticker: 'DOT_USDT',
        currency: 'USDT',
        buy: { price: '17.3770', quantity: '', amount: '' },
        sell: { price: '17.3720', quantity: '', amount: '' },
      },
      {
        ticker: 'XRP_USD',
        currency: 'USD',
        buy: { price: '0.7397', quantity: '', amount: '' },
        sell: { price: '0.7395', quantity: '', amount: '' },
      },
      {
        ticker: 'EOS_USD',
        currency: 'USD',
        buy: { price: '2.3338', quantity: '', amount: '' },
        sell: { price: '2.3332', quantity: '', amount: '' },
      },
      {
        ticker: 'XLM_USDT',
        currency: 'USDT',
        buy: { price: '0.1919', quantity: '', amount: '' },
        sell: { price: '0.1918', quantity: '', amount: '' },
      },
      {
        ticker: 'LINK_USD',
        currency: 'USD',
        buy: { price: '13.2810', quantity: '', amount: '' },
        sell: { price: '13.2770', quantity: '', amount: '' },
      },
      {
        ticker: 'XLM_USD',
        currency: 'USD',
        buy: { price: '0.1919', quantity: '', amount: '' },
        sell: { price: '0.1919', quantity: '', amount: '' },
      },
      {
        ticker: 'USD_USDT',
        currency: 'USDT',
        buy: { price: '1', quantity: '', amount: '' },
        sell: { price: '1', quantity: '', amount: '' },
      },
    ]);

    const wait = (timeToDelay) =>
      new Promise((resolve) => setTimeout(resolve, timeToDelay));
    await wait(5000);

    balanceService.getAllBalanceTotalAssetAndDept = jest
      .fn()
      .mockResolvedValue([
        new bignumber(3667.00966926),
        new bignumber(-3334.348213513),
        [
          { available: '3', convertedUsdtPrice: '327.165', currency: 'LTC' },
          {
            available: '0.08407201',
            convertedUsdtPrice: '3339.84466926',
            currency: 'BTC',
          },
          {
            available: '-3334.348213513',
            convertedUsdtPrice: '-3334.348213513',
            currency: 'USDT',
          },
        ],
      ]);

    changerService.trades = jest.fn().mockResolvedValue(true);

    try {
      await changerService.doLiquidationOrSettlement(
        account,
        TradeType.Liquidation,
      );
    } catch (error) {
      console.log(error);
      expect(error.message).toBe(ErrorType.E501_CREDIT_INVALID);
    }
  });
  it('liquidation - Case #2', async () => {
    //code
    marketRepository.getMarkets = jest
      .fn()
      .mockResolvedValue([
        'BAT_BTC',
        'BAT_EUSD',
        'BCH_BTC',
        'BCH_EUSD',
        'BCH_USDT',
        'BSV_BTC',
        'BSV_EUSD',
        'BSV_USDT',
        'BTC_EUSD',
        'BTC_USDT',
        'EOS_BTC',
        'EOS_EUSD',
        'EOS_USDT',
        'ETH_BTC',
        'ETH_EUSD',
        'ETH_USDT',
        'LTC_BTC',
        'LTC_ETH',
        'LTC_EUSD',
        'LTC_USDT',
        'USDC_EUSD',
        'XTZ_BTC',
        'XTZ_EUSD',
        'XTZ_USDT',
        'XRP_USDT',
        'DOT_BTC',
        'DOT_EUSD',
        'DOT_USDT',
        'XRP_BTC',
        'XLM_BTC',
        'XRP_EUSD',
        'XLM_USDT',
        'LINK_EUSD',
        'XLM_EUSD',
        'EUSD_ECAD',
        'EUSD_ECHF',
        'EUSD_ECNH',
        'EUSD_ECZK',
        'EUSD_EDKK',
        'EUSD_EHKD',
        'EUSD_EHUF',
        'EUSD_EILS',
        'EUSD_EJPY',
        'EUSD_EMXN',
        'EUSD_ENOK',
        'EUSD_EPLN',
        'EUSD_ERUB',
      ]);

    dataProvider.getUsdtTickers = jest.fn().mockResolvedValue([
      {
        ticker: 'BAT_USD',
        currency: 'USD',
        buy: { price: '0.7360', quantity: '', amount: '' },
        sell: { price: '0.7220', quantity: '', amount: '' },
      },
      {
        ticker: 'BCH_USDT',
        currency: 'USDT',
        buy: { price: '315.1203', quantity: '', amount: '' },
        sell: { price: '314.9996', quantity: '', amount: '' },
      },
      {
        ticker: 'BTC_USDT',
        currency: 'USDT',
        buy: { price: '38981.9287', quantity: '', amount: '' },
        sell: { price: '38971.8987', quantity: '', amount: '' },
      },
      {
        ticker: 'EOS_USDT',
        currency: 'USDT',
        buy: { price: '2.3331', quantity: '', amount: '' },
        sell: { price: '2.3324', quantity: '', amount: '' },
      },
      {
        ticker: 'ETH_USDT',
        currency: 'USDT',
        buy: { price: '2912.9013', quantity: '', amount: '' },
        sell: { price: '2911.9987', quantity: '', amount: '' },
      },
      {
        ticker: 'LTC_USDT',
        currency: 'USDT',
        buy: { price: '105.7800', quantity: '', amount: '' },
        sell: { price: '105.7298', quantity: '', amount: '' },
      },
      {
        ticker: 'USDC_USD',
        currency: 'USD',
        buy: { price: '1.0002', quantity: '', amount: '' },
        sell: { price: '0.9997', quantity: '', amount: '' },
      },
      {
        ticker: 'XTZ_USDT',
        currency: 'USDT',
        buy: { price: '3.0308', quantity: '', amount: '' },
        sell: { price: '3.0011', quantity: '', amount: '' },
      },
      {
        ticker: 'LTC_USD',
        currency: 'USD',
        buy: { price: '105.8100', quantity: '', amount: '' },
        sell: { price: '105.7700', quantity: '', amount: '' },
      },
      {
        ticker: 'BCH_USD',
        currency: 'USD',
        buy: { price: '315.2200', quantity: '', amount: '' },
        sell: { price: '315.1000', quantity: '', amount: '' },
      },
      {
        ticker: 'BTC_USD',
        currency: 'USD',
        buy: { price: '38994.0000', quantity: '', amount: '' },
        sell: { price: '38984.0000', quantity: '', amount: '' },
      },
      {
        ticker: 'ETH_USD',
        currency: 'USD',
        buy: { price: '2913.7000', quantity: '', amount: '' },
        sell: { price: '2912.8000', quantity: '', amount: '' },
      },
      {
        ticker: 'XRP_USDT',
        currency: 'USDT',
        buy: { price: '0.7394', quantity: '', amount: '' },
        sell: { price: '0.7393', quantity: '', amount: '' },
      },
      {
        ticker: 'DOT_USD',
        currency: 'USD',
        buy: { price: '17.3820', quantity: '', amount: '' },
        sell: { price: '17.3770', quantity: '', amount: '' },
      },
      {
        ticker: 'DOT_USDT',
        currency: 'USDT',
        buy: { price: '17.3770', quantity: '', amount: '' },
        sell: { price: '17.3720', quantity: '', amount: '' },
      },
      {
        ticker: 'XRP_USD',
        currency: 'USD',
        buy: { price: '0.7397', quantity: '', amount: '' },
        sell: { price: '0.7395', quantity: '', amount: '' },
      },
      {
        ticker: 'EOS_USD',
        currency: 'USD',
        buy: { price: '2.3338', quantity: '', amount: '' },
        sell: { price: '2.3332', quantity: '', amount: '' },
      },
      {
        ticker: 'XLM_USDT',
        currency: 'USDT',
        buy: { price: '0.1919', quantity: '', amount: '' },
        sell: { price: '0.1918', quantity: '', amount: '' },
      },
      {
        ticker: 'LINK_USD',
        currency: 'USD',
        buy: { price: '13.2810', quantity: '', amount: '' },
        sell: { price: '13.2770', quantity: '', amount: '' },
      },
      {
        ticker: 'XLM_USD',
        currency: 'USD',
        buy: { price: '0.1919', quantity: '', amount: '' },
        sell: { price: '0.1919', quantity: '', amount: '' },
      },
      {
        ticker: 'USD_USDT',
        currency: 'USDT',
        buy: { price: '1', quantity: '', amount: '' },
        sell: { price: '1', quantity: '', amount: '' },
      },
    ]);

    const wait = (timeToDelay) =>
      new Promise((resolve) => setTimeout(resolve, timeToDelay));
    await wait(5000);

    balanceService.getAllBalanceTotalAssetAndDept = jest
      .fn()
      .mockResolvedValue([
        new bignumber(3667.00966926),
        new bignumber(-3334.348213513),

        [
          {
            available: '-0.08407201',
            convertedUsdtPrice: '-3334.348213513',
            currency: 'BTC',
          },
          {
            available: '3667.00966926',
            convertedUsdtPrice: '3667.00966926',
            currency: 'USDT',
          },
        ],
      ]);

    changerService.trades = jest.fn().mockResolvedValue(true);

    try {
      await changerService.doLiquidationOrSettlement(
        account,
        TradeType.Liquidation,
      );
    } catch (error) {
      console.log(error);
      expect(error.message).toBe(ErrorType.E501_CREDIT_INVALID);
    }
    //code
  });
  it('liquidation - Available is bigger than 0', async () => {
    marketRepository.getMarkets = jest
      .fn()
      .mockResolvedValue([
        'BAT_BTC',
        'BAT_EUSD',
        'BCH_BTC',
        'BCH_EUSD',
        'BCH_USDT',
        'BSV_BTC',
        'BSV_EUSD',
        'BSV_USDT',
        'BTC_EUSD',
        'BTC_USDT',
        'EOS_BTC',
        'EOS_EUSD',
        'EOS_USDT',
        'ETH_BTC',
        'ETH_EUSD',
        'ETH_USDT',
        'LTC_BTC',
        'LTC_ETH',
        'LTC_EUSD',
        'LTC_USDT',
        'USDC_EUSD',
        'XTZ_BTC',
        'XTZ_EUSD',
        'XTZ_USDT',
        'XRP_USDT',
        'DOT_BTC',
        'DOT_EUSD',
        'DOT_USDT',
        'XRP_BTC',
        'XLM_BTC',
        'XRP_EUSD',
        'XLM_USDT',
        'LINK_EUSD',
        'XLM_EUSD',
        'EUSD_ECAD',
        'EUSD_ECHF',
        'EUSD_ECNH',
        'EUSD_ECZK',
        'EUSD_EDKK',
        'EUSD_EHKD',
        'EUSD_EHUF',
        'EUSD_EILS',
        'EUSD_EJPY',
        'EUSD_EMXN',
        'EUSD_ENOK',
        'EUSD_EPLN',
        'EUSD_ERUB',
      ]);

    dataProvider.getUsdtTickers = jest.fn().mockResolvedValue([
      {
        ticker: 'BAT_USD',
        currency: 'USD',
        buy: { price: '0.7360', quantity: '', amount: '' },
        sell: { price: '0.7220', quantity: '', amount: '' },
      },
      {
        ticker: 'BCH_USDT',
        currency: 'USDT',
        buy: { price: '315.1203', quantity: '', amount: '' },
        sell: { price: '314.9996', quantity: '', amount: '' },
      },
      {
        ticker: 'BTC_USDT',
        currency: 'USDT',
        buy: { price: '38981.9287', quantity: '', amount: '' },
        sell: { price: '38971.8987', quantity: '', amount: '' },
      },
      {
        ticker: 'EOS_USDT',
        currency: 'USDT',
        buy: { price: '2.3331', quantity: '', amount: '' },
        sell: { price: '2.3324', quantity: '', amount: '' },
      },
      {
        ticker: 'ETH_USDT',
        currency: 'USDT',
        buy: { price: '2912.9013', quantity: '', amount: '' },
        sell: { price: '2911.9987', quantity: '', amount: '' },
      },
      {
        ticker: 'LTC_USDT',
        currency: 'USDT',
        buy: { price: '105.7800', quantity: '', amount: '' },
        sell: { price: '105.7298', quantity: '', amount: '' },
      },
      {
        ticker: 'USDC_USD',
        currency: 'USD',
        buy: { price: '1.0002', quantity: '', amount: '' },
        sell: { price: '0.9997', quantity: '', amount: '' },
      },
      {
        ticker: 'XTZ_USDT',
        currency: 'USDT',
        buy: { price: '3.0308', quantity: '', amount: '' },
        sell: { price: '3.0011', quantity: '', amount: '' },
      },
      {
        ticker: 'LTC_USD',
        currency: 'USD',
        buy: { price: '105.8100', quantity: '', amount: '' },
        sell: { price: '105.7700', quantity: '', amount: '' },
      },
      {
        ticker: 'BCH_USD',
        currency: 'USD',
        buy: { price: '315.2200', quantity: '', amount: '' },
        sell: { price: '315.1000', quantity: '', amount: '' },
      },
      {
        ticker: 'BTC_USD',
        currency: 'USD',
        buy: { price: '38994.0000', quantity: '', amount: '' },
        sell: { price: '38984.0000', quantity: '', amount: '' },
      },
      {
        ticker: 'ETH_USD',
        currency: 'USD',
        buy: { price: '2913.7000', quantity: '', amount: '' },
        sell: { price: '2912.8000', quantity: '', amount: '' },
      },
      {
        ticker: 'XRP_USDT',
        currency: 'USDT',
        buy: { price: '0.7394', quantity: '', amount: '' },
        sell: { price: '0.7393', quantity: '', amount: '' },
      },
      {
        ticker: 'DOT_USD',
        currency: 'USD',
        buy: { price: '17.3820', quantity: '', amount: '' },
        sell: { price: '17.3770', quantity: '', amount: '' },
      },
      {
        ticker: 'DOT_USDT',
        currency: 'USDT',
        buy: { price: '17.3770', quantity: '', amount: '' },
        sell: { price: '17.3720', quantity: '', amount: '' },
      },
      {
        ticker: 'XRP_USD',
        currency: 'USD',
        buy: { price: '0.7397', quantity: '', amount: '' },
        sell: { price: '0.7395', quantity: '', amount: '' },
      },
      {
        ticker: 'EOS_USD',
        currency: 'USD',
        buy: { price: '2.3338', quantity: '', amount: '' },
        sell: { price: '2.3332', quantity: '', amount: '' },
      },
      {
        ticker: 'XLM_USDT',
        currency: 'USDT',
        buy: { price: '0.1919', quantity: '', amount: '' },
        sell: { price: '0.1918', quantity: '', amount: '' },
      },
      {
        ticker: 'LINK_USD',
        currency: 'USD',
        buy: { price: '13.2810', quantity: '', amount: '' },
        sell: { price: '13.2770', quantity: '', amount: '' },
      },
      {
        ticker: 'XLM_USD',
        currency: 'USD',
        buy: { price: '0.1919', quantity: '', amount: '' },
        sell: { price: '0.1919', quantity: '', amount: '' },
      },
      {
        ticker: 'USD_USDT',
        currency: 'USDT',
        buy: { price: '1', quantity: '', amount: '' },
        sell: { price: '1', quantity: '', amount: '' },
      },
    ]);

    //데이터
    balanceService.getAllBalanceTotalAssetAndDept = jest
      .fn()
      .mockResolvedValue([
        new bignumber(3776.06466926),
        new bignumber(-3334.348213513),
        [
          { available: '4', convertedUsdtPrice: '436.22', currency: 'LTC' },
          {
            available: '0.08407201',
            convertedUsdtPrice: '3339.84466926',
            currency: 'BTC',
          },
          {
            available: '-3334.348213513',
            convertedUsdtPrice: '-3334.348213513',
            currency: 'USDT',
          },
        ],
      ]);

    try {
      const res = await changerService.doLiquidationOrSettlement(
        account,
        TradeType.Liquidation,
      );
      expect(res).toEqual(false);
    } catch (error) {
      console.log(error);
      expect(error.message).toBe(ErrorType.E501_CREDIT_INVALID);
    }
  });
  it('liquidation - Multiple trades became one trade', async () => {
    marketRepository.getMarkets = jest
      .fn()
      .mockResolvedValue([
        'BAT_BTC',
        'BAT_EUSD',
        'BCH_BTC',
        'BCH_EUSD',
        'BCH_USDT',
        'BSV_BTC',
        'BSV_EUSD',
        'BSV_USDT',
        'BTC_EUSD',
        'BTC_USDT',
        'EOS_BTC',
        'EOS_EUSD',
        'EOS_USDT',
        'ETH_BTC',
        'ETH_EUSD',
        'ETH_USDT',
        'LTC_BTC',
        'LTC_ETH',
        'LTC_EUSD',
        'LTC_USDT',
        'USDC_EUSD',
        'XTZ_BTC',
        'XTZ_EUSD',
        'XTZ_USDT',
        'XRP_USDT',
        'DOT_BTC',
        'DOT_EUSD',
        'DOT_USDT',
        'XRP_BTC',
        'XLM_BTC',
        'XRP_EUSD',
        'XLM_USDT',
        'LINK_EUSD',
        'XLM_EUSD',
        'EUSD_ECAD',
        'EUSD_ECHF',
        'EUSD_ECNH',
        'EUSD_ECZK',
        'EUSD_EDKK',
        'EUSD_EHKD',
        'EUSD_EHUF',
        'EUSD_EILS',
        'EUSD_EJPY',
        'EUSD_EMXN',
        'EUSD_ENOK',
        'EUSD_EPLN',
        'EUSD_ERUB',
      ]);

    dataProvider.getUsdtTickers = jest.fn().mockResolvedValue([
      {
        ticker: 'BAT_USD',
        currency: 'USD',
        buy: { price: '0.7360', quantity: '', amount: '' },
        sell: { price: '0.7220', quantity: '', amount: '' },
      },
      {
        ticker: 'BCH_USDT',
        currency: 'USDT',
        buy: { price: '315.1203', quantity: '', amount: '' },
        sell: { price: '314.9996', quantity: '', amount: '' },
      },
      {
        ticker: 'BTC_USDT',
        currency: 'USDT',
        buy: { price: '38981.9287', quantity: '', amount: '' },
        sell: { price: '38971.8987', quantity: '', amount: '' },
      },
      {
        ticker: 'EOS_USDT',
        currency: 'USDT',
        buy: { price: '2.3331', quantity: '', amount: '' },
        sell: { price: '2.3324', quantity: '', amount: '' },
      },
      {
        ticker: 'ETH_USDT',
        currency: 'USDT',
        buy: { price: '2912.9013', quantity: '', amount: '' },
        sell: { price: '2911.9987', quantity: '', amount: '' },
      },
      {
        ticker: 'LTC_USDT',
        currency: 'USDT',
        buy: { price: '105.7800', quantity: '', amount: '' },
        sell: { price: '105.7298', quantity: '', amount: '' },
      },
      {
        ticker: 'USDC_USD',
        currency: 'USD',
        buy: { price: '1.0002', quantity: '', amount: '' },
        sell: { price: '0.9997', quantity: '', amount: '' },
      },
      {
        ticker: 'XTZ_USDT',
        currency: 'USDT',
        buy: { price: '3.0308', quantity: '', amount: '' },
        sell: { price: '3.0011', quantity: '', amount: '' },
      },
      {
        ticker: 'LTC_USD',
        currency: 'USD',
        buy: { price: '105.8100', quantity: '', amount: '' },
        sell: { price: '105.7700', quantity: '', amount: '' },
      },
      {
        ticker: 'BCH_USD',
        currency: 'USD',
        buy: { price: '315.2200', quantity: '', amount: '' },
        sell: { price: '315.1000', quantity: '', amount: '' },
      },
      {
        ticker: 'BTC_USD',
        currency: 'USD',
        buy: { price: '38994.0000', quantity: '', amount: '' },
        sell: { price: '38984.0000', quantity: '', amount: '' },
      },
      {
        ticker: 'ETH_USD',
        currency: 'USD',
        buy: { price: '2913.7000', quantity: '', amount: '' },
        sell: { price: '2912.8000', quantity: '', amount: '' },
      },
      {
        ticker: 'XRP_USDT',
        currency: 'USDT',
        buy: { price: '0.7394', quantity: '', amount: '' },
        sell: { price: '0.7393', quantity: '', amount: '' },
      },
      {
        ticker: 'DOT_USD',
        currency: 'USD',
        buy: { price: '17.3820', quantity: '', amount: '' },
        sell: { price: '17.3770', quantity: '', amount: '' },
      },
      {
        ticker: 'DOT_USDT',
        currency: 'USDT',
        buy: { price: '17.3770', quantity: '', amount: '' },
        sell: { price: '17.3720', quantity: '', amount: '' },
      },
      {
        ticker: 'XRP_USD',
        currency: 'USD',
        buy: { price: '0.7397', quantity: '', amount: '' },
        sell: { price: '0.7395', quantity: '', amount: '' },
      },
      {
        ticker: 'EOS_USD',
        currency: 'USD',
        buy: { price: '2.3338', quantity: '', amount: '' },
        sell: { price: '2.3332', quantity: '', amount: '' },
      },
      {
        ticker: 'XLM_USDT',
        currency: 'USDT',
        buy: { price: '0.1919', quantity: '', amount: '' },
        sell: { price: '0.1918', quantity: '', amount: '' },
      },
      {
        ticker: 'LINK_USD',
        currency: 'USD',
        buy: { price: '13.2810', quantity: '', amount: '' },
        sell: { price: '13.2770', quantity: '', amount: '' },
      },
      {
        ticker: 'XLM_USD',
        currency: 'USD',
        buy: { price: '0.1919', quantity: '', amount: '' },
        sell: { price: '0.1919', quantity: '', amount: '' },
      },
      {
        ticker: 'USD_USDT',
        currency: 'USDT',
        buy: { price: '1', quantity: '', amount: '' },
        sell: { price: '1', quantity: '', amount: '' },
      },
    ]);

    process.env.MockMakeTradeItem = 'Yes';

    changerService.makeTradeItem = jest.fn().mockReturnValue([
      {
        action: 'BUY',
        ticker: 'BTC_USDT',
        quantity: '0.00018982',
        amount: '7.73365604',
        currency: 'BTC',
        usdtAmount: new BigNumber(7.733656043),
      },
      {
        action: 'BUY',
        ticker: 'BTC_USDT',
        quantity: '0.00018982',
        amount: '7.73365604',
        currency: 'BTC',
        usdtAmount: new BigNumber(7.733656043),
      },
    ]);

    //데이터
    balanceService.getAllBalanceTotalAssetAndDept = jest
      .fn()
      .mockResolvedValue([
        new bignumber(3667.00966926),
        new bignumber(-3334.348213513),

        [
          {
            available: '-0.08407201',
            convertedUsdtPrice: '-3334.348213513',
            currency: 'BTC',
          },
          {
            available: '3667.00966926',
            convertedUsdtPrice: '3667.00966926',
            currency: 'USDT',
          },
        ],
      ]);

    changerService.trades = jest.fn().mockResolvedValue(true);
    try {
      const res = await changerService.doLiquidationOrSettlement(
        account,
        TradeType.Liquidation,
      );
      expect(res).toEqual(true);
    } catch (error) {
      console.log(error);
      expect(error.message).toBe(ErrorType.E501_CREDIT_INVALID);
    }
  });
  it('liquidation - 1usdt does not trade', async () => {
    marketRepository.getMarkets = jest
      .fn()
      .mockResolvedValue([
        'BAT_BTC',
        'BAT_EUSD',
        'BCH_BTC',
        'BCH_EUSD',
        'BCH_USDT',
        'BSV_BTC',
        'BSV_EUSD',
        'BSV_USDT',
        'BTC_EUSD',
        'BTC_USDT',
        'EOS_BTC',
        'EOS_EUSD',
        'EOS_USDT',
        'ETH_BTC',
        'ETH_EUSD',
        'ETH_USDT',
        'LTC_BTC',
        'LTC_ETH',
        'LTC_EUSD',
        'LTC_USDT',
        'USDC_EUSD',
        'XTZ_BTC',
        'XTZ_EUSD',
        'XTZ_USDT',
        'XRP_USDT',
        'DOT_BTC',
        'DOT_EUSD',
        'DOT_USDT',
        'XRP_BTC',
        'XLM_BTC',
        'XRP_EUSD',
        'XLM_USDT',
        'LINK_EUSD',
        'XLM_EUSD',
        'EUSD_ECAD',
        'EUSD_ECHF',
        'EUSD_ECNH',
        'EUSD_ECZK',
        'EUSD_EDKK',
        'EUSD_EHKD',
        'EUSD_EHUF',
        'EUSD_EILS',
        'EUSD_EJPY',
        'EUSD_EMXN',
        'EUSD_ENOK',
        'EUSD_EPLN',
        'EUSD_ERUB',
      ]);

    dataProvider.getUsdtTickers = jest.fn().mockResolvedValue([
      {
        ticker: 'BAT_USD',
        currency: 'USD',
        buy: { price: '0.7360', quantity: '', amount: '' },
        sell: { price: '0.7220', quantity: '', amount: '' },
      },
      {
        ticker: 'BCH_USDT',
        currency: 'USDT',
        buy: { price: '315.1203', quantity: '', amount: '' },
        sell: { price: '314.9996', quantity: '', amount: '' },
      },
      {
        ticker: 'BTC_USDT',
        currency: 'USDT',
        buy: { price: '38981.9287', quantity: '', amount: '' },
        sell: { price: '38971.8987', quantity: '', amount: '' },
      },
      {
        ticker: 'EOS_USDT',
        currency: 'USDT',
        buy: { price: '2.3331', quantity: '', amount: '' },
        sell: { price: '2.3324', quantity: '', amount: '' },
      },
      {
        ticker: 'ETH_USDT',
        currency: 'USDT',
        buy: { price: '2912.9013', quantity: '', amount: '' },
        sell: { price: '2911.9987', quantity: '', amount: '' },
      },
      {
        ticker: 'LTC_USDT',
        currency: 'USDT',
        buy: { price: '105.7800', quantity: '', amount: '' },
        sell: { price: '105.7298', quantity: '', amount: '' },
      },
      {
        ticker: 'USDC_USD',
        currency: 'USD',
        buy: { price: '1.0002', quantity: '', amount: '' },
        sell: { price: '0.9997', quantity: '', amount: '' },
      },
      {
        ticker: 'XTZ_USDT',
        currency: 'USDT',
        buy: { price: '3.0308', quantity: '', amount: '' },
        sell: { price: '3.0011', quantity: '', amount: '' },
      },
      {
        ticker: 'LTC_USD',
        currency: 'USD',
        buy: { price: '105.8100', quantity: '', amount: '' },
        sell: { price: '105.7700', quantity: '', amount: '' },
      },
      {
        ticker: 'BCH_USD',
        currency: 'USD',
        buy: { price: '315.2200', quantity: '', amount: '' },
        sell: { price: '315.1000', quantity: '', amount: '' },
      },
      {
        ticker: 'BTC_USD',
        currency: 'USD',
        buy: { price: '38994.0000', quantity: '', amount: '' },
        sell: { price: '38984.0000', quantity: '', amount: '' },
      },
      {
        ticker: 'ETH_USD',
        currency: 'USD',
        buy: { price: '2913.7000', quantity: '', amount: '' },
        sell: { price: '2912.8000', quantity: '', amount: '' },
      },
      {
        ticker: 'XRP_USDT',
        currency: 'USDT',
        buy: { price: '0.7394', quantity: '', amount: '' },
        sell: { price: '0.7393', quantity: '', amount: '' },
      },
      {
        ticker: 'DOT_USD',
        currency: 'USD',
        buy: { price: '17.3820', quantity: '', amount: '' },
        sell: { price: '17.3770', quantity: '', amount: '' },
      },
      {
        ticker: 'DOT_USDT',
        currency: 'USDT',
        buy: { price: '17.3770', quantity: '', amount: '' },
        sell: { price: '17.3720', quantity: '', amount: '' },
      },
      {
        ticker: 'XRP_USD',
        currency: 'USD',
        buy: { price: '0.7397', quantity: '', amount: '' },
        sell: { price: '0.7395', quantity: '', amount: '' },
      },
      {
        ticker: 'EOS_USD',
        currency: 'USD',
        buy: { price: '2.3338', quantity: '', amount: '' },
        sell: { price: '2.3332', quantity: '', amount: '' },
      },
      {
        ticker: 'XLM_USDT',
        currency: 'USDT',
        buy: { price: '0.1919', quantity: '', amount: '' },
        sell: { price: '0.1918', quantity: '', amount: '' },
      },
      {
        ticker: 'LINK_USD',
        currency: 'USD',
        buy: { price: '13.2810', quantity: '', amount: '' },
        sell: { price: '13.2770', quantity: '', amount: '' },
      },
      {
        ticker: 'XLM_USD',
        currency: 'USD',
        buy: { price: '0.1919', quantity: '', amount: '' },
        sell: { price: '0.1919', quantity: '', amount: '' },
      },
      {
        ticker: 'USD_USDT',
        currency: 'USDT',
        buy: { price: '1', quantity: '', amount: '' },
        sell: { price: '1', quantity: '', amount: '' },
      },
    ]);

    process.env.MockMakeTradeItem = 'Yes';

    changerService.makeTradeItem = jest.fn().mockReturnValue([
      {
        action: 'BUY',
        ticker: 'BTC_USDT',
        quantity: '0.00018982',
        amount: '0.3365604',
        currency: 'BTC',
        usdtAmount: new BigNumber(0.3365604),
      },
      {
        action: 'BUY',
        ticker: 'BTC_USDT',
        quantity: '0.00018982',
        amount: '0.3365604',
        currency: 'BTC',
        usdtAmount: new BigNumber(0.3365604),
      },
    ]);

    //데이터
    balanceService.getAllBalanceTotalAssetAndDept = jest
      .fn()
      .mockResolvedValue([
        new bignumber(3667.00966926),
        new bignumber(-3334.348213513),

        [
          {
            available: '-0.08407201',
            convertedUsdtPrice: '-3334.348213513',
            currency: 'BTC',
          },
          {
            available: '3667.00966926',
            convertedUsdtPrice: '3667.00966926',
            currency: 'USDT',
          },
        ],
      ]);

    changerService.trades = jest.fn().mockResolvedValue(true);
    try {
      const res = await changerService.doLiquidationOrSettlement(
        account,
        TradeType.Liquidation,
      );
      expect(res).toEqual(true);
    } catch (error) {
      console.log(error);
      expect(error.message).toBe(ErrorType.E501_CREDIT_INVALID);
    }
  });
});

afterAll(() => {
  console.log('afterAll');
  mongoose.disconnect();
});
