import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { LoggerService } from 'src/logger/custom.logger';
import { Status } from './entities/status.entity';
import { StatusRepository } from './status.repository';

@Injectable()
export class StatusService extends BaseService<Status, StatusRepository> {
    constructor(repository: StatusRepository, logger: LoggerService) {
        super(repository, logger);
    }

    async findStatusByName(name: string): Promise<Status> {
        return await this.repository.findStatusByName(name);
    }

    async findStatusById(id: string): Promise<Status> {
        return await this.repository.findStatusById(id);
    }

    async deleteStatusById(id: string): Promise<string> {
        return await this.repository.deleteStatusById(id);
    }
}
