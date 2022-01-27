import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseInterceptors,
    Delete,
    Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorator/roles.decorator';
import { Role_ENUM } from 'src/roles/roles.enum';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/decorator/decorator';
import { Payload } from 'src/core/Payload/payload';
import { MapInterceptor } from '@automapper/nestjs';
import TicketDTO from './dto/ticket.dto';
import { ApiListResponse } from 'src/base/api.list.response';
import { IPaginateResponse, paginateResponse } from 'src/base/filter.pagination.base';
import { FilterPaginationTicket } from './dto/filter-ticket-extends';
import { Sort } from 'src/base/orderby.enum';
@ApiBearerAuth()
@Controller('ticket')
@ApiTags('Ticket')
export class TicketController {
    constructor(private readonly ticketService: TicketService) {}

    @Roles(Role_ENUM.CLIENT)
    @ApiResponse({
        status: 201,
        description: 'Created new ticket successfully',
        type: TicketDTO,
    })
    @Post('/create')
    create(@Body() createTicketDto: CreateTicketDto, @GetUser() user: User): Promise<string> {
        return this.ticketService.createTicket(createTicketDto, user);
    }

    @Roles(Role_ENUM.HOST)
    @Get('/host')
    @ApiResponse({
        status: 200,
        description: 'Get all Ticket by host',
        type: [TicketDTO],
    })
    @UseInterceptors(MapInterceptor(TicketDTO, Ticket, { isArray: true }))
    async findAll(@GetUser() user: Payload): Promise<Ticket[] | { message: string }> {
        const listTicket = await this.ticketService.getAllTicket(user.id);
        if (listTicket.length == 0) {
            return { message: 'No Data Ticket' };
        }
        return listTicket;
    }

    @Roles(Role_ENUM.HOST)
    @Get('/pagination')
    @ApiQuery({ name: 'sortBy', enum: Sort })
    @ApiListResponse(TicketDTO)
    async findAllTicketPagination(
        @GetUser() user: Payload,
        @Query() payable: FilterPaginationTicket,
        @Query('sortBy') sortBy: string,
    ): Promise<IPaginateResponse<TicketDTO> | { message: string }> {
        const [result, count] = await this.ticketService.getAllPaginationTicket(
            user.id,
            payable.sizePage as number,
            payable.numberPage as number,
            sortBy,
        );
        if (count == 0) {
            return { message: 'No data Ticket' };
        }
        return paginateResponse<TicketDTO>(
            [result, count],
            payable.numberPage as number,
            payable.sizePage as number,
        );
    }

    @Roles(Role_ENUM.CLIENT)
    @Get('/getAllByUser')
    @ApiResponse({
        status: 200,
        description: 'Get all Ticket By User',
        type: [TicketDTO],
    })
    @UseInterceptors(MapInterceptor(TicketDTO, Ticket, { isArray: true }))
    async findAllByUser(@GetUser() user: Payload): Promise<Ticket[] | { message: string }> {
        const listTicket = await this.ticketService.getAllTicketByUser(user);
        if (listTicket.length == 0) {
            return { message: 'No Data Ticket' };
        }
        return listTicket;
    }

    @Roles(Role_ENUM.CLIENT)
    @Get('/user/:id')
    @ApiResponse({
        status: 200,
        description: 'Get detail Ticket by ID of user',
        type: TicketDTO,
    })
    @UseInterceptors(MapInterceptor(TicketDTO, Ticket))
    async findOneTicketUser(@Param('id') id: string, @GetUser() user: Payload): Promise<Ticket> {
        return await this.ticketService.getTicketByIdUser(id, user.id);
    }

    @Roles(Role_ENUM.HOST)
    @Get('/host/:id')
    @ApiResponse({
        status: 200,
        description: 'Get detail Ticket by ID of host',
        type: TicketDTO,
    })
    @UseInterceptors(MapInterceptor(TicketDTO, Ticket))
    async findOneTicketAdmin(@Param('id') id: string, @GetUser() user: Payload): Promise<Ticket> {
        return await this.ticketService.getTicketByIdHost(id, user.id);
    }

    @Roles(Role_ENUM.HOST)
    @Patch(':id/checkIn')
    @ApiParam({ name: 'id', description: 'id ticket' })
    @ApiResponse({
        status: 200,
        description: 'User check in hotel ',
        type: String,
    })
    async checkIn(@Param('id') id: string, @GetUser() user: Payload): Promise<string> {
        return await this.ticketService.checkIn(id, user.id);
    }

    @Roles(Role_ENUM.HOST)
    @Patch(':id/checkOut')
    @ApiParam({ name: 'id', description: 'id ticket' })
    @ApiResponse({
        status: 200,
        description: 'User check out hotel ',
        type: String,
    })
    async checkOut(@Param('id') id: string, @GetUser() user: Payload): Promise<string> {
        return await this.ticketService.checkOut(id, user.id);
    }

    @Roles(Role_ENUM.CLIENT, Role_ENUM.HOST)
    @ApiParam({ name: 'id', description: 'id ticket' })
    @Delete(':id/cancel')
    @ApiResponse({
        status: 200,
        description: 'User cancel ticket',
        type: String,
    })
    remove(@Param('id') id: string, @GetUser() user: Payload): Promise<string> {
        return this.ticketService.deleteTicketById(id, user.id);
    }
}
