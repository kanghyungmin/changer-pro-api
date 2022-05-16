import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(private config: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ADMIN_JWT_SECRET,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRESIN || '1d' },
    });
  }
}
