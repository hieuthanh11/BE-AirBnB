import { EntityRepository, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
    public async findByName(name: string): Promise<Role> {
        return await this.createQueryBuilder('roles')
            .where('roles.role = :role', { role: name })
            .getOne();
    }

    public async findByRoleId(id: string): Promise<Role> {
        return await this.createQueryBuilder('roles')
            .where('roles.id = :role', { role: id })
            .getOne();
    }
    public async deleteRoleById(id: string): Promise<string> {
        await this.createQueryBuilder().delete().from(Role).where('id = :id', { id: id }).execute();
        return `Delete Successfully ${id}`;
    }
}
