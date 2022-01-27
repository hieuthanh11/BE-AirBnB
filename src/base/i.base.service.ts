import { EntityId } from 'typeorm/repository/EntityId';
import { DeepPartial, DeleteResult } from 'typeorm';

export interface IBaseService<T> {
    getAll(): Promise<T[]>;

    findById(id: EntityId): Promise<T>;

    findByIds(id: [EntityId]): Promise<T[]>;

    createData(data: DeepPartial<T>): Promise<T>;

    update(id: EntityId, data: DeepPartial<T>): Promise<T>;

    deleteById(id: EntityId): Promise<DeleteResult>;
}
