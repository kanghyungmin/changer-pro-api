import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
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
import { HttpResDto, QueryPaginate } from '../common/dto/common.dto';
import { MarketService } from '../service/market.service';
import { MarketResponseDto } from '../common/dto/market.dto';
import { MarketDocument } from '../../entities/market.entity';
import { ErrorType } from '../common/enum/errorType';

@Controller('admin/market')
@ApiTags('Admin APIs')
export class MarketController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly marketService: MarketService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the market list',
  })
  @ApiResponse({
    type: MarketResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getMarkets(
    @Query() queryPaginate: QueryPaginate,
  ): Promise<MarketResponseDto | HttpResDto> {
    try {
      const markets: MarketDocument[] = await this.marketService.getMarkets(
        queryPaginate.start,
        queryPaginate.length,
      );

      const totalCount = await this.marketService.getMarketCount();

      const responseDto: MarketResponseDto = {
        status: 'ok',
        totalCount: totalCount,
        markets: markets,
      };
      return responseDto;
    } catch (error) {
      let retVal: HttpResDto = null;
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
}
