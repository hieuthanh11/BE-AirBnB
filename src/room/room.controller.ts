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
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Role_ENUM } from 'src/roles/roles.enum';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import RoomDto from './dto/room.dto';
import { MapInterceptor } from '@automapper/nestjs';
import { Room } from './entities/room.entity';
import { GetUser } from 'src/decorator/decorator';
import { User } from 'src/users/entities/user.entity';
import { Public } from 'src/decorator/isPublic';
import { Sort } from 'src/base/orderby.enum';
import { ApiListResponse } from 'src/base/api.list.response';
import { FilterPaginationRoom } from './dto/filter-room-extends';
import { IPaginateResponse, paginateResponse } from 'src/base/filter.pagination.base';
import { ListUtilID } from 'src/utils/dto/create-util.dto';
import { DiscountID } from 'src/utils/dto/create-discount-dto';

@Roles(Role_ENUM.HOST)
@ApiBearerAuth()
@Controller('room')
@ApiTags('Room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @ApiResponse({
        status: 201,
        description: 'Created new room successfully',
        type: RoomDto,
    })
    @Post('/create')
    @UseInterceptors(MapInterceptor(RoomDto, Room))
    create(@Body() createRoomDto: CreateRoomDto, @GetUser() user: User): Promise<Room> {
        return this.roomService.createRoom(createRoomDto, user);
    }

    @Public()
    @Get('/pagination')
    @ApiQuery({ name: 'sortBy', enum: Sort })
    @ApiListResponse(RoomDto)
    async findAllRoomPagination(
        @Query() payable: FilterPaginationRoom,
        @Query('sortBy') sortBy: string,
    ): Promise<IPaginateResponse<RoomDto> | { message: string }> {
        const [result, count] = await this.roomService.getAllPagination(
            payable.sizePage as number,
            payable.numberPage as number,
            payable.maPhong,
            sortBy,
        );
        if (count == 0) {
            return { message: 'No Data Room' };
        }
        return paginateResponse<RoomDto>(
            [result, count],
            payable.numberPage as number,
            payable.sizePage as number,
        );
    }

    @Public()
    @Get()
    @ApiResponse({
        status: 200,
        description: 'Get all Room',
        type: [RoomDto],
    })
    @UseInterceptors(
        MapInterceptor(RoomDto, Room, {
            isArray: true,
        }),
    )
    async findAll(): Promise<Room[] | { message: string }> {
        const listRoom = await this.roomService.getAllRoom();
        if (listRoom.length == 0) {
            return { message: 'No Data Room' };
        }
        return listRoom;
    }

    @Get('/getAll/:idHotel')
    @ApiResponse({
        status: 200,
        description: 'Get all Room By Id',
        type: [RoomDto],
    })
    @UseInterceptors(
        MapInterceptor(RoomDto, Room, {
            isArray: true,
        }),
    )
    async findAllRoomById(
        @Param('idHotel') idHotel: string,
        @GetUser() user: User,
    ): Promise<Room[] | { message: string }> {
        const listRoom = await this.roomService.getAllRoomById(idHotel, user);
        if (listRoom.length == 0) {
            return { message: 'No Data Room' };
        }
        return listRoom;
    }

    @Public()
    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get detail Room by ID',
        type: RoomDto,
    })
    @UseInterceptors(MapInterceptor(RoomDto, Room))
    async findOne(@Param('id') id: string): Promise<Room> {
        return await this.roomService.getRoomById(id);
    }

    @Patch('/:id/:idHotel')
    @ApiBody({ type: UpdateRoomDto })
    @ApiResponse({
        status: 200,
        description: 'Update a Room by id',
        type: RoomDto,
    })
    async update(
        @Param('id') idRoom: string,
        @Param('idHotel') idHotel: string,
        @Body() updateRoomDto: UpdateRoomDto,
        @GetUser() user: User,
    ): Promise<string> {
        return await this.roomService.updateRoom(idRoom, updateRoomDto, user, idHotel);
    }

    @Post('/addUtil/:id')
    @ApiBody({ type: ListUtilID })
    @ApiResponse({
        status: 200,
        description: 'Add util Room by id',
        type: String,
    })
    async addUtil(@Param('id') idRoom: string, @Body() listUtilID: ListUtilID): Promise<string> {
        return await this.roomService.addUtilRoom(idRoom, listUtilID);
    }

    @Delete('/removeUtil/:id')
    @ApiBody({ type: ListUtilID })
    @ApiResponse({
        status: 200,
        description: 'remove util Room by id',
        type: String,
    })
    async removeService(
        @Param('id') idRoom: string,
        @Body() listUtilID: ListUtilID,
    ): Promise<string> {
        return await this.roomService.removeUtilRoom(idRoom, listUtilID);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'Delete a Room by id',
        type: String,
    })
    remove(@Param('id') id: string): Promise<string> {
        return this.roomService.deleteRoomById(id);
    }

    @Post('/updateDiscount/:id')
    @ApiBody({ type: DiscountID })
    @ApiResponse({
        status: 200,
        description: 'Update Discount Room by id',
        type: String,
    })
    async updateDiscountRoom(
        @Param('id') idRoom: string,
        @Body() idDiscount: DiscountID,
    ): Promise<string> {
        return await this.roomService.updateDiscountRoom(idRoom, idDiscount);
    }

    @Delete('/removeDiscount/:id')
    @ApiResponse({
        status: 200,
        description: 'remove Discount Room by id',
        type: String,
    })
    async removeDiscountRoom(@Param('id') idRoom: string): Promise<string> {
        return await this.roomService.removeDiscountRoom(idRoom);
    }
}
