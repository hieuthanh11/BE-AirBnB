import { EntityRepository, Repository } from 'typeorm';
import { Util } from './entities/util.entity';

@EntityRepository(Util)
export class UtilsRepository extends Repository<Util> {
    public async findUtilsById(id: string): Promise<Util> {
        return await this.createQueryBuilder('utils')
            .where('utils.id = :utils', { utils: id })
            .getOne();
    }

    public async deleteUtilsById(id: string): Promise<string> {
        await this.createQueryBuilder().delete().from(Util).where('id = :id', { id: id }).execute();
        return `Delete Successfully ${id}`;
    }
}
