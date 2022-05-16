import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { AppConfigService } from './config/config.service';
import { NestExpressApplication } from '@nestjs/platform-express';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { BatchService } from './v1/service/batch.service';
import { BatchModule } from './v1/module/batch.module';
import { AdminModule } from './admin/admin.module';

async function bootstrap() {
  //1. admin 플래그 검사.
  //2. changer 플래그 검사.
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);

  //Batch
  let webApp: NestExpressApplication = null;
  // Admin
  if (process.env.ADMIN_SERVER === 'Y') {
    // WAS
    webApp = await NestFactory.create<NestExpressApplication>(AdminModule, {
      logger:
        process.env.NODE_ENV == 'production'
          ? ['error', 'warn', 'log']
          : ['error', 'warn', 'log', 'verbose', 'debug'],
    });
  } else {
    if (process.env.NODE_ENV === 'prod') {
      webApp = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['error', 'warn', 'log'],
      });

      if (process.env.ENABLE_BATCH === 'y') {
        const batchApp = await NestFactory.createApplicationContext(
          BatchModule,
        );
        batchApp.get(BatchService); //Batch Service 실행.
      }
    } else {
      //prod가 아니면 batch / api was 모두 실행.
      const batchApp = await NestFactory.createApplicationContext(BatchModule);
      batchApp.get(BatchService); //Batch Service 실행.
      webApp = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['error', 'warn', 'log', 'verbose', 'debug'],
      });
    }
  }

  initSwagger(webApp);
  initHelmet(webApp);
  initCors(webApp);

  webApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const appConfig: AppConfigService = webApp.get(AppConfigService);
  await webApp.listen(appConfig.port);

  console.log('appConfig.port', appConfig.port);
  console.log(`Application is running on: ${await webApp.getUrl()}`);
}

function initSwagger(app: NestExpressApplication): void {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('changer-pro-api')
    .setVersion('1.0')
    // .setDescription('Api for Changer.io')
    // .addTag('v2')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}

/**
 * @see https://github.com/helmetjs/helmet
 */
function initHelmet(app: NestExpressApplication): void {
  app.use(helmet());
}

/**
 * @see https://github.com/expressjs/cors
 */
function initCors(app: NestExpressApplication): void {
  app.enableCors();
}

// /**
//  * @Todo 추후고민
//  * @see https://github.com/expressjs/csurf
//  */
// function initCsrf(app: NestExpressApplication): void {
//   app.use(bodyParser.urlencoded({ extended: false }));
//   app.use(cookieParser());
//   app.use('/v1', csurf({ cookie: true }));
// }

bootstrap();
