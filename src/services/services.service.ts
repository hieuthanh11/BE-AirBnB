import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { LoggerService } from 'src/logger/custom.logger';
import { Service } from './entities/service.entity';
import { ServicesRepository } from './services.repository';

@Injectable()
export class ServicesService extends BaseService<Service, ServicesRepository> {
    constructor(repository: ServicesRepository, logger: LoggerService) {
        super(repository, logger);
    }

    async findServicesById(id: string): Promise<Service> {
        return await this.repository.findServicesById(id);
    }

    async deleteServicesById(id: string): Promise<string> {
        return await this.repository.deleteServicesById(id);
    }
}
