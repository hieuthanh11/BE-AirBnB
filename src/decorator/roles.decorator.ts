import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role_ENUM } from 'src/roles/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role_ENUM[]): CustomDecorator<string> => {
    return SetMetadata(ROLES_KEY, roles);
};
