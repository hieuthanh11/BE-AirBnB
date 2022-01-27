import { Role } from './entities/role.entity';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorator/roles.decorator';
import { Role_ENUM } from './roles.enum';
import { DeepPartial } from 'typeorm';

@Roles(Role_ENUM.ADMIN)
@ApiBearerAuth()
@Controller('roles')
@ApiTags('Role')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post('/create')
    @ApiResponse({
        status: 201,
        description: 'Created role successfully',
        type: Role,
    })
    create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        return this.rolesService.createData(createRoleDto);
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Get all Role',
        type: [Role],
    })
    async findAll(): Promise<Role[] | { messages: string }> {
        const listRole = await this.rolesService.getAll();
        if (listRole.length == 0) {
            return { messages: 'No Data Role' };
        }
        return listRole;
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get detail a Role',
        type: Role,
    })
    findOne(@Param('id') id: string): Promise<Role> {
        return this.rolesService.findById(id);
    }

    @Patch(':id')
    @ApiBody({ type: CreateRoleDto })
    @ApiResponse({
        status: 200,
        description: 'Update a Role by id',
        type: Role,
    })
    update(
        @Param('id') id: string,
        @Body() updateRoleDto: DeepPartial<UpdateRoleDto>,
    ): Promise<Role> {
        return this.rolesService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'Delete a Role by id',
        type: String,
    })
    remove(@Param('id') id: string): Promise<string> {
        return this.rolesService.deleteRoleById(id);
    }
}
