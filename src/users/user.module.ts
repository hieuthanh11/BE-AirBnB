import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { RoleRepository } from 'src/roles/roles.repository';
import { StatusRepository } from 'src/status/status.repository';
@Module({
    imports: [TypeOrmModule.forFeature([UsersRepository, RoleRepository, StatusRepository])],
    exports: [TypeOrmModule],
})
export class UsersModule {}
