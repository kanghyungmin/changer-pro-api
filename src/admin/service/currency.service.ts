import { Injectable } from '@nestjs/common';
import { CurrencyRepository } from '../repository/currency.repository';
import { CurrencyDocument } from '../../entities/currency.entity';
import {
  CreateCurrencyDto,
  UpdateCurrencyDto,
} from '../common/dto/currency.dto';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class CurrencyService {
  constructor(
    private readonly currencyRepository: CurrencyRepository,
    @InjectConnection(process.env.REPL_MONGO_DB)
    private readonly mongoChangerConnection: Connection,
  ) {}

  async getCurrencies(
    start: number,
    length: number,
  ): Promise<CurrencyDocument[]> {
    const currenies: CurrencyDocument[] =
      await this.currencyRepository.getCurrencies(start, length);
    return currenies;
  }

  async getCurrencyCount(): Promise<number> {
    const totalCount: number = await this.currencyRepository.getCurrencyCount();
    return totalCount;
  }

  async createCurrency(createCurrencyDto: CreateCurrencyDto) {
    const session = await this.mongoChangerConnection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.currencyRepository.createCurrency(
          createCurrencyDto,
          session,
        );
      });
    } catch (error) {
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }

  async updateCurrency(updateCurrencyDto: UpdateCurrencyDto) {
    const session = await this.mongoChangerConnection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.currencyRepository.updateCurrency(
          updateCurrencyDto,
          session,
        );
      });
    } catch (error) {
      throw new Error(error.message);
    } finally {
      session.endSession();
    }
  }
}
