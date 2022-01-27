import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export default class UserDto {
    @ApiProperty()
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    firstName: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    lastName: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    fullName: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    userName: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    dob: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    phone: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    email: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    avatar: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    role: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    status: string;
}

export class AvatarUser {
    @ApiProperty()
    @AutoMap()
    @Column()
    avatarImg: string;
}
