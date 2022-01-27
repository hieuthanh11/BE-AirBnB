import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
export class RoomTicketDTO {
    @ApiProperty()
    @AutoMap()
    @Column()
    priceRoom: number;

    @ApiProperty()
    @AutoMap()
    @Column()
    discount: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    priceDiscount: number;

    @ApiProperty()
    @AutoMap()
    @Column()
    maPhong: number;

    @ApiProperty()
    @AutoMap()
    @Column()
    hotelName: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    hostName: string;
}
export default class TicketDTO {
    @ApiProperty()
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    price: number;

    @ApiProperty()
    @AutoMap()
    @Column()
    startDate: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    endDate: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    name: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    status: string;

    @ApiProperty()
    @AutoMap()
    @Column()
    isPayment: boolean;
    // roomTicket
    @ApiProperty({ type: [RoomTicketDTO] })
    @AutoMap({ typeFn: () => RoomTicketDTO })
    @Column()
    roomTicket: RoomTicketDTO[];
}
