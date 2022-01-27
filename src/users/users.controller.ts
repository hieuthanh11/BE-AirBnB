/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { CreateUserExtendDto } from './dto/create-user-extend.dto';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import UserDto from './dto/user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Role_ENUM, Role_ENUM_USER } from 'src/roles/roles.enum';
import { Roles } from 'src/decorator/roles.decorator';
import { ApiListResponse } from 'src/base/api.list.response';
import { FilterPaginationUser } from './dto/filter.user.extends';
import { Sort } from 'src/base/orderby.enum';
import { IPaginateResponse, paginateResponse } from 'src/base/filter.pagination.base';
import { FormDataRequest } from 'nestjs-form-data';
import { FileUploadDto } from 'src/file/file.dto';
import { GetUser } from 'src/decorator/decorator';
import { Payload } from 'src/core/Payload/payload';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
const imgbbUploader = require('imgbb-uploader');
@ApiBearerAuth()
@Controller('users')
@ApiTags('User')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Roles(Role_ENUM.ADMIN, Role_ENUM.HOST, Role_ENUM.CLIENT)
    @Patch('/updatePassword')
    @ApiResponse({
        status: 200,
        description: 'Update Password',
        type: String,
    })
    async updatePassword(@GetUser() user: User, @Body() data: UpdatePasswordDto): Promise<string> {
        return await this.usersService.updatePassword(user.id, data.password);
    }

    @Roles(Role_ENUM.ADMIN, Role_ENUM.HOST, Role_ENUM.CLIENT)
    @Patch('/resetPassword')
    @ApiResponse({
        status: 200,
        description: 'Reset Password',
        type: String,
    })
    async reset(@GetUser() user: User): Promise<string> {
        return await this.usersService.resetPassword(user.id);
    }

    @Roles(Role_ENUM.ADMIN)
    @ApiResponse({
        status: 201,
        description: 'Created new user successfully',
        type: UserDto,
    })
    @Post('/create')
    @UseInterceptors(MapInterceptor(UserDto, User))
    create(@Body() createUserExtendDto: CreateUserExtendDto): Promise<User> {
        return this.usersService.createUserService(createUserExtendDto);
    }

    @Roles(Role_ENUM.ADMIN)
    @Get('/pagination')
    @ApiQuery({ name: 'roles', enum: Role_ENUM_USER })
    @ApiQuery({ name: 'sortBy', enum: Sort })
    @ApiListResponse(UserDto)
    async findAllUserPagination(
        @Query() payable: FilterPaginationUser,
        @Query('roles') roleName: string,
        @Query('sortBy') sortBy: string,
    ): Promise<IPaginateResponse<UserDto> | { message: string }> {
        const [result, count] = await this.usersService.getAllPagination(
            payable.sizePage as number,
            payable.numberPage as number,
            payable.email,
            payable.userName,
            roleName,
            sortBy,
        );
        if (count == 0) {
            return { message: 'No Data User' };
        }
        return paginateResponse<UserDto>(
            [result, count],
            payable.numberPage as number,
            payable.sizePage as number,
        );
    }

    @Roles(Role_ENUM.ADMIN)
    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get detail User by ID',
        type: UserDto,
    })
    @UseInterceptors(MapInterceptor(UserDto, User))
    async findOne(@Param('id') id: string): Promise<User> {
        return await this.usersService.getUserById(id);
    }

    @Roles(Role_ENUM.CLIENT, Role_ENUM.ADMIN, Role_ENUM.HOST)
    @Patch('/updateProfile')
    @ApiBody({ type: UpdateUserProfileDto })
    @ApiResponse({
        status: 200,
        description: 'Update profile host admin user',
        type: String,
    })
    async updateProfile(
        @GetUser() user: Payload,
        @Body() updateUserDto: UpdateUserProfileDto,
    ): Promise<string> {
        return await this.usersService.updateUserProfile(user.id, updateUserDto);
    }

    @Roles(Role_ENUM.ADMIN)
    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'Delete a User by id',
        type: String,
    })
    remove(@Param('id') id: string): Promise<string> {
        return this.usersService.deleteUserById(id);
    }

    @Roles(Role_ENUM.CLIENT, Role_ENUM.ADMIN, Role_ENUM.HOST)
    @Post('uploadAvatar')
    @ApiConsumes('multipart/form-data')
    @FormDataRequest()
    @ApiBody({
        description: 'Upload Avatar',
        type: FileUploadDto,
    })
    async uploadAvatarTest(@Body() file: FileUploadDto, @GetUser() user: Payload): Promise<string> {
        // @ts-ignore
        const contents = Buffer.from(file.avatar.buffer).toString('base64');
        const options: { apiKey: string; base64string: string } = {
            apiKey: process.env.IMAGE_KEY, // MANDATORY
            base64string: contents,
        };
        const data: { display_url: string } = (await imgbbUploader(options)) as {
            display_url: string;
        };
        return await this.usersService.uploadAvatar(data.display_url, user.id);
    }

    @Roles(Role_ENUM.ADMIN)
    @Patch(':id')
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({
        status: 200,
        description: 'Update a User by id',
        type: UserDto,
    })
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<string> {
        return await this.usersService.updateUserService(id, updateUserDto);
    }
}
