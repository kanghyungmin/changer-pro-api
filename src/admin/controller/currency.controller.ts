import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CustomError } from '../../common/classes/error';

import { JwtAuthGuard } from '../common/guard/jwtAuth.guard';

import { CurrencyService } from '../service/currency.service';
import { CurrencyDocument } from '../../entities/currency.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateCurrencyDto,
  CurrencyResponseDto,
  UpdateCurrencyDto,
} from '../common/dto/currency.dto';
import { HttpResDto, QueryPaginate } from '../common/dto/common.dto';
import { ErrorType } from '../common/enum/errorType';
import { Roles } from '../common/decorator/roles';
import { ADMINROLETYPE } from '../../common/enums/adminType';

@Controller('admin/currency')
@ApiTags('Admin APIs')
export class CurrencyController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly currencyService: CurrencyService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the currency list ',
  })
  @ApiQuery({
    name: 'length',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'start',
    required: false,
    type: 'number',
  })
  @ApiResponse({
    type: CurrencyResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Roles(ADMINROLETYPE.ADMIN)
  @Get('/')
  async getCurrencies(
    @Query() queryPaginate: QueryPaginate,
  ): Promise<CurrencyResponseDto | HttpResDto> {
    try {
      const currenies: CurrencyDocument[] =
        await this.currencyService.getCurrencies(
          queryPaginate.start,
          queryPaginate.length,
        );

      const totalCount: number = await this.currencyService.getCurrencyCount();
      const responseDto: CurrencyResponseDto = {
        status: 'ok',
        totalCount: totalCount,
        currencies: currenies,
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
    summary: 'Create currency ',
  })
  @ApiResponse({ status: 201, type: HttpResDto })
  @UseGuards(JwtAuthGuard)
  @Roles(ADMINROLETYPE.ADMIN)
  @Post('/')
  async createCurrency(
    @Body() createCurrencyDto: CreateCurrencyDto,
  ): Promise<CurrencyResponseDto | HttpResDto> {
    try {
      console.log(createCurrencyDto);

      await this.currencyService.createCurrency(createCurrencyDto);
      const responseDto: HttpResDto = {
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update currency ',
  })
  @ApiResponse({ status: 200, type: HttpResDto })
  @UseGuards(JwtAuthGuard)
  @Roles(ADMINROLETYPE.ADMIN)
  @Patch('/')
  async updateCurrency(
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<CurrencyResponseDto | HttpResDto> {
    try {
      console.log(updateCurrencyDto);

      await this.currencyService.updateCurrency(updateCurrencyDto);
      const responseDto: HttpResDto = {
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
