import { MapInterceptor } from '@automapper/nestjs';
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
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiListResponse } from 'src/base/api.list.response';
import {
    FilterPaginationBase,
    IPaginateResponse,
    paginateResponse,
} from 'src/base/filter.pagination.base';
import { Payload } from 'src/core/Payload/payload';
import { GetUser } from 'src/decorator/decorator';
import { Public } from 'src/decorator/isPublic';
import { Roles } from 'src/decorator/roles.decorator';
import { Role_ENUM } from 'src/roles/roles.enum';
import { Status_ENUM, Status_ENUM_DISCOUNT } from 'src/status/status.enum';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { DiscountRoomDto } from './dto/discount-room.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './entities/discount.entity';

@ApiBearerAuth()
@Controller('discount')
@ApiTags('Discount')
export class DiscountController {
    constructor(private readonly discountService: DiscountService) {}

    @Roles(Role_ENUM.HOST)
    @Post('/create')
    @ApiResponse({
        status: 201,
        description: 'Create new Discount successfully',
        type: String,
    })
    async create(
        @Body() createDiscountDto: CreateDiscountDto,
        @GetUser() user: Payload,
    ): Promise<string> {
        return await this.discountService.createDiscount(createDiscountDto, user);
    }

    @Public()
    @Get('/pagination')
    @ApiQuery({ name: 'status', enum: Status_ENUM_DISCOUNT })
    @ApiListResponse(DiscountRoomDto)
    async findAllRefactor(
        @Query() payable: FilterPaginationBase,
        @Query('status') status: string,
    ): Promise<IPaginateResponse<DiscountRoomDto> | { message: string }> {
        const [result, count] = await this.discountService.getAllDiscount(
            payable.sizePage as number,
            payable.numberPage as number,
            status,
        );
        if (count == 0) {
            return { message: 'No Data Discount' };
        }
        return paginateResponse<DiscountRoomDto>(
            [result, count],
            payable.numberPage as number,
            payable.sizePage as number,
        );
    }
    @Public()
    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get detail a Discount',
        type: DiscountRoomDto,
    })
    @UseInterceptors(MapInterceptor(DiscountRoomDto, Discount))
    async findOne(@Param('id') id: string): Promise<Discount> {
        return await this.discountService.getDiscountById(id);
    }

    @Roles(Role_ENUM.HOST)
    @Patch(':id')
    @ApiResponse({
        status: 200,
        description: 'Update Discount Successful',
        type: String,
    })
    async update(
        @Param('id') id: string,
        @Body() updateDiscountDto: UpdateDiscountDto,
    ): Promise<string> {
        return await this.discountService.updateDiscountById(id, updateDiscountDto);
    }

    @Roles(Role_ENUM.HOST)
    @Patch(':id/updateStatus/:idStatus')
    @ApiQuery({ name: 'status', enum: Status_ENUM_DISCOUNT })
    @ApiResponse({
        status: 200,
        description: 'Update Status Of Discount Successful',
        type: String,
    })
    async updateStatusOfDiscount(
        @Param('id') id: string,
        @Query('status') status: Status_ENUM = Status_ENUM.AVAILABLE,
    ): Promise<string> {
        return await this.discountService.updateStatusOfDiscountById(id, status);
    }

    @Roles(Role_ENUM.HOST)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<string> {
        await this.discountService.deleteById(id);
        return `Delete successfully ${id}`;
    }
}
