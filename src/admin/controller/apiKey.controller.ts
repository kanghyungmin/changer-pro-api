import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CustomError } from '../../common/classes/error';

import { ApiKeyService } from '../service/apiKey.service';
import { ApiKeyDocument } from '../../entities/apiKey.entity';
import {
  ApiKeyResponseDto,
  CreateApiKeyDto,
  RequestApiKeyDto,
} from '../common/dto/apiKey.dto';

import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from '../common/guard/jwtAuth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { HttpResDto, QueryPaginate } from '../common/dto/common.dto';
import { ADMINROLETYPE } from '../../common/enums/adminType';
import { Roles } from '../common/decorator/roles';
import { AccountService } from '../service/account.service';
import { ErrorType } from '../common/enum/errorType';

@Controller('admin/api-key')
@ApiTags('Admin APIs')
export class ApiKeyController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly apiKeyService: ApiKeyService,
    private readonly accountService: AccountService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get apikeys list',
  })
  @ApiResponse({
    type: ApiKeyResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getApiKeys(
    @Query() queryPaginate: QueryPaginate,
  ): Promise<ApiKeyResponseDto | HttpResDto> {
    try {
      const apikeys: ApiKeyDocument[] = await this.apiKeyService.getApiKeys(
        queryPaginate.start,
        queryPaginate.length,
      );

      const totalCount: number = await this.apiKeyService.getApiKeyCount();

      const responseDto: ApiKeyResponseDto = {
        status: 'ok',
        totalCount: totalCount,
        apiKeys: apikeys,
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
  @ApiResponse({ status: 201, type: HttpResDto })
  @UseGuards(JwtAuthGuard)
  @Roles(ADMINROLETYPE.ADMIN, ADMINROLETYPE.OPERATOR)
  @Post('/')
  async createApiKey(
    @Body() requestApiKeyDto: RequestApiKeyDto,
  ): Promise<ApiKeyResponseDto | HttpResDto> {
    try {
      const accountId = requestApiKeyDto.accountId;
      const account = await this.accountService.getAccountById(accountId);

      const createApiKeyDto: CreateApiKeyDto = {
        account: account.id,
        accessKey: uuid(),
        secretKey: uuid(),
      };

      await this.apiKeyService.createApiKey(createApiKeyDto);
      const responseDto: ApiKeyResponseDto = {
        status: 'ok',
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
