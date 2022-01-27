import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { LoggerService } from 'src/logger/custom.logger';
import { RoomService } from 'src/room/room.service';
import { MultipleFilesFormDataDTO } from './dto/multiplefile-image-imageroom.dto';
import { ImageRoomDto } from './dto/imageroom.dto';
import { Imageroom } from './entities/imageroom.entity';
import { ImageRoomRepository } from './imageroom.repository';

@Injectable()
export class ImageroomService extends BaseService<Imageroom, ImageRoomRepository> {
    constructor(
        repository: ImageRoomRepository,
        logger: LoggerService,
        private roomService: RoomService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {
        super(repository, logger);
    }

    async importImageRoom(data: MultipleFilesFormDataDTO, arrfile: string[]): Promise<string> {
        const room = await this.roomService.findById(data.roomId);
        if (room == undefined) {
            throw new BadRequestException(`${data.roomId} is not found`);
        }
        return await this.repository.importImageRoom(room, arrfile);
    }

    async getAllImageRoom(
        sizePage: number,
        numberPage: number,
        maPhong: number,
    ): Promise<[ImageRoomDto[], number]> {
        const [result, count] = await this.repository.getAllImageRoom(
            sizePage,
            numberPage,
            maPhong,
        );
        const imageRoomDto: ImageRoomDto[] = [];
        for (const item of result) {
            imageRoomDto.push(this.mapper.map(item, ImageRoomDto, Imageroom));
        }
        return [imageRoomDto, count];
    }

    async getImageById(idImage: string): Promise<Imageroom> {
        return await this.repository.getImageById(idImage);
    }

    async deleteImageRoomById(id: string): Promise<string> {
        return await this.repository.deleteImageRoomById(id);
    }

    async updateImagesRoom(file: string, id: string): Promise<string> {
        return await this.repository.updateImageRoomById(file, id);
    }

    async deleteAllImagesRoomById(roomId: string): Promise<string> {
        const listImageRooms: Imageroom[] = await this.repository.getImageRoomByRoomId(roomId);
        await this.repository.deleteAllImagesRoomById(listImageRooms, roomId);
        return;
    }
}
