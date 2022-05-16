import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/admin/auth/auth.service';
import { RegisterAccountDto } from 'src/v1/dto/account.dto';
import { AdminAccountDocument } from 'src/admin/common/entities/admin.entity';
import { ErrorType } from '../common/enum/errorType';

@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user: AdminAccountDocument = await this.authService.validateAccount({
      email: email,
      password: password,
    } as RegisterAccountDto);

    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          code: 225,
          message: ErrorType.E225_NO_USER,
        },
        HttpStatus.OK,
      );
    }
    const isCorrectPW: boolean = await user.verifyPassword(password);
    if (!isCorrectPW) {
      throw new HttpException(
        {
          status: 'error',
          code: 222,
          message: ErrorType.E222_INCORRECT_PASSWORD,
        },
        HttpStatus.OK,
      );
    }
    return user;
  }
}
