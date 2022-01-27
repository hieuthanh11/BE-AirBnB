import { Room } from 'src/room/entities/room.entity';
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { BaseService } from 'src/base/base.service';
import { RoomRepository } from './room.repository';
import { LoggerService } from 'src/logger/custom.logger';
import { StatusService } from 'src/status/status.service';
import { HotelService } from 'src/hotel/hotel.service';
import { User } from 'src/users/entities/user.entity';
import { Status } from 'src/status/entities/status.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { UtilsService } from 'src/utils/utils.service';
import { DiscountService } from 'src/discount/discount.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Discount } from 'src/discount/entities/discount.entity';
import { ListUtilID } from 'src/utils/dto/create-util.dto';
import { Util } from 'src/utils/entities/util.entity';
import RoomDto from './dto/room.dto';
import { DiscountID } from 'src/utils/dto/create-discount-dto';

@Injectable()
export class RoomService extends BaseService<Room, RoomRepository> {
    constructor(
        repository: RoomRepository,
        logger: LoggerService,
        private statusServices: StatusService,
        @Inject(forwardRef(() => HotelService))
        private hotelServices: HotelService,
        private utilsServices: UtilsService,
        private discountServices: DiscountService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {
        super(repository, logger);
    }
    async createRoom(data: CreateRoomDto, user: User): Promise<Room> {
        const status = await this.statusServices.findStatusById(data.statusId);
        const hotel = await this.hotelServices.getHotelById(data.hotelId);
        const discount = await this.discountServices.getDiscountById(data.discountId);

        if (!hotel) {
            throw new BadRequestException(`Hotel not found with ID : ${data.hotelId}`);
        }

        if (user.id !== hotel.user.id) {
            throw new BadRequestException(`You not owner this hotel ${hotel.name}`);
        }
        const listUtil: Util[] = [];
        for (const { idUtil } of data.utils) {
            const itemUtil: Util = await this.utilsServices.findUtilsById(idUtil);
            listUtil.push(itemUtil);
        }

        return await this.repository.createRoom(data, status, hotel, listUtil, discount);
    }

    async getAllRoom(): Promise<Room[]> {
        return await this.repository.getAllRoom();
    }

    async getAllRoomById(idHotel: string, user: User): Promise<Room[]> {
        const hotel: Hotel = await this.hotelServices.getHotelById(idHotel);
        if (user.id !== hotel.user.id) {
            throw new BadRequestException(`You not owner this hotel ${hotel.name}`);
        }
        return await this.repository.getAllRoomById(idHotel);
    }

    async getRoomById(id: string): Promise<Room> {
        return await this.repository.getRoomById(id);
    }

    async updateRoom(
        idRoom: string,
        data: UpdateRoomDto,
        user: User,
        idHotel: string,
    ): Promise<string> {
        const status: Status = await this.statusServices.findStatusById(data.statusId);
        const hotel: Hotel = await this.hotelServices.getHotelById(idHotel);
        const discount: Discount = await this.discountServices.getDiscountById(data.discountId);
        if (user.id !== hotel.user.id) {
            throw new BadRequestException(`You not owner this hotel ${hotel.name}`);
        }
        return await this.repository.updateRoom(idRoom, data, status, hotel, discount);
    }

    async updateRoomStatus(status: Status, idRoom: string): Promise<string> {
        return await this.repository.updateStatus(status, idRoom);
    }

    async addUtilRoom(idRoom: string, data: ListUtilID): Promise<string> {
        const room: Room = await this.repository.getRoomById(idRoom);
        const listUtil: Util[] = [];
        const nameUtil: string[] = [];
        for (const item of room.utils) {
            for (const { idUtil } of data.utils) {
                const itemUtil: Util = await this.utilsServices.findUtilsById(idUtil);
                if (item.id === itemUtil.id) {
                    nameUtil.push(item.name);
                } else {
                    listUtil.push(itemUtil);
                }
            }
        }

        if (nameUtil.length > 0) {
            let itemUtilStr = '';
            for (const item of nameUtil) {
                if (nameUtil.length > 1) {
                    itemUtilStr += item + ' & ';
                } else {
                    itemUtilStr += item;
                }
            }
            itemUtilStr = itemUtilStr.substring(0, itemUtilStr.lastIndexOf('&'));

            throw new BadRequestException(`${itemUtilStr} has already in room ( ${room.maPhong} )`);
        }

        return await this.repository.addUtil(idRoom, data);
    }

    async removeUtilRoom(idRoom: string, data: ListUtilID): Promise<string> {
        return await this.repository.removeUtil(idRoom, data);
    }

    async deleteRoomById(id: string): Promise<string> {
        return await this.repository.deleteRoomById(id);
    }

    async getAllPagination(
        sizePage: number,
        numberPage: number,
        maPhong: number,
        sortBy: string,
    ): Promise<[RoomDto[], number]> {
        const [result, count] = await this.repository.getAllRoomPagination(
            sizePage,
            numberPage,
            maPhong,
            sortBy,
        );
        const roomDto: RoomDto[] = [];
        for (const item of result) {
            roomDto.push(this.mapper.map(item, RoomDto, Room));
        }
        return [roomDto, count];
    }

    async updateDiscountRoom(idRoom: string, data: DiscountID): Promise<string> {
        const discount: Discount = await this.discountServices.getDiscountById(data.idDiscount);
        if (!discount) {
            throw new BadRequestException(`discount not found ${data.idDiscount}`);
        }
        return await this.repository.updateDiscount(idRoom, discount);
    }

    async removeDiscountRoom(idRoom: string): Promise<string> {
        const discount: Discount = await this.discountServices.findByPrice(0);
        return await this.repository.removeDiscount(idRoom, discount);
    }
}
