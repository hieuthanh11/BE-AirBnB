import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/users/user.repository';
import { HotelRepository } from './hotel.repository';

@Module({
    imports: [TypeOrmModule.forFeature([HotelRepository, UsersRepository])],
    exports: [TypeOrmModule],
})
export class HotelModule {}
