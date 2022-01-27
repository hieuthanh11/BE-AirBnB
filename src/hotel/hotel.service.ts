import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { forwardRef, Inject, Injectable, BadRequestException } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { Payload } from 'src/core/Payload/payload';
import { LoggerService } from 'src/logger/custom.logger';
import { RoomService } from 'src/room/room.service';
import { ListServiceID } from 'src/services/dto/create-service.dto';
import { Service } from 'src/services/entities/service.entity';

import { ServicesService } from 'src/services/services.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { CreateHotelDTO } from './dto/create-hotel.dto';
import HotelDto from './dto/hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from './entities/hotel.entity';
import { HotelRepository } from './hotel.repository';

@Injectable()
export class HotelService extends BaseService<Hotel, HotelRepository> {
    constructor(
        @Inject(forwardRef(() => RoomService))
        private roomService: RoomService,
        repository: HotelRepository,
        logger: LoggerService,
        @Inject(forwardRef(() => UsersService))
        private userServices: UsersService,
        private servicesService: ServicesService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {
        super(repository, logger);
    }
    async createHotel(data: CreateHotelDTO, userPayload: User): Promise<string> {
        const user: User = await this.userServices.getUserById(userPayload.id);
        const listService: Service[] = [];
        for (const { idService } of data.services) {
            const itemService: Service = await this.servicesService.findById(idService);
            listService.push(itemService);
        }
        return await this.repository.createNewHotel(data, user, listService);
    }

    async getAllHotelById(user: User): Promise<Hotel[]> {
        return await this.repository.getAllHotelById(user.id);
    }

    async getAllHotel(): Promise<Hotel[]> {
        return await this.repository.getAllHotel();
    }

    async getHotelById(idHotel: string): Promise<Hotel> {
        return await this.repository.getHotelById(idHotel);
    }

    async updateHotelById(id: string, data: UpdateHotelDto, user: User): Promise<string> {
        const hotel: Hotel = await this.repository.getHotelById(id);
        if (user.id !== hotel.user.id) {
            throw new BadRequestException(`You not owner this hotel ${hotel.name}`);
        }
        return await this.repository.updateHotel(id, data);
    }

    async addServiceHotel(idHotel: string, data: ListServiceID, user: User): Promise<string> {
        const hotel: Hotel = await this.repository.getHotelById(idHotel);
        const nameServices: string[] = [];
        const listService: Service[] = [];
        for (const item of hotel.services) {
            for (const { idService } of data.services) {
                const itemService: Service = await this.servicesService.findServicesById(idService);
                if (item.id === itemService.id) {
                    nameServices.push(itemService.name);
                } else {
                    listService.push(itemService);
                }
            }
        }

        if (nameServices.length > 0) {
            let itemServiceStr = '';
            for (const item of nameServices) {
                if (nameServices.length > 1) {
                    itemServiceStr += item + ' & ';
                } else {
                    itemServiceStr += item;
                }
            }
            itemServiceStr = itemServiceStr.substring(0, itemServiceStr.lastIndexOf('&'));

            throw new BadRequestException(
                `${itemServiceStr} has already in hotel ( ${hotel.name} )`,
            );
        }
        if (user.id !== hotel.user.id) {
            throw new BadRequestException(`You not owner this hotel ${hotel.name}`);
        }
        return await this.repository.addService(idHotel, data);
    }

    async removeServiceHotel(idHotel: string, data: ListServiceID, user: User): Promise<string> {
        const hotel: Hotel = await this.repository.getHotelById(idHotel);
        if (user.id !== hotel.user.id) {
            throw new BadRequestException(`You not owner this hotel ${hotel.name}`);
        }
        return await this.repository.removeService(idHotel, data);
    }

    async deleteHotelById(id: string, user: Payload): Promise<string> {
        const hotel: Hotel = await this.repository.getHotelById(id);
        if (user.id !== hotel.user.id) {
            throw new BadRequestException(`You not owner this hotel ${hotel.name}`);
        }
        return await this.repository.deleteHotelById(id);
    }

    async getAllPagination(
        sizePage: number,
        numberPage: number,
        name: string,
        address: string,
        sortBy: string,
    ): Promise<[HotelDto[], number]> {
        const [result, count] = await this.repository.getAllHotelPagination(
            sizePage,
            numberPage,
            name,
            address,
            sortBy,
        );
        const hotelDto: HotelDto[] = [];
        for (const item of result) {
            hotelDto.push(this.mapper.map(item, HotelDto, Hotel));
        }
        return [hotelDto, count];
    }
}
