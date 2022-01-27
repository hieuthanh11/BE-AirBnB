import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Service } from './entities/service.entity';
import { CreateServicesDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Role_ENUM } from 'src/roles/roles.enum';
import ServiceDto from './dto/service.dto';
import { MapInterceptor } from '@automapper/nestjs';
import { Public } from 'src/decorator/isPublic';

@Roles(Role_ENUM.ADMIN)
@ApiBearerAuth()
@Controller('services')
@ApiTags('Services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Post('/create')
    @ApiResponse({
        status: 201,
        description: 'Created services successfully',
        type: ServiceDto,
    })
    @UseInterceptors(MapInterceptor(ServiceDto, Service))
    async create(@Body() createServiceDto: CreateServicesDto): Promise<Service> {
        return this.servicesService.createData(createServiceDto);
    }

    @Public()
    @Get()
    @ApiResponse({
        status: 200,
        description: 'Get all Services',
        type: [ServiceDto],
    })
    @UseInterceptors(
        MapInterceptor(ServiceDto, Service, {
            isArray: true,
        }),
    )
    async findAll(): Promise<Service[] | { messages: string }> {
        const listServices = await this.servicesService.getAll();
        if (listServices.length == 0) {
            return { messages: 'No Data Services' };
        }
        return listServices;
    }

    @Public()
    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get detail a Services',
        type: ServiceDto,
    })
    @UseInterceptors(MapInterceptor(ServiceDto, Service))
    findOne(@Param('id') id: string): Promise<Service> {
        return this.servicesService.findById(id);
    }

    @Patch(':id')
    @ApiBody({ type: CreateServicesDto })
    @ApiResponse({
        status: 200,
        description: 'Update a Services by id',
        type: ServiceDto,
    })
    @UseInterceptors(MapInterceptor(ServiceDto, Service))
    update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto): Promise<Service> {
        return this.servicesService.update(id, updateServiceDto);
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'Delete a Services by id',
        type: String,
    })
    remove(@Param('id') id: string): Promise<string> {
        return this.servicesService.deleteServicesById(id);
    }
}
