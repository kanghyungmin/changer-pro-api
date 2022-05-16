import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';

import { CustomError } from 'src/common/classes/error';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { AccountReqDto } from '../common/dto/account.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContactDocument } from '../../entities/contact.entity';
import { ContactService } from '../service/contact.service';
// import { Roles } from '../common/decorator/roles';
// import { ADMINROLETYPE } from '../../common/enums/adminType';
// import { RolesGuard } from '../common/guard/roles.guard';
import { JwtAuthGuard } from '../common/guard/jwtAuth.guard';
import { ChangerContactListResDto } from '../common/dto/contact.dto';
import { HttpResDto, QueryPaginate } from '../common/dto/common.dto';
import { ErrorType } from '../common/enum/errorType';

@Controller('admin/contact')
@ApiTags('Admin APIs')
export class ContactController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private contactService: ContactService,
  ) {}

  //@UseGuards(RolesGuard)
  //@Roles(ADMINROLETYPE.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the contact list',
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
    status: 200,
    type: ChangerContactListResDto,
  })
  async getChangerContactList(
    @Req() req: AccountReqDto,
    @Query() queryPaginate: QueryPaginate,
  ): Promise<ChangerContactListResDto | HttpResDto> {
    try {
      const contacts: ContactDocument[] =
        await this.contactService.getChangerContactListSvc(
          queryPaginate.start,
          queryPaginate.length,
        );
      const totalCount: number =
        await this.contactService.getChangerContactCount();

      const responseDto: ChangerContactListResDto = {
        status: 'ok',
        totalCount,
        contacts,
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
