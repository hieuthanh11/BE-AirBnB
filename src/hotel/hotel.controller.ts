import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    Query,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorator/roles.decorator';
import { Role_ENUM } from 'src/roles/roles.enum';
import HotelDto from './dto/hotel.dto';
import { MapInterceptor } from '@automapper/nestjs';
import { Hotel } from './entities/hotel.entity';
import { GetUser } from 'src/decorator/decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateHotelDTO } from './dto/create-hotel.dto';
import { ListServiceID } from 'src/services/dto/create-service.dto';
import { Public } from 'src/decorator/isPublic';
import { Sort } from 'src/base/orderby.enum';
import { ApiListResponse } from 'src/base/api.list.response';
import { FilterPaginationHotel } from './dto/filter-hotel-extends';
import { IPaginateResponse, paginateResponse } from 'src/base/filter.pagination.base';
import { Payload } from 'src/core/Payload/payload';

@ApiBearerAuth()
@Controller('hotels')
@ApiTags('Hotel')
export class HotelController {
    constructor(private readonly hotelService: HotelService) {}
    @Roles(Role_ENUM.HOST)
    @ApiResponse({
        status: 201,
        description: 'Created new hotel successfully',
        type: String,
    })
    @Post('/create')
    create(@GetUser() user: User, @Body() createHotelDTO: CreateHotelDTO): Promise<string> {
        return this.hotelService.createHotel(createHotelDTO, user);
    }

    @Public()
    @Get('/pagination')
    @ApiQuery({ name: 'sortBy', enum: Sort })
    @ApiListResponse(HotelDto)
    async findAllHotelPagination(
        @Query() payable: FilterPaginationHotel,
        @Query('sortBy') sortBy: string,
    ): Promise<IPaginateResponse<HotelDto> | { message: string }> {
        const [result, count] = await this.hotelService.getAllPagination(
            payable.sizePage as number,
            payable.numberPage as number,
            payable.name,
            payable.address,
            sortBy,
        );
        if (count == 0) {
            return { message: 'No Data Hotel' };
        }
        return paginateResponse<HotelDto>(
            [result, count],
            payable.numberPage as number,
            payable.sizePage as number,
        );
    }

    @Public()
    @Get()
    @ApiResponse({
        status: 200,
        description: 'Get all Hotel',
        type: [HotelDto],
    })
    @UseInterceptors(
        MapInterceptor(HotelDto, Hotel, {
            isArray: true,
        }),
    )
    async findAll(): Promise<Hotel[] | { message: string }> {
        const listHotel = await this.hotelService.getAllHotel();

        if (listHotel.length == 0) {
            return { message: 'No Data Hotel' };
        }
        return listHotel;
    }

    @Roles(Role_ENUM.HOST)
    @Get('/getAll/host')
    @ApiResponse({
        status: 200,
        description: 'Get all Hotel By Id',
        type: [HotelDto],
    })
    @UseInterceptors(
        MapInterceptor(HotelDto, Hotel, {
            isArray: true,
        }),
    )
    async findAllHotelById(@GetUser() user: User): Promise<Hotel[] | { message: string }> {
        const listHotel = await this.hotelService.getAllHotelById(user);
        if (listHotel.length == 0) {
            return { message: 'No Data Hotel' };
        }
        return listHotel;
    }

    @Roles(Role_ENUM.HOST)
    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get detail Hotel by ID',
        type: HotelDto,
    })
    @UseInterceptors(MapInterceptor(HotelDto, Hotel))
    async findOne(@Param('id') idHotel: string): Promise<Hotel> {
        return await this.hotelService.getHotelById(idHotel);
    }

    @Roles(Role_ENUM.HOST)
    @Patch(':id')
    @ApiBody({ type: UpdateHotelDto })
    @ApiResponse({
        status: 200,
        description: 'Update a Hotel by id',
        type: HotelDto,
    })
    async update(
        @Param('id') id: string,
        @Body() updateHotelDto: UpdateHotelDto,
        @GetUser() user: User,
    ): Promise<string> {
        return await this.hotelService.updateHotelById(id, updateHotelDto, user);
    }

    @Roles(Role_ENUM.HOST)
    @Patch('/addService/:id')
    @ApiBody({ type: ListServiceID })
    @ApiResponse({
        status: 200,
        description: 'add service Hotel by id',
        type: String,
    })
    async addService(
        @Param('id') idHotel: string,
        @Body() listServiceID: ListServiceID,
        @GetUser() user: User,
    ): Promise<string> {
        return await this.hotelService.addServiceHotel(idHotel, listServiceID, user);
    }

    @Roles(Role_ENUM.HOST)
    @Delete('/removeService/:id')
    @ApiBody({ type: ListServiceID })
    @ApiResponse({
        status: 200,
        description: 'remove service Hotel by id',
        type: String,
    })
    async removeService(
        @Param('id') idHotel: string,
        @Body() listServiceID: ListServiceID,
        @GetUser() user: User,
    ): Promise<string> {
        return await this.hotelService.removeServiceHotel(idHotel, listServiceID, user);
    }

    @Roles(Role_ENUM.HOST)
    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'Delete a Hotel by id',
        type: String,
    })
    remove(@Param('id') id: string, @GetUser() user: Payload): Promise<string> {
        return this.hotelService.deleteHotelById(id, user);
    }
}
