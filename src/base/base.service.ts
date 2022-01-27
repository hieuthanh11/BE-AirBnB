import { BaseEntity, DeepPartial, DeleteResult, Repository } from 'typeorm';
import { IBaseService } from './i.base.service';
import { EntityId } from 'typeorm/repository/EntityId';
import { LoggerService } from 'src/logger/custom.logger';

export class BaseService<T extends BaseEntity, R extends Repository<T>> implements IBaseService<T> {
    protected readonly repository: R;
    protected readonly logger: LoggerService;

    constructor(repository: R, logger: LoggerService) {
        this.repository = repository;
        this.logger = logger;
    }

    async getAll(): Promise<T[]> {
        return await this.repository.find();
    }

    findById(id: EntityId): Promise<T> {
        return this.repository.findOne({ where: { id: id } });
    }

    findByIds(ids: [EntityId]): Promise<T[]> {
        return this.repository.findByIds(ids);
    }

    createData(data: DeepPartial<T>): Promise<T> {
        return this.repository.save(data);
    }

    async update(id: EntityId, data: DeepPartial<T>): Promise<T> {
        await this.repository.update(id, data);
        return this.findById(id);
    }

    deleteById(id: EntityId): Promise<DeleteResult> {
        return this.repository.delete(id);
    }
}
