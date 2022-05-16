import { Injectable } from '@nestjs/common';
//service
//dto
import { RegisterAccountDto } from '../../v1/dto/account.dto';
import { AdminAccountDocument } from '../common/entities/admin.entity';
import { AdminAccountService } from '../service/adminAccount.service';

@Injectable()
export class AuthService {
  constructor(private adminAccountService: AdminAccountService) {}

  async validateAccount(
    registerAccountDto: RegisterAccountDto,
  ): Promise<AdminAccountDocument> | null {
    const account: AdminAccountDocument =
      await this.adminAccountService.findOne(registerAccountDto);

    if (!account) {
      return null;
    }
    return account;
  }
}
