import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export default class ServiceDto {
    @ApiProperty()
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    name: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    desc: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    rate: number;
}
