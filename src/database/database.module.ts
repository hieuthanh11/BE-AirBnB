import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Room } from 'src/room/entities/room.entity';
import { Service } from 'src/services/entities/service.entity';
import { RoomTicket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
config();
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DB_NAME,
            entities: [User, Role, Hotel, Service, Room, RoomTicket],
            synchronize: true,
            autoLoadEntities: true,
        }),
    ],
})
export class DatabaseModule {}
