import { EntityRepository, Repository } from 'typeorm';
import { Status } from './entities/status.entity';
@EntityRepository(Status)
export class StatusRepository extends Repository<Status> {
    public async findStatusByName(name: string): Promise<Status> {
        return await this.createQueryBuilder('status')
            .where('status.status = :status', { status: name })
            .getOne();
    }

    public async findStatusById(id: string): Promise<Status> {
        return await this.createQueryBuilder('status')
            .where('status.id = :status', { status: id })
            .getOne();
    }

    public async deleteStatusById(id: string): Promise<string> {
        await this.createQueryBuilder()
            .delete()
            .from(Status)
            .where('id = :id', { id: id })
            .execute();
        return `Delete Successfully ${id}`;
    }
}
