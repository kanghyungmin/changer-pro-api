import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CustomError } from 'src/common/classes/error';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { AccountReqDto } from '../common/dto/account.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WithdrawDocument } from '../../entities/withdraw.entity';
import { WithdrawService } from '../service/withdraw.service';
import { Roles } from '../common/decorator/roles';
import { ADMINROLETYPE } from '../../common/enums/adminType';
import { RolesGuard } from '../common/guard/roles.guard';
import { JwtAuthGuard } from '../common/guard/jwtAuth.guard';
import {
  ChangerWithdrawalListResDto,
  RegisterTxIdReqDto,
  WithdrawIdDto,
} from '../common/dto/withdraw.dto';

import { HttpResDto, QueryPaginate } from '../common/dto/common.dto';

import { ErrorType } from '../common/enum/errorType';

@Controller('admin/withdraw')
@ApiTags('Admin APIs')
export class WithdrawController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private withdrawalService: WithdrawService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(ADMINROLETYPE.ADMIN, ADMINROLETYPE.OPERATOR)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Approve the withdrawal',
  })
  @ApiResponse({ status: 201, type: HttpResDto })
  @Post('/approve')
  async approveWithdraw(
    @Req() req: AccountReqDto,
    @Body() withdrawalIDObj: WithdrawIdDto,
  ): Promise<HttpResDto> {
    try {
      const user = req.user;
      await this.withdrawalService.approveWithdrawSvc(user, withdrawalIDObj.id);
      return { status: 'ok' };
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

  @UseGuards(RolesGuard)
  @Roles(ADMINROLETYPE.ADMIN, ADMINROLETYPE.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reject the withdrawal',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/reject')
  @ApiResponse({ status: 201, type: HttpResDto })
  async rejectWithdraw(
    @Req() req: AccountReqDto,
    @Body() withdrawalIDObj: WithdrawIdDto,
  ): Promise<HttpResDto> {
    try {
      const user = req.user;
      await this.withdrawalService.rejectWithdrawSvc(user, withdrawalIDObj.id);
      return { status: 'ok' };
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

  @UseGuards(RolesGuard)
  @Roles(ADMINROLETYPE.ADMIN, ADMINROLETYPE.OPERATOR)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Register Txid',
  })
  @ApiResponse({ status: 201, type: HttpResDto })
  @Post('/reg-txid')
  async registerTrxID(
    @Req() req: AccountReqDto,
    @Body() registerTxIdDto: RegisterTxIdReqDto,
  ) {
    try {
      const user = req.user;
      await this.withdrawalService.registerTrxID(
        user,
        registerTxIdDto.id,
        registerTxIdDto.txId,
      );
      return { status: 'ok' };
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

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the withdrawal list',
  })
  @ApiResponse({
    status: 200,
    type: ChangerWithdrawalListResDto,
  })
  async getChangerWithdrawalList(
    @Req() req: AccountReqDto,
    @Query() queryPaginate: QueryPaginate,
  ): Promise<HttpResDto> {
    try {
      const withdrawals: WithdrawDocument[] =
        await this.withdrawalService.getChangerWithdrawListSvc(
          queryPaginate.start,
          queryPaginate.length,
        );
      const totalCount: number =
        await this.withdrawalService.getChangerWithdrawCount();

      const responseDto: ChangerWithdrawalListResDto = {
        status: 'ok',
        totalCount,
        withdrawals,
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
