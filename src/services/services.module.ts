import { Module } from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ServicesRepository])],
    exports: [TypeOrmModule],
})
export class ServicesModule {}
