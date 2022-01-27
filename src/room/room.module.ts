import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RoomRepository } from './room.repository';

@Module({
    imports: [TypeOrmModule.forFeature([RoomRepository])],
    exports: [TypeOrmModule],
})
export class RoomModule {}
