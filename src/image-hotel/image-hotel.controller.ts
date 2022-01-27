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
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorator/roles.decorator';
import { Role_ENUM } from 'src/roles/roles.enum';
import { Public } from 'src/decorator/isPublic';
import { ApiListResponse } from 'src/base/api.list.response';
import { IPaginateResponse, paginateResponse } from 'src/base/filter.pagination.base';
import { FormDataRequest } from 'nestjs-form-data';
import { FileUploadDto } from 'src/file/file.dto';

import { FilesInterceptor } from '@nestjs/platform-express';

import { MultipleFilesFormDataHotelDTO } from './dto/multiplefile-image-hotel.dto';
import { ImageHotelDto } from './dto/image-hotel.dto';
import { FilterPaginationHotel } from './dto/filter-image-hotel.extends';
import { Sort } from 'src/base/orderby.enum';
import { ImageHotel } from './entities/image-hotel.entity';
import { MapInterceptor } from '@automapper/nestjs';
import { ImageHotelService } from './image-hotel.service';
import { FileToBodyInterceptor } from 'src/interceptor/files.interceptor';
const imgbbUploader = require('imgbb-uploader');

@Roles(Role_ENUM.HOST)
@ApiBearerAuth()
@Controller('imageHotel')
@ApiTags('Image Hotel')
export class ImageHotelController {
    constructor(private readonly imageHotelService: ImageHotelService) {}

    @ApiBody({ type: MultipleFilesFormDataHotelDTO })
    @ApiResponse({
        status: 201,
        description: 'Upload Image Hotel Successfully',
        type: String,
    })
    @Post('/upload')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('images'), new FileToBodyInterceptor())
    async uploadMultipleFiles(@Body() body: MultipleFilesFormDataHotelDTO): Promise<string> {
        const arrfile: string[] = [];
        for (const fileUpload of body.images) {
            if (!fileUpload.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                throw new BadRequestException('Wrong path image, Must be real path of image');
            }
            const contents = Buffer.from(fileUpload.buffer).toString('base64');
            const option: { apiKey: string; base64string: string } = {
                apiKey: process.env.IMAGE_KEY,
                base64string: contents,
            };
            const data: { display_url: string } = (await imgbbUploader(option)) as {
                display_url: string;
            };
            arrfile.push(data.display_url);
        }
        return this.imageHotelService.createImageForHotel(body, arrfile);
    }

    @Public()
    @Get('/pagination')
    @ApiQuery({ name: 'sortBy', enum: Sort })
    @ApiResponse({
        status: 200,
        description: 'Get Image Hotel Pagination',
        type: [ImageHotelDto],
    })
    @ApiListResponse(ImageHotelDto)
    async findAllRefactor(
        @Query() filterBy: FilterPaginationHotel,
        @Query('sortBy') sortBy: string,
    ): Promise<IPaginateResponse<ImageHotelDto> | { message: string }> {
        const [result, count] = await this.imageHotelService.getAllImageHotelPagination(
            filterBy.sizePage as number,
            filterBy.numberPage as number,
            filterBy.name,
            sortBy,
        );
        if (count == 0) {
            return { message: 'No Data Image Hotel with Hotel' };
        }
        return paginateResponse<ImageHotelDto>(
            [result, count],
            filterBy.numberPage as number,
            filterBy.sizePage as number,
        );
    }

    @Public()
    @Get()
    @ApiResponse({
        status: 200,
        description: 'Get All Image of Hotel',
        type: [ImageHotelDto],
    })
    @UseInterceptors(
        MapInterceptor(ImageHotelDto, ImageHotel, {
            isArray: true,
        }),
    )
    async findAll(): Promise<ImageHotel[] | { message: string }> {
        const listIMG = await this.imageHotelService.getAllImage();
        if (listIMG.length == 0) {
            return { message: 'No Data Image Hotel' };
        }
        return listIMG;
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get detail Image by ID',
        type: ImageHotelDto,
    })
    @UseInterceptors(MapInterceptor(ImageHotelDto, ImageHotel))
    async findOne(@Param('id') idImage: string): Promise<ImageHotel> {
        return await this.imageHotelService.getImageById(idImage);
    }

    @Patch(':id')
    @ApiConsumes('multipart/form-data')
    @FormDataRequest()
    @ApiResponse({
        status: 200,
        description: 'Update Image Hotel by id',
        type: String,
    })
    @ApiBody({
        description: 'Update Image Hotel',
        type: FileUploadDto,
    })
    async updateImageHotel(@Param('id') id: string, @Body() file: FileUploadDto): Promise<string> {
        if (!file.avatar.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            throw new BadRequestException('Wrong path image, Must be real path of image');
        }
        // @ts-ignore
        const contents = Buffer.from(file.avatar.buffer).toString('base64');
        const options: { apiKey: string; base64string: string } = {
            apiKey: process.env.IMAGE_KEY,
            base64string: contents,
        };
        const data: { display_url: string } = (await imgbbUploader(options)) as {
            display_url: string;
        };
        return await this.imageHotelService.updateImagesHotel(data.display_url, id);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'Delete Image Hotel by ID',
        type: String,
    })
    async remove(@Param('id') id: string): Promise<string> {
        return await this.imageHotelService.deleteImageHotelById(id);
    }

    @Delete('/removeAllImage/:id')
    @ApiResponse({
        status: 200,
        description: 'Remove all Image of Hotel by ID',
        type: String,
    })
    async removeAllImageOfHotelID(@Param('id') idHotel: string): Promise<string> {
        return await this.imageHotelService.removeAllImageOfHotelID(idHotel);
    }
}
