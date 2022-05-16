import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { HttpResDto } from '../../../v1/dto/common.dto';
import { AdminAccountDocument } from '../entities/admin.entity';
import { ADMINROLETYPE } from '../../../common/enums/adminType';
import { AccountDocument } from '../../../entities/account.entity';

import { ApiProperty } from '@nestjs/swagger';
// import { WithdrawDocument } from '../../../entities/withdraw.entity';
// import { DepositDocument } from '../../../entities/deposit.entity';
// import { ContactDocument } from '../../../entities/contact.entity';

//Commont Dto도 있음. 나중에 분리 필요.

export class AccountReqDto {
  user: AdminAccountDocument;
}

export class AccountEmailReq {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'hyungmin.kang@chainpartners.net',
  })
  email: string;
}
export class cngPwReqDto extends AccountEmailReq {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '456789',
  })
  newPassword: string;
}

export class RegisterAccountDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'hyungmin.kang@chainpartners.net',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'sdokladfj;alkjr',
  })
  password: string;
}
export class LoginReqDto extends RegisterAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123546',
  })
  token: string;
}

export class LoginDto extends HttpResDto {
  @ApiProperty({
    description: 'bearer token',
    example: 'kjgioajdkj;kjokladfj;alkjr',
  })
  token: string;
}

export class ChangeRolesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'hyungmin.kang@chainpartners.net',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Viewer',
  })
  newRole: string;
}

export class RolesResDto extends HttpResDto {
  @ApiProperty({ example: ['Viewer', 'Operator', 'Admin'] })
  roles: ADMINROLETYPE[];
}

export class genOtpDtoRes extends HttpResDto {
  @ApiProperty({
    example: 'I4WGEXJ4KRNWIYTI',
  })
  secret: string;

  @ApiProperty({
    example:
      'otpauth://totp/Changer(hyungmin.kang%40chainpartners.net)?secret=I4WGEXJ4KRNWIYTI',
  })
  otpauthURL: string;
}

export class VerifyDtoRes extends HttpResDto {
  @ApiProperty({
    example: 'true',
  })
  verified: boolean;
}
export class VerifyDtoReq extends HttpResDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '123456',
  })
  token: string;
}

export class regOtpReq {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '123545',
  })
  token: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'hyungmin.kang@chainpartners.net',
  })
  email: string;
}

export class AggregateDto extends HttpResDto {
  @ApiProperty({
    example: '61',
  })
  totalCount?: number;
}

export class ChangerAccountListResDto extends AggregateDto {
  @ApiProperty({
    example: [
      {
        otp_verified: false,
        email_verified: true,
        type: 'individual',
        password:
          '$2b$10$J3o7VLhmySBkoKntxVACLuoiAguLbFJbS2/wK.hLqMl0R/NrY7J.C',
        email: 'hks0284@gmail.com',
        updatedAt: '2022-04-26T15:20:02.249Z',
        createdAt: '2022-04-26T15:20:02.249Z',
        sixDigit: {
          val: '325403',
          createdAt: '2022-04-26T15:20:02.326Z',
        },
        kyc: {
          state: 0,
        },
        __v: 0,
        accessIP: '221.162.101.76',
        id: '62680da2fae7c0266d7edfc6',
      },
    ],
  })
  accounts: AccountDocument[];
}
