import { EntityRepository, Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@EntityRepository(Service)
export class ServicesRepository extends Repository<Service> {
    public async findServicesById(id: string): Promise<Service> {
        return await this.createQueryBuilder('services')
            .where('services.id = :services', { services: id })
            .getOne();
    }

    public async deleteServicesById(id: string): Promise<string> {
        await this.createQueryBuilder()
            .delete()
            .from(Service)
            .where('id = :id', { id: id })
            .execute();
        return `Delete Successfully ${id}`;
    }
}
