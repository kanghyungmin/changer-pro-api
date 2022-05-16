import axios from 'axios';
import BigNumber from 'bignumber.js';
import { CustomError } from '../../common/classes/error';
import { ErrorType } from '../../common/enums/errorType';
import { Cron, CronExpression } from '@nestjs/schedule';
import { stringify } from 'querystring';
import { CACHE_USDT_PRICES } from '../../common/consts';
import { AppConfigService } from '../../config/config.service';
import { Inject, Injectable } from '@nestjs/common';
import { CurrencyService } from '../../v1/service/currency.service';
import { quoteDto } from '../../v1/dto/common.dto';
import { Side } from '../../common/enums/side';
import { CurrencyDocument } from '../../entities/currency.entity';
import {
  QuoteDto,
  QuoteResDto,
  RequestQuotesDto,
} from '../../v1/dto/changer.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ChangerDataProviderService {
  public changerDataProvierEnpoint: string =
    this.config.changerDataProviderEndpoint || 'http://localhost:3000';

  public cacheCurrencyDecimalPoints: Map<string, string> | null = null;
  private cacheCurrencies: Map<string, CurrencyDocument> | null = null;

  constructor(
    private readonly config: AppConfigService,
    private readonly currencyService: CurrencyService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.calcAllTickerToUsdtPrice();
    this.cacheCurrencyDecimalPoints = new Map<string, string>();
    this.cacheCurrencies = new Map<string, CurrencyDocument>();
  }

  public async getAvailableTickers() {
    const uriPath = '/availableTickers';

    try {
      const { data } = await axios.get(
        `${this.changerDataProvierEnpoint}${uriPath}`,
      );

      let result: any | null = null;
      if (data.status === 'ok') {
        const covertedTickers = data.tickers.map((ticker: string) => {
          const splittedTicker = ticker.split('_');
          const base = this.convertFiatCrrctoECrrc(splittedTicker[0]);
          const quote = this.convertFiatCrrctoECrrc(splittedTicker[1]);
          ticker = `${base.toUpperCase()}_${quote.toUpperCase()}`;
          return ticker;
        });
        data.tickers = covertedTickers;
        result = data;
      }

      return result;
    } catch (error) {
      throw new CustomError(ErrorType.E301_CHANGER_DATA_PROVIDER_ERROR, 301);
    }
  }

  public convertFiatCrrctoECrrc(fStr: string) {
    let result = fStr;

    if (fStr.toUpperCase() === 'USD') {
      result = 'EUSD';
    } else if (fStr.toUpperCase() === 'JPY') {
      result = 'EJPY';
    } else if (fStr.toUpperCase() === 'CAD') {
      result = 'ECAD';
    } else if (fStr.toUpperCase() === 'CHF') {
      result = 'ECHF';
    } else if (fStr.toUpperCase() === 'CNH') {
      result = 'ECNH';
    } else if (fStr.toUpperCase() === 'CZK') {
      result = 'ECZK';
    } else if (fStr.toUpperCase() === 'DKK') {
      result = 'EDKK';
    } else if (fStr.toUpperCase() === 'HKD') {
      result = 'EHKD';
    } else if (fStr.toUpperCase() === 'HUF') {
      result = 'EHUF';
    } else if (fStr.toUpperCase() === 'ILS') {
      result = 'EILS';
    } else if (fStr.toUpperCase() === 'MXN') {
      result = 'EMXN';
    } else if (fStr.toUpperCase() === 'NOK') {
      result = 'ENOK';
    } else if (fStr.toUpperCase() === 'PLN') {
      result = 'EPLN';
    } else if (fStr.toUpperCase() === 'RUB') {
      result = 'ERUB';
    }
    return result.toUpperCase();
  }

  public async getUsdtTickers() {
    const uriPath = '/usdtTickers';
    const { data } = await axios.get(
      `${this.changerDataProvierEnpoint}${uriPath}`,
      {
        headers: {
          // Authorization: `Bearer ${token}`
        },
      },
    );
    let result: [] | null = null;
    if (data.status === 'ok') {
      result = data.usdtTickers;
    }

    return result;
  }
  async getChangerQuotes(
    reqIds: RequestQuotesDto,
  ): Promise<Record<string, QuoteResDto>> {
    const { quotePairs } = reqIds;

    const quotePromises = quotePairs.map((quotePair: string) => {
      const splittedPair = quotePair.split(':');
      const ticker = splittedPair[0].toUpperCase();
      const quantity = new BigNumber(splittedPair[2]).toString();
      return this.getChangerQuote({ ticker, quantity });
    });

    const quoteApiResults: QuoteDto[] = [];
    try {
      const settledQuoteApiResults = await Promise.allSettled(quotePromises);

      //filter 써서 fulfilled 된 promise에 한해,quoteApiReulst 푸쉬.
      for (const element of settledQuoteApiResults.values()) {
        if (element.status === 'fulfilled') {
          quoteApiResults.push(element.value);
        } else {
          //no quotes
          quoteApiResults.push({
            requestId: String(element.reason).split(' ')[6],
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

    //void 값 필터 처리 & RequestID makes key
    const quotesObject: Record<string, QuoteResDto> = quoteApiResults.reduce(
      (acc: any, quoteApiResult: QuoteDto) => {
        const key = quoteApiResult.requestId;
        if (quoteApiResult.quoteData) {
          acc[key] = {
            status: 'ok', //data임.
            quote: quoteApiResult,
          };
        } else {
          acc[key] = {
            status: 'error', //data임.
            message: ErrorType.E500_NO_QUOTE, //error message로 바뀌어야 함.
            quote: quoteApiResult,
          };
        }
        return acc;
      },
      {}, //ini value
    );

    return quotesObject;
  }

  async getChangerQuote(
    tickerQuantity: quoteDto,
    isDelete = true,
  ): Promise<QuoteDto> {
    const { ticker, quantity } = tickerQuantity;
    const currency = ticker.split('_')[0];
    const param: {
      ticker: string;
      quantity: string;
      currency: string;
    } = { ticker, quantity, currency };

    const stringifyParam = stringify(param);
    const uriPath = '/quote';

    const { data } = await axios.get(
      `${this.changerDataProvierEnpoint}${uriPath}?${stringifyParam}`,
      {
        headers: {
          // Authorization: `Bearer ${token}`
        },
      },
    );

    if (data.status === 'ok') {
      const quote = data.quote;
      if (quote) {
        const requestId = quote.requestId;
        const splittedRequestId = requestId.split(':');
        const ticker = splittedRequestId[0];
        const currency = splittedRequestId[1];
        const notional = splittedRequestId[2];

        const splittedTicker = ticker.split('_');
        const baseStr = this.convertFiatCrrctoECrrc(splittedTicker[0]);
        const quoteStr = this.convertFiatCrrctoECrrc(splittedTicker[1]);
        const tickerStr = `${baseStr.toUpperCase()}_${quoteStr.toUpperCase()}`;
        const currencyStr = this.convertFiatCrrctoECrrc(currency);
        quote.requestId = `${tickerStr}:${currencyStr}:${notional}`;
        quote.quoteData.ticker = tickerStr;
        quote.quoteData.currency = currencyStr;
      }
    } else {
      throw new CustomError(
        `${
          ErrorType.E500_NO_QUOTE
        } for ${ticker.toUpperCase()}:${currency}:${quantity}`,
        500,
      );
    }
    //margin apply
    if (data && data.status === 'ok') {
      if (isDelete) await this.applyMargin(ticker, data.quote.quoteData);
      else await this.applyMargin(ticker, data.quote.quoteData, false);
    }

    return data.quote;
  }

  async applyMargin(ticker: string, quoteData: any, isDelete = true) {
    const buyAmount = quoteData.buy.amount;
    const sellAmount = quoteData.sell.amount;

    const originBuyPrice = quoteData.buy.price;
    const originSellPrice = quoteData.sell.price;
    const originBuyQty = quoteData.buy.quantity;
    const originSellQty = quoteData.sell.quantity;

    const currency = quoteData.currency;

    const calcMarginResult = await Promise.all([
      this.calcMargin(
        ticker,
        currency,
        originBuyPrice,
        originBuyQty,
        buyAmount,
        Side.Buy,
      ),
      this.calcMargin(
        ticker,
        currency,
        originSellPrice,
        originSellQty,
        sellAmount,
        Side.Sell,
      ),
    ]);
    const [marginBuyPrice, marginBuyQty] = calcMarginResult[0];
    const [marginSellPrice, marginSellQty] = calcMarginResult[1];

    quoteData.buy.price = marginBuyPrice;
    quoteData.buy.quantity = marginBuyQty;
    quoteData.sell.price = marginSellPrice;
    quoteData.sell.quantity = marginSellQty;

    if (isDelete) {
      delete quoteData.buy.tradePrc;
      delete quoteData.sell.tradePrc;
      delete quoteData.buy.origin;
      delete quoteData.sell.origin;
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async calcAllTickerToUsdtPrice() {
    // var process = require('process');
    // console.log('calcAllTickerToUsdtPrice every 10 seconds.', process.pid);
    const usdtTickers = await this.getUsdtTickers();

    if (usdtTickers && usdtTickers.length > 0) {
      usdtTickers.forEach((item: any) => {
        const splittedTicker = item.ticker.split('_');
        const base = this.convertFiatCrrctoECrrc(splittedTicker[0]);
        const quote = this.convertFiatCrrctoECrrc(splittedTicker[1]);
        const buyPrice = new BigNumber(item.buy.price);
        const sellPrice = new BigNumber(item.sell.price);
        const mediumPrice = buyPrice.plus(sellPrice).dividedBy(2);

        CACHE_USDT_PRICES[`${base}`] = {
          ticker: `${base}_${quote}`,
          base,
          quote,
          price: mediumPrice,
        };
        CACHE_USDT_PRICES['USDT'] = {
          ticker: null,
          base: null,
          quote: null,
          price: new BigNumber(1.0),
        };

        this.currencyService.updateOneCurrency(base.toLowerCase(), mediumPrice);
      });
    } else {
      console.error('calcAllTickerToUsdtPrice error');
    }
  }
  getLengthDecimalPoint(val: string) {
    let length = 0;
    if (val) {
      const splitted = val.toString().split('.');
      if (splitted && splitted.length > 1) {
        length = splitted[1].length;
      }
    }
    return length;
  }
  async calcMargin(
    ticker: string,
    currency: string,
    price: string,
    quantity: string,
    amount: string,
    side: Side,
  ) {
    const marginRatio = process.env.CHANGER_MARGIN_RATIO || 0.0; //1% 마진

    const originPrice = new BigNumber(price);
    const [baseCurrencyStr, quoteCurrencyStr] = ticker.split('_');
    // base 기준의 usdtPrice 가져오기
    const usdtPriceOfBaseCurrency =
      CACHE_USDT_PRICES[baseCurrencyStr.toUpperCase()].price;
    const usdtPriceOfBTC = CACHE_USDT_PRICES['BTC'].price;
    const usdtPriceOfETH = CACHE_USDT_PRICES['ETH'].price;

    let originPriceDpLength = Math.min(new BigNumber(price).decimalPlaces(), 8);
    const originQtyDpLength = Math.min(
      new BigNumber(quantity).decimalPlaces(),
      8,
    );

    let quoteCurrency: CurrencyDocument | undefined | null =
      this.cacheCurrencies.get(quoteCurrencyStr);
    if (!quoteCurrency) {
      quoteCurrency = await this.currencyService.getCurrencyOne(
        quoteCurrencyStr.toLowerCase(),
      );

      if (quoteCurrency) {
        //update 문
        this.cacheCurrencies.set(quoteCurrencyStr, quoteCurrency);
      }
    }

    if (
      quoteCurrency &&
      quoteCurrency.type === 'fiat' &&
      quoteCurrencyStr.toUpperCase() !== 'EUSD'
    ) {
      // fiat은 무조건 4자리로 고정.
      originPriceDpLength = 4;
    } else {
      if (
        quoteCurrencyStr.toUpperCase() !== 'BTC' &&
        quoteCurrencyStr.toUpperCase() !== 'ETH'
      ) {
        if (new BigNumber(usdtPriceOfBaseCurrency).gte(usdtPriceOfBTC)) {
          originPriceDpLength = 2;
        } else if (new BigNumber(usdtPriceOfBaseCurrency).gte(usdtPriceOfETH)) {
          originPriceDpLength = 2;
        } else if (new BigNumber(usdtPriceOfBaseCurrency).gt(10)) {
          originPriceDpLength = 4;
        } else if (
          new BigNumber(usdtPriceOfBaseCurrency).lte(10) &&
          new BigNumber(usdtPriceOfBaseCurrency).gt(1)
        ) {
          originPriceDpLength = 6;
        } else if (new BigNumber(usdtPriceOfBaseCurrency).lte(1)) {
          originPriceDpLength = 8;
        }
      }
    }

    const marginPrice: BigNumber =
      side === Side.Buy
        ? originPrice.multipliedBy(new BigNumber(1).plus(marginRatio))
        : originPrice.multipliedBy(new BigNumber(1).minus(marginRatio));
    // 2는 올림, 3은 내림.
    // price는 buy인 경우 올림, sell인 경우 내림.
    const convertMarginPrice =
      side === Side.Buy
        ? marginPrice
            .decimalPlaces(originPriceDpLength, BigNumber.ROUND_CEIL)
            .toString()
        : marginPrice
            .decimalPlaces(originPriceDpLength, BigNumber.ROUND_FLOOR)
            .toString();

    const marginQty: BigNumber =
      currency.toUpperCase() === quoteCurrencyStr.toUpperCase()
        ? new BigNumber(amount).dividedBy(convertMarginPrice)
        : new BigNumber(quantity);

    // quantaty는 buy인 경우 내림, sell인 경우 올림.
    const convertMarginQty =
      side === Side.Buy
        ? marginQty
            .decimalPlaces(originQtyDpLength, BigNumber.ROUND_FLOOR)
            .toString()
        : marginQty
            .decimalPlaces(originQtyDpLength, BigNumber.ROUND_CEIL)
            .toString();

    return [convertMarginPrice, convertMarginQty];
  }

  async changerTrade(params: {
    ticker: string;
    quantity: BigNumber;
    amount: BigNumber;
    action: string;
    currency?: string;
    quotePrice?: string;
  }) {
    const uriPath = '/trade';

    const { data } = await axios.post(
      `${this.changerDataProvierEnpoint}${uriPath}`,
      params,
      {
        headers: {
          // Authorization: `Bearer ${token}`
        },
      },
    );
    // "status": "ok",
    // "data": {
    //     "origin": "cumberland",
    //     "tradeId": "93018c0a-3181-416b-9717-95d5d6016d51",
    //     "action": "BUY",
    //     "ticker": "BTC_USDT",
    //     "currency": "USDT",
    //     "quantity": 0.00555673,
    //     "price": 17996.2,
    //     "amount": 100
    // }
    if (data.status === 'ok') {
      const tradeData = data.data;
      const ticker = tradeData.ticker;
      const splittedTicker = ticker.split('_');
      const baseStr = this.convertFiatCrrctoECrrc(splittedTicker[0]);
      const quoteStr = this.convertFiatCrrctoECrrc(splittedTicker[1]);
      const currencyStr = this.convertFiatCrrctoECrrc(tradeData.currency);
      const tickerStr = `${baseStr}_${quoteStr}`;
      tradeData.ticker = tickerStr;
      tradeData.currency = currencyStr;
    }

    return data;
  }
}
