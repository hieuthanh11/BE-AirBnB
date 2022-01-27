/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseInterceptors,
    Query,
    Patch,
    BadRequestException,
} from '@nestjs/common';
import { ImageroomService } from './imageroom.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorator/roles.decorator';
import { Role_ENUM } from 'src/roles/roles.enum';
import { ImageRoomDto } from './dto/imageroom.dto';
import { Public } from 'src/decorator/isPublic';
import { ApiListResponse } from 'src/base/api.list.response';
import { IPaginateResponse, paginateResponse } from 'src/base/filter.pagination.base';
import { FormDataRequest } from 'nestjs-form-data';

import { MultipleFilesFormDataDTO } from './dto/multiplefile-image-imageroom.dto';
import { FilterPaginationImageRoom } from './dto/filter.imageroom.extends';
import { FileToBodyInterceptor } from 'src/interceptor/files.interceptor';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileImageUploadDto } from 'src/file/file.dto';
import { MapInterceptor } from '@automapper/nestjs';
import { Imageroom } from './entities/imageroom.entity';
const imgbbUploader = require('imgbb-uploader');

@ApiBearerAuth()
@Controller('imageroom')
@ApiTags('ImageRoom')
export class ImageroomController {
    constructor(private readonly imageroomService: ImageroomService) {}

    @Roles(Role_ENUM.HOST)
    @ApiBody({ type: MultipleFilesFormDataDTO })
    @Post('/upload')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('images'), new FileToBodyInterceptor())
    async uploadMultipleFiles(@Body() body: MultipleFilesFormDataDTO): Promise<string> {
        // @ts-ignore
        const arrfile: string[] = [];
        for (const item of body.images) {
            if (!item.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                throw new BadRequestException('Wrong path file');
            }
        }
        for (const f of body.images) {
            const contents = Buffer.from(f.buffer).toString('base64');
            const option: { apiKey: string; base64string: string } = {
                apiKey: process.env.IMAGE_KEY,
                base64string: contents,
            };
            const data: { display_url: string } = (await imgbbUploader(option)) as {
                display_url: string;
            };
            arrfile.push(data.display_url);
        }
        return this.imageroomService.importImageRoom(body, arrfile);
    }

    @Public()
    @Get('/pagination')
    @ApiListResponse(ImageRoomDto)
    async findAllRefactor(
        @Query() payable: FilterPaginationImageRoom,
    ): Promise<IPaginateResponse<ImageRoomDto> | { message: string }> {
        const [result, count] = await this.imageroomService.getAllImageRoom(
            payable.sizePage as number,
            payable.numberPage as number,
            payable.maPhong,
        );
        if (count == 0) {
            return { message: `No Data ImageRoom with MaPhong ${payable.maPhong}` };
        }
        return paginateResponse<ImageRoomDto>(
            [result, count],
            payable.numberPage as number,
            payable.sizePage as number,
        );
    }

    @Roles(Role_ENUM.HOST)
    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get detail Image by ID',
        type: ImageRoomDto,
    })
    @UseInterceptors(MapInterceptor(ImageRoomDto, Imageroom))
    async findOne(@Param('id') idImage: string): Promise<Imageroom> {
        return await this.imageroomService.getImageById(idImage);
    }

    @Roles(Role_ENUM.HOST)
    @Patch(':id')
    @ApiConsumes('multipart/form-data')
    @FormDataRequest()
    @ApiBody({
        description: 'Update Image Room',
        type: FileImageUploadDto,
    })
    async updateImage(@Param('id') id: string, @Body() file: FileImageUploadDto): Promise<string> {
        // @ts-ignore
        const contents = Buffer.from(file.image.buffer).toString('base64');
        const options: { apiKey: string; base64string: string } = {
            apiKey: process.env.IMAGE_KEY,
            base64string: contents,
        };
        const data: { display_url: string } = (await imgbbUploader(options)) as {
            display_url: string;
        };
        return await this.imageroomService.updateImagesRoom(data.display_url, id);
    }

    @Roles(Role_ENUM.HOST)
    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'Delete imageroom by id',
        type: String,
    })
    async remove(@Param('id') id: string): Promise<string> {
        return await this.imageroomService.deleteImageRoomById(id);
    }

    @Roles(Role_ENUM.HOST)
    @Public()
    @Delete(':id/deleteAll')
    @ApiResponse({
        status: 200,
        description: 'Delete ImagesRomm By roomId',
        type: String,
    })
    @ApiParam({
        name: 'id',
        description: 'RoomId by RoomEntity',
    })
    async removeAllImagesRoom(@Param('id') roomId: string): Promise<string> {
        return await this.imageroomService.deleteAllImagesRoomById(roomId);
    }
}
