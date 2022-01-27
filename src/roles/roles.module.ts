import { Module } from '@nestjs/common';
import { RoleRepository } from './roles.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([RoleRepository])],
    exports: [TypeOrmModule],
})
export class RolesModule {}
