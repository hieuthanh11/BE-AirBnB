import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountRepository } from './discount.repository';

@Module({
    imports: [TypeOrmModule.forFeature([DiscountRepository])],
    exports: [TypeOrmModule],
})
export class DiscountModule {}
