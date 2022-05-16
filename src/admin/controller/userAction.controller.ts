import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CustomError } from '../../common/classes/error';
import { ErrorType } from '../../common/enums/errorType';

import { JwtAuthGuard } from '../common/guard/jwtAuth.guard';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpResDto, QueryPaginate } from '../common/dto/common.dto';
import { UserActionService } from '../service/userAction.service';

import { AccountReqDto } from '../common/dto/account.dto';
import { ActionLogGetListResDto } from '../common/dto/userAction.dto';

@Controller('admin/log')
@ApiTags('Admin APIs')
export class UserActionController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly userActionService: UserActionService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get logs for user actions',
  })
  @ApiResponse({
    status: 200,
    type: ActionLogGetListResDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getLogs(
    @Req() req: AccountReqDto,
    @Query() queryPaginate: QueryPaginate,
  ): Promise<ActionLogGetListResDto | HttpResDto> {
    try {
      const user = req.user;
      const res: ActionLogGetListResDto =
        await this.userActionService.getLogsSvc(user, queryPaginate);
      return res;
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
