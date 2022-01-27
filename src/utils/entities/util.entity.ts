import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityRoot } from 'src/base/base.entity.root';
import { Room } from 'src/room/entities/room.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'utils' })
export class Util extends BaseEntityRoot {
    @AutoMap()
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    name: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    desc: string;

    @AutoMap()
    @ApiProperty()
    @Column()
    rate: number;

    @ManyToMany(() => Room, (room) => room.utils, {
        cascade: true,
    })
    @JoinTable({
        name: 'room_util',
    })
    rooms: Room[];
}
