import { Injectable } from '@nestjs/common';
import { ApiKeyDocument } from '../../entities/apiKey.entity';
import { CreateApiKeyDto } from '../common/dto/apiKey.dto';
import { ApiKeyRepository } from '../repository/apiKey.repository';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
    @InjectConnection(process.env.REPL_ADMIN_MONGO_DB)
    private readonly mongoConnection: Connection,
  ) {}

  async findSecretKeys(accessKey: string): Promise<string> {
    const res: string = await this.apiKeyRepository.findSecretKey(accessKey);
    return res;
  }

  async getApiKeys(start: number, length: number): Promise<ApiKeyDocument[]> {
    const apikeys: ApiKeyDocument[] = await this.apiKeyRepository.getApiKeys(
      start,
      length,
    );
    return apikeys;
  }

  async getApiKeyCount(): Promise<number> {
    const totalCount: number = await this.apiKeyRepository.getApiKeyCount();
    return totalCount;
  }

  async createApiKey(createApiKeyDto: CreateApiKeyDto): Promise<void> {
    const session = await this.mongoConnection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.apiKeyRepository.createApiKey(createApiKeyDto, session);
      });
    } catch (error) {
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }
}
