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
// import { MarketResponseDto } from '../common/dto/market.dto';
// import { MarketDocument } from '../../entities/market.entity';
import { TransactionService } from '../service/transaction.service';
import { TransactionResponseDto } from '../common/dto/transaction.dto';
import { TransactionDocument } from '../../entities/transactions.entity';
import { ErrorType } from '../common/enum/errorType';

@Controller('admin/transaction')
@ApiTags('Admin APIs')
export class TransactionController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly transactionService: TransactionService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the transaction list',
  })
  @ApiResponse({
    status: 200,
    type: TransactionResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getTransactions(
    @Query() queryPaginate: QueryPaginate,
  ): Promise<TransactionResponseDto | HttpResDto> {
    try {
      const transactions: TransactionDocument[] =
        await this.transactionService.getTransactions(
          queryPaginate.start,
          queryPaginate.length,
        );

      const totalCount = await this.transactionService.getTransactionCount();

      const responseDto: TransactionResponseDto = {
        status: 'ok',
        totalCount: totalCount,
        transactions: transactions,
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
    summary: 'Download transaction list',
  })
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'text/csv')
  @Header(
    'Content-Disposition',
    `attachment; filename=transactions_${new Date().getTime()}.csv`,
  )
  @Get('/download')
  async downloadTransactions(
    @Query() dates: QueryDates,
  ): Promise<string | HttpResDto> {
    try {
      const result: string = await this.transactionService.downloadTransactions(
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
