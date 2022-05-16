import {
  Controller,
  Get,
  Header,
  Inject,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CustomError } from '../../common/classes/error';

import { JwtAuthGuard } from '../common/guard/jwtAuth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  HttpResDto,
  QueryDates,
  QueryPaginate,
} from '../common/dto/common.dto';
import { TradeService } from '../service/trade.service';
import { TradeResponseDto } from '../common/dto/trade.dto';
import { TradeDocument } from '../../entities/trade.entity';
import { ErrorType } from '../common/enum/errorType';
import { Response } from 'express';

@Controller('admin/trade')
@ApiTags('Admin APIs')
export class TradeController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly tradeService: TradeService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the trade lists',
  })
  @ApiResponse({
    status: 200,
    type: TradeResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getTrades(
    @Query() queryPaginate: QueryPaginate,
  ): Promise<TradeResponseDto | HttpResDto> {
    try {
      const trades: TradeDocument[] = await this.tradeService.getTrades(
        queryPaginate.start,
        queryPaginate.length,
      );

      // const tradeDatas = trades.map((row) => {
      //   const info = JSON.parse(JSON.stringify(row.info));
      //   return {
      //     id: row.id,
      //     name: row.market.name,
      //     side: row.side,
      //     status: row.status,
      //     type: row.type,
      //     email: row.account.email,
      //     price: row.price,
      //     volume: row.volume,
      //     amount: row.amount,
      //     origin: `${info.origin} prc: ${info.price} qty: ${info.quantity}`,
      //     createdAt: new Date(row.createdAt),
      //     updatedAt: new Date(row.updatedAt),
      //   };
      // });

      const totalCount = await this.tradeService.getTradeCount();

      const responseDto: TradeResponseDto = {
        status: 'ok',
        totalCount: totalCount,
        trades: trades,
      };
      return responseDto;
    } catch (error) {
      let retVal = null;
      if (error instanceof CustomError) {
        retVal = {
          status: 'error',
          code: error.code,
          message: error.message,
        };
      } else {
        retVal = {
          status: 'error',
          code: ErrorType.E1000_UNDEFINED_ERROR,
          message: error.message,
        };
      }
      return retVal;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Download trade list',
  })
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'text/csv')
  @Header(
    'Content-Disposition',
    `attachment; filename=trades_${new Date().getTime()}.csv`,
  )
  @Get('/download')
  async downloadTrades(
    @Query() dates: QueryDates,
  ): Promise<string | HttpResDto> {
    try {
      const result: string = await this.tradeService.downloadTrades(
        dates.startDate,
        dates.endDate,
      );
      return result;
    } catch (error) {
      let exceptionDto: HttpResDto = null;
      if (error instanceof CustomError) {
        exceptionDto = {
          status: 'error',
          code: error.code,
          message: error.message,
        };
      } else {
        exceptionDto = {
          status: 'error',
          code: ErrorType.E1000_UNDEFINED_ERROR,
          message: error.message,
        };
      }
      return exceptionDto;
    }
  }
}
