import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
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
import { HttpResDto, QueryPaginate } from '../common/dto/common.dto';

import { AnnouncementService } from '../service/announcement.service';
import {
  AnnouncementDto,
  AnnouncementResponseDto,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from '../common/dto/announcement.dto';
import { AnnouncementDocument } from '../../entities/announcement.entity';
import { ErrorType } from '../common/enum/errorType';

@Controller('admin/announcement')
@ApiTags('Admin APIs')
export class AnnouncementController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly announceService: AnnouncementService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the announcement list',
  })
  @ApiResponse({
    status: 200,
    type: AnnouncementResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAnnouncements(
    @Query() queryPaginate: QueryPaginate,
  ): Promise<AnnouncementResponseDto | HttpResDto> {
    try {
      const announcements: AnnouncementDocument[] =
        await this.announceService.getAnnouncements(
          queryPaginate.start,
          queryPaginate.length,
        );

      const totalCount = await this.announceService.getAnnouncementCount();

      const responseDto: AnnouncementResponseDto = {
        status: 'ok',
        totalCount: totalCount,
        announcements: announcements,
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create announcement',
  })
  @ApiResponse({
    status: 201,
    type: AnnouncementDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createAnnouncement(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<AnnouncementDto | HttpResDto> {
    try {
      const announcement: AnnouncementDocument =
        await this.announceService.createAnnouncement(createAnnouncementDto);

      const responseDto: AnnouncementDto = {
        status: 'ok',
        announcement,
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update announcement',
  })
  @ApiResponse({
    status: 200,
    type: HttpResDto,
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/')
  async updateAnnouncement(
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<AnnouncementDto | HttpResDto> {
    try {
      await this.announceService.updateAnnouncement(updateAnnouncementDto);

      const responseDto: AnnouncementDto = {
        status: 'ok',
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete announcement',
  })
  @ApiResponse({
    status: 200,
    type: HttpResDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteAnnouncement(
    @Param('id') id: string,
  ): Promise<AnnouncementDto | HttpResDto> {
    try {
      await this.announceService.deleteAnnouncement(id);

      const responseDto: AnnouncementDto = {
        status: 'ok',
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
