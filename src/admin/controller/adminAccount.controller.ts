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
import { AdminAccountService } from '../service/adminAccount.service';

import { AuthGuard } from '@nestjs/passport';
import {
  AccountReqDto,
  ChangerAccountListResDto,
  ChangeRolesDto,
  cngPwReqDto,
  genOtpDtoRes,
  LoginDto,
  LoginReqDto,
  RegisterAccountDto,
  regOtpReq,
  RolesResDto,
  VerifyDtoReq,
  VerifyDtoRes,
} from '../common/dto/account.dto';
import { JwtAuthGuard } from '../common/guard/jwtAuth.guard';
import { Roles } from '../common/decorator/roles';
import { ADMINROLETYPE } from '../../common/enums/adminType';
import { OtpAuth } from '../../common/guard/otpAuth.guard';
import { AccountDocument } from '../../entities/account.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  // ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAccountDocument } from '../common/entities/admin.entity';
import { RolesGuard } from '../common/guard/roles.guard';
import { HttpResDto, QueryPaginate } from '../common/dto/common.dto';
import { ErrorType } from '../common/enum/errorType';

@Controller('admin/account')
@ApiTags('Admin APIs')
export class AdminAccountController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private adminAccountService: AdminAccountService,
  ) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Generate admin user',
  })
  @ApiResponse({ status: 201, type: genOtpDtoRes })
  async registerAccount(
    @Body() registerAccountDto: RegisterAccountDto,
  ): Promise<genOtpDtoRes | HttpResDto> {
    try {
      const account: AdminAccountDocument =
        await this.adminAccountService.registerAccount(registerAccountDto);

      const resDto: genOtpDtoRes = await this.adminAccountService.generateOtp(
        account,
      );
      resDto.status = 'ok';

      return resDto;
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

  @UseGuards(OtpAuth)
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @ApiOperation({
    summary: 'Log in',
  })
  @ApiResponse({ status: 201, type: LoginDto })
  @ApiBody({ type: LoginReqDto })
  async getLogin(@Req() req: AccountReqDto): Promise<LoginDto | HttpResDto> {
    try {
      const account: AdminAccountDocument = req.user;
      const token: string = await this.adminAccountService.login(account);
      const resDto: LoginDto = {
        status: 'ok',
        token,
      };
      return resDto;
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

  @Post('/reg-otp')
  @ApiOperation({
    summary: 'otp registeration',
  })
  @ApiResponse({ status: 201, type: HttpResDto })
  @ApiBody({
    type: regOtpReq,
  })
  async regOtp(@Body() data: regOtpReq): Promise<HttpResDto> {
    try {
      await this.adminAccountService.regOtp(data);
      return {
        status: 'ok',
      };
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

  @UseGuards(JwtAuthGuard)
  @Post('/verify-otp')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'otp verification',
  })
  @ApiResponse({
    status: 201,
    type: VerifyDtoRes,
  })
  @ApiBody({ type: VerifyDtoReq })
  async verifyOtp(
    @Req() req: AccountReqDto,
    @Body() reqDto: VerifyDtoReq,
  ): Promise<VerifyDtoRes | HttpResDto> {
    try {
      const account: AdminAccountDocument = req.user;
      const isVerified: boolean =
        await this.adminAccountService.verifyOtpService(account, reqDto.token);
      const resDto: VerifyDtoRes = { status: 'ok', verified: isVerified };
      return resDto;
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

  @UseGuards(AuthGuard('local'))
  @Post('/gen-otp')
  @ApiOperation({
    summary: 'otp generation',
  })
  @ApiResponse({
    status: 201,
    type: genOtpDtoRes,
  })
  @ApiBody({ type: RegisterAccountDto })
  async getOtp(@Req() req: AccountReqDto) {
    try {
      const account: AdminAccountDocument = req.user;
      const resDto: genOtpDtoRes = await this.adminAccountService.generateOtp(
        account,
      );
      resDto.status = 'ok';
      return resDto;
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

  @Get('/role')
  @ApiOperation({
    summary: 'Get admin-role list',
  })
  @ApiResponse({
    status: 201,
    type: RolesResDto,
  })
  async getListRoles(): Promise<RolesResDto> {
    try {
      const roles: ADMINROLETYPE[] =
        await this.adminAccountService.getListRoles();
      return { status: 'ok', roles };
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

  @UseGuards(AuthGuard('local'))
  @Post('/change-pw')
  @ApiOperation({
    summary: 'Change account password',
  })
  @ApiResponse({
    status: 201,
    type: HttpResDto,
  })
  async cngPw(
    @Req() req: AccountReqDto,
    @Body() reqDto: cngPwReqDto,
  ): Promise<HttpResDto> {
    try {
      await this.adminAccountService.cngPwSvc(req.user, reqDto.newPassword);

      return { status: 'ok' };
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

  @UseGuards(RolesGuard)
  @Roles(ADMINROLETYPE.ADMIN, ADMINROLETYPE.OPERATOR)
  @UseGuards(JwtAuthGuard)
  @Post('/change-role')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Changer the role of user(only for the admin account)',
  })
  @ApiBody({ type: ChangeRolesDto })
  @ApiCreatedResponse({ type: HttpResDto })
  async changeRole(@Body() reqDto: ChangeRolesDto): Promise<HttpResDto> {
    try {
      await this.adminAccountService.changeRoles(reqDto);
      return { status: 'ok' };
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

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get changer account lists',
  })
  @ApiResponse({
    status: 201,
    type: ChangerAccountListResDto,
  })
  async getChangerAccountList(
    @Req() req: AccountReqDto,
    @Query() queryPaginate: QueryPaginate,
  ): Promise<HttpResDto> {
    try {
      const admin: AdminAccountDocument = req.user;
      const accounts: AccountDocument[] =
        await this.adminAccountService.getChangerAccountList(
          queryPaginate.start,
          queryPaginate.length,
          admin,
        );
      const totalCount: number =
        await this.adminAccountService.getChangerAccountCount();

      const responseDto: ChangerAccountListResDto = {
        status: 'ok',
        totalCount,
        accounts,
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
