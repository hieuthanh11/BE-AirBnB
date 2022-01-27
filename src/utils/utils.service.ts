import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { LoggerService } from 'src/logger/custom.logger';
import { Util } from './entities/util.entity';

import { UtilsRepository } from './utils.repository';

@Injectable()
export class UtilsService extends BaseService<Util, UtilsRepository> {
    constructor(repository: UtilsRepository, logger: LoggerService) {
        super(repository, logger);
    }

    async findUtilsById(id: string): Promise<Util> {
        return await this.repository.findUtilsById(id);
    }

    async deleteUtilsById(id: string): Promise<string> {
        return await this.repository.deleteUtilsById(id);
    }
}
