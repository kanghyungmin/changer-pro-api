import { SetMetadata } from '@nestjs/common';
import { ADMINROLETYPE } from '../../../common/enums/adminType';
// import { ADMINROLETYPE } from '../../../common/enums/adminType';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ADMINROLETYPE[]) =>
  SetMetadata(ROLES_KEY, roles);
