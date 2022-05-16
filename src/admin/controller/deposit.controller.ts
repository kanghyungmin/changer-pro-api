import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';

import { CustomError } from 'src/common/classes/error';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { AccountReqDto } from '../common/dto/account.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  // ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guard/jwtAuth.guard';
import { DepositService } from '../service/deposit.service';
import { DepositDocument } from '../../entities/deposit.entity';
import { ChangerDepositListResDto } from '../common/dto/deposit.dto';
import { HttpResDto, QueryPaginate } from '../common/dto/common.dto';
import { ErrorType } from '../common/enum/errorType';

@Controller('admin/deposit')
@ApiTags('Admin APIs')
export class DepositController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private depositService: DepositService,
  ) {}

  // @UseGuards(RolesGuard)
  // @Roles(ADMINROLETYPE.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the deposit list',
  })
  @ApiResponse({
    status: 200,
    type: ChangerDepositListResDto,
  })
  async getChangerDepositList(
    @Req() req: AccountReqDto,
    @Query() queryPaginate: QueryPaginate,
  ): Promise<HttpResDto> {
    try {
      const deposits: DepositDocument[] =
        await this.depositService.getChangeDepositListSvc(
          queryPaginate.start,
          queryPaginate.length,
        );
      const totalCount: number =
        await this.depositService.getChangerDepoistCount();

      const responseDto: ChangerDepositListResDto = {
        status: 'ok',
        totalCount,
        deposits,
      };

      return responseDto;
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
