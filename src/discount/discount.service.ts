import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { DiscountRepository } from './discount.repository';
import { LoggerService } from 'src/logger/custom.logger';
import { Discount } from './entities/discount.entity';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { StatusService } from 'src/status/status.service';
import { Status_ENUM } from 'src/status/status.enum';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Payload } from 'src/core/Payload/payload';
import { UsersService } from 'src/users/users.service';
import { DiscountRoomDto } from './dto/discount-room.dto';

@Injectable()
export class DiscountService extends BaseService<Discount, DiscountRepository> {
    constructor(
        repository: DiscountRepository,
        logger: LoggerService,
        private statusService: StatusService,
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {
        super(repository, logger);
    }

    async getAllDiscount(
        sizePage: number,
        numberPage: number,
        statusName: string,
    ): Promise<[DiscountRoomDto[], number]> {
        const [result, count] = await this.repository.getAllDiscount(
            sizePage,
            numberPage,
            statusName,
        );
        const discountDTO: DiscountRoomDto[] = [];
        for (const item of result) {
            discountDTO.push(this.mapper.map(item, DiscountRoomDto, Discount));
        }
        return [discountDTO, count];
    }

    async getDiscountById(id: string): Promise<Discount> {
        return await this.repository.findDiscountById(id);
    }

    async createDiscount(data: CreateDiscountDto, userPayload: Payload): Promise<string> {
        const status = await this.statusService.findStatusByName(Status_ENUM.AVAILABLE);
        const user = await this.userService.getUserById(userPayload.id);
        return await this.repository.createDiscount(data, status, user);
    }

    async findByPrice(price: number): Promise<Discount> {
        return await this.repository.findDiscountByPrice(price);
    }

    async findByDesc(desc: string): Promise<Discount> {
        return await this.repository.findDiscountByDesc(desc);
    }

    async findByExp(exp: string): Promise<Discount> {
        return await this.repository.findDiscountByExp(exp);
    }

    async deleteDiscountById(id: string): Promise<string> {
        return await this.repository.deleteDiscountById(id);
    }

    async updateDiscountById(id: string, data: UpdateDiscountDto): Promise<string> {
        return await this.repository.updateDiscountById(id, data);
    }

    async updateStatusOfDiscountById(id: string, statusName: string): Promise<string> {
        const status = await this.statusService.findStatusByName(statusName);
        return await this.repository.updateStatusOfDiscountById(id, status);
    }
}
