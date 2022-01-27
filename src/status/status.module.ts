import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusRepository } from './status.repository';

@Module({
    imports: [TypeOrmModule.forFeature([StatusRepository])],
    exports: [TypeOrmModule],
})
export class StatusModule {}
