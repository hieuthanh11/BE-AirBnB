import { Module } from '@nestjs/common';
import { UtilsRepository } from './utils.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([UtilsRepository])],
    exports: [TypeOrmModule],
})
export class UtilsModule {}
