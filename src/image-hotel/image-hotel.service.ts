/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { LoggerService } from 'src/logger/custom.logger';
import { HotelService } from 'src/hotel/hotel.service';
import { ImageHotel } from './entities/image-hotel.entity';
import { ImageHotelRepository } from './imageHotel.repository';
import { MultipleFilesFormDataHotelDTO } from './dto/multiplefile-image-hotel.dto';
import { ImageHotelDto } from './dto/image-hotel.dto';

@Injectable()
export class ImageHotelService extends BaseService<ImageHotel, ImageHotelRepository> {
    constructor(
        repository: ImageHotelRepository,
        logger: LoggerService,
        private hotelService: HotelService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {
        super(repository, logger);
    }

    async createImageForHotel(
        data: MultipleFilesFormDataHotelDTO,
        arrfile: string[],
    ): Promise<string> {
        const hotel = await this.hotelService.findById(data.hotelId);
        if (hotel == undefined) {
            throw new BadRequestException(`${data.hotelId} is not found`);
        }
        return await this.repository.createImageForHotel(hotel, arrfile);
    }

    async getAllImageHotelPagination(
        sizePage: number,
        numberPage: number,
        name: string,
        sortBy: string,
    ): Promise<[ImageHotelDto[], number]> {
        const [result, count] = await this.repository.getAllImageHotelPagination(
            sizePage,
            numberPage,
            name,
            sortBy,
        );
        const imageHotelDto: ImageHotelDto[] = [];
        for (const item of result) {
            imageHotelDto.push(this.mapper.map(item, ImageHotelDto, ImageHotel));
        }
        return [imageHotelDto, count];
    }

    async deleteImageHotelById(id: string): Promise<string> {
        return await this.repository.deleteImageHotelById(id);
    }

    async updateImagesHotel(file: string, id: string): Promise<string> {
        return await this.repository.updateImageHotelById(file, id);
    }

    async getAllImage(): Promise<ImageHotel[]> {
        return await this.repository.getAllImage();
    }

    async getImageById(idImage: string): Promise<ImageHotel> {
        return await this.repository.getImageById(idImage);
    }

    async removeAllImageOfHotelID(idHotel: string): Promise<string> {
        return await this.repository.removeAllImageOfHotelID(idHotel);
    }
}
