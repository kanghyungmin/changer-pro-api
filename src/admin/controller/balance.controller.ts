import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CustomError } from '../../common/classes/error';

import { BalanceService } from '../service/balance.service';
import { BalanceDocument } from '../../entities/balance.entity';
import { BalancesResponseDto } from '../common/dto/balance.dto';

import { JwtAuthGuard } from '../common/guard/jwtAuth.guard';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpResDto, QueryPaginate } from '../common/dto/common.dto';
import { ErrorType } from '../common/enum/errorType';

@Controller('admin/balance')
@ApiTags('Admin APIs')
export class BalanceController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly balanceService: BalanceService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a balance list',
  })
  @ApiResponse({
    type: BalancesResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getBalances(
    @Query() queryPaginate: QueryPaginate,
  ): Promise<BalancesResponseDto | HttpResDto> {
    try {
      const balances: BalanceDocument[] = await this.balanceService.getBalances(
        queryPaginate.start,
        queryPaginate.length,
      );

      const totalCount = await this.balanceService.getBalanceCount();

      const responseDto: BalancesResponseDto = {
        status: 'ok',
        totalCount: totalCount,
        balances: balances,
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
}
