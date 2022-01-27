import { Module } from '@nestjs/common';
import { ImageRoomRepository } from './imageroom.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ImageRoomRepository])],
    exports: [TypeOrmModule],
})
export class ImageroomModule {}
