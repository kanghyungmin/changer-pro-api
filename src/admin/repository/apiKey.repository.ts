import { InjectModel } from '@nestjs/mongoose';
import { ApiKey, ApiKeyDocument } from 'src/entities/apiKey.entity';
import { Model, ClientSession } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateApiKeyDto } from '../common/dto/apiKey.dto';

@Injectable()
export class ApiKeyRepository {
  constructor(
    @InjectModel(ApiKey.name)
    private readonly apiKeyMdoel: Model<ApiKey>,
  ) {}

  async findSecretKey(accessKey: string): Promise<string> {
    const query: Record<string, any> = {
      accessKey,
    };
    const res: ApiKeyDocument = await this.apiKeyMdoel.findOne(query);
    return res.secretKey;
  }

  async getApiKeys(start: number, length: number): Promise<ApiKeyDocument[]> {
    const apiKeys: ApiKeyDocument[] = await this.apiKeyMdoel
      .find({ enable: true }, 'accessKey createdAt')
      .populate({
        path: 'account',
        select: '-_id email',
      })
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);

    return apiKeys;
  }

  async getApiKeyCount(): Promise<number> {
    const totalCount: number = await this.apiKeyMdoel.countDocuments();
    return totalCount;
  }

  async createApiKey(
    createApiKeyDto: CreateApiKeyDto,
    session: ClientSession,
  ): Promise<void> {
    await this.apiKeyMdoel.create([createApiKeyDto], { session: session });
  }
}
