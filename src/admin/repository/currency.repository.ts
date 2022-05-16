import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Currency, CurrencyDocument } from '../../entities/currency.entity';
import {
  CreateCurrencyDto,
  UpdateCurrencyDto,
} from '../common/dto/currency.dto';

@Injectable()
export class CurrencyRepository {
  constructor(
    @InjectModel(Currency.name)
    private readonly currencyMdoel: Model<Currency>,
  ) {}

  async getCurrencies(
    start: number,
    length: number,
  ): Promise<CurrencyDocument[]> {
    const currencies: CurrencyDocument[] = await this.currencyMdoel
      .find(
        {},
        ' name enabled createdAt updatedAt depositFee withdrawFee depositEnable withdrawEnable',
      )
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);
    return currencies;
  }

  async getCurrencyCount(): Promise<number> {
    const totalCount: number = await this.currencyMdoel.countDocuments();
    return totalCount;
  }

  async createCurrency(
    createCurrencyDto: CreateCurrencyDto,
    session: ClientSession,
  ) {
    await this.currencyMdoel.create([createCurrencyDto], { session: session });
  }

  async updateCurrency(
    updateCurrencyDto: UpdateCurrencyDto,
    session: ClientSession,
  ) {
    await this.currencyMdoel
      .updateOne(
        { _id: updateCurrencyDto.id },
        {
          $set: {
            depositEnable: updateCurrencyDto.depositEnable,
            withdrawEnable: updateCurrencyDto.withdrawEnable,
            enabled: updateCurrencyDto.enabled,
          },
        },
      )
      .session(session);
  }
}
