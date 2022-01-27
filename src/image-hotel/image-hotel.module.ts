import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageHotelRepository } from './imageHotel.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ImageHotelRepository])],
    exports: [TypeOrmModule],
})
export class ImageHotelModule {}
