import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityRoot } from 'src/base/base.entity.root';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'roles' })
export class Role extends BaseEntityRoot {
    @AutoMap()
    @ApiProperty()
    @Column()
    role: string;
    @AutoMap()
    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
