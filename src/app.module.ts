import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestModule } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';

//DB connections
import { DBconnectionMoudle } from './providers/database/connection.module';
import { DBconnectionService } from './providers/database/connection.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from './v1/api.module';
//log Module
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    DBconnectionMoudle,
    ApiModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    //mongoDB connections module
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
})
export class AppModule implements NestModule {
  configure() {
    //middleware ==> Guard, why? guard보다 Middleware가 우선 순위가 높아 req객체에 user 데이터를
    //가져올 수 없음.
    // consumer.apply(middleVerifyOtp).forRoutes('v1/accounts/disable-otp');
  }
}
