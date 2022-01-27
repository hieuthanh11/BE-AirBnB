import { Public } from './../decorator/isPublic';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Status } from './entities/status.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { Role_ENUM } from 'src/roles/roles.enum';

@Roles(Role_ENUM.ADMIN)
@Controller('status')
@ApiTags('Status')
@ApiBearerAuth()
export class StatusController {
    constructor(private readonly statusService: StatusService) {}

    @Post('/create')
    @ApiResponse({
        status: 201,
        description: 'Created status successfully',
        type: Status,
    })
    create(@Body() createRoleDto: CreateStatusDto): Promise<Status> {
        return this.statusService.createData(createRoleDto);
    }

    @Public()
    @Get()
    @ApiResponse({
        status: 200,
        description: 'Get all Status',
        type: [Status],
    })
    async findAll(): Promise<Status[] | { messages: string }> {
        const listStatus = await this.statusService.getAll();
        if (listStatus.length == 0) {
            return { messages: 'No Data Status' };
        }
        return listStatus;
    }

    @Public()
    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get detail a Status',
        type: Status,
    })
    findOne(@Param('id') id: string): Promise<Status> {
        return this.statusService.findById(id);
    }

    @Public()
    @Patch(':id')
    @ApiBody({ type: CreateStatusDto })
    @ApiResponse({
        status: 200,
        description: 'Update a Role by id',
        type: Status,
    })
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateStatusDto): Promise<Status> {
        return this.statusService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'Delete a Role by id',
        type: String,
    })
    remove(@Param('id') id: string): Promise<string> {
        return this.statusService.deleteStatusById(id);
    }
}
