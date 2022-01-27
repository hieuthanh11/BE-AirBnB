import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketRepository } from './ticket.repository';

@Module({
    imports: [TypeOrmModule.forFeature([TicketRepository])],
    exports: [TypeOrmModule],
})
export class TicketModule {}
