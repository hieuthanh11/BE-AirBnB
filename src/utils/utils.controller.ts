import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorator/roles.decorator';
import { Role_ENUM } from 'src/roles/roles.enum';
import { MapInterceptor } from '@automapper/nestjs';
import UtilDto from './dto/util.dto';
import { Util } from './entities/util.entity';
import { CreateUtilsDto } from './dto/create-util.dto';
import { UpdateUtilsDto } from './dto/update-util.dto';
import { Public } from 'src/decorator/isPublic';

@Roles(Role_ENUM.ADMIN)
@Controller('utils')
@ApiTags('Utils')
@ApiBearerAuth()
export class UtilsController {
    constructor(private readonly utilsService: UtilsService) {}

    @Post('/create')
    @ApiResponse({
        status: 201,
        description: 'Created utils successfully',
        type: UtilDto,
    })
    @UseInterceptors(MapInterceptor(UtilDto, Util))
    create(@Body() createUtilDto: CreateUtilsDto): Promise<Util> {
        return this.utilsService.createData(createUtilDto);
    }

    @Public()
    @Get()
    @ApiResponse({
        status: 200,
        description: 'Get all Utils',
        type: [UtilDto],
    })
    @UseInterceptors(
        MapInterceptor(UtilDto, Util, {
            isArray: true,
        }),
    )
    async findAll(): Promise<Util[] | { messages: string }> {
        const listUtils = await this.utilsService.getAll();
        if (listUtils.length == 0) {
            return { messages: 'No Data Utils' };
        }
        return listUtils;
    }

    @Public()
    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get detail a Utils',
        type: Util,
    })
    @UseInterceptors(MapInterceptor(UtilDto, Util))
    async findOne(@Param('id') id: string): Promise<Util> {
        return await this.utilsService.findById(id);
    }

    @Patch(':id')
    @ApiBody({ type: UpdateUtilsDto })
    @ApiResponse({
        status: 200,
        description: 'Update Util by id',
        type: UtilDto,
    })
    @UseInterceptors(MapInterceptor(UtilDto, Util))
    update(@Param('id') id: string, @Body() updateUtilDto: UpdateUtilsDto): Promise<Util> {
        return this.utilsService.update(id, updateUtilDto);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'Delete a Utils by id',
        type: String,
    })
    async remove(@Param('id') id: string): Promise<string> {
        return await this.utilsService.deleteUtilsById(id);
    }
}
