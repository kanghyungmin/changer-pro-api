import { AppConfigService } from '../../config/config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DBconnectionService {
  constructor(private readonly config: AppConfigService) {}

  public async getMongoConfig() {
    return {
      uri:
        'mongodb+srv://' +
        this.config.dbuser +
        ':' +
        this.config.dbpwd +
        '@' +
        this.config.dbhost +
        '/' +
        this.config.dbname,
      // 'test',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }
  public async getMongoAdminConfig() {
    return {
      uri:
        'mongodb+srv://' +
        this.config.dbuser +
        ':' +
        this.config.dbpwd +
        '@' +
        this.config.dbhost +
        '/' +
        process.env.REPL_ADMIN_MONGO_DB,
      // 'test',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }
}
