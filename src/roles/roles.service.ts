import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { LoggerService } from 'src/logger/custom.logger';
import { Role } from './entities/role.entity';
import { RoleRepository } from './roles.repository';

@Injectable()
export class RolesService extends BaseService<Role, RoleRepository> {
    constructor(repository: RoleRepository, logger: LoggerService) {
        super(repository, logger);
    }

    async findByName(name: string): Promise<Role> {
        return await this.repository.findByName(name);
    }

    async findByRoleId(id: string): Promise<Role> {
        return await this.repository.findByRoleId(id);
    }

    async deleteRoleById(id: string): Promise<string> {
        return await this.repository.deleteRoleById(id);
    }
}
