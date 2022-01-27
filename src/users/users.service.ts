import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { LoggerService } from 'src/logger/custom.logger';
import { RolesService } from 'src/roles/roles.service';
import { UsersRepository } from './user.repository';
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { Role_ENUM } from 'src/roles/roles.enum';
import { CreateUserExtendDto } from './dto/create-user-extend.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import * as bcrypt from 'bcrypt';
import { StatusService } from 'src/status/status.service';
import { Status_ENUM } from 'src/status/status.enum';
import { User } from './entities/user.entity';
import UserDto from './dto/user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { EmailService } from 'src/email/email.service';
@Injectable()
export class UsersService extends BaseService<User, UsersRepository> {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        repository: UsersRepository,
        logger: LoggerService,
        private roleServices: RolesService,
        private statusServices: StatusService,
        private emailService: EmailService,
    ) {
        super(repository, logger);
    }
    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
    async signUpUser(data: SignUpUserDto): Promise<User> {
        const salt = await bcrypt.genSalt();
        const password = await this.hashPassword(data.password, salt);
        const role = await this.roleServices.findByName(Role_ENUM.CLIENT);
        const status = await this.statusServices.findStatusByName(Status_ENUM.ACTIVE);
        data.password = password;
        const result: User = await this.repository.signUp(data, role, status);
        return result;
    }

    async signUpHost(data: SignUpUserDto): Promise<User> {
        const salt = await bcrypt.genSalt();
        const password = await this.hashPassword(data.password, salt);
        const role = await this.roleServices.findByName(Role_ENUM.HOST);
        const status = await this.statusServices.findStatusByName(Status_ENUM.ACTIVE);
        data.password = password;
        const result: User = await this.repository.signUp(data, role, status);
        return result;
    }

    async createUserService(data: CreateUserExtendDto): Promise<User> {
        const salt = await bcrypt.genSalt();
        const password = await this.hashPassword(data.password, salt);
        const role = await this.roleServices.findByRoleId(data.roleId);
        const status = await this.statusServices.findStatusById(data.statusId);
        data.password = password;
        const result: User = await this.repository.createUser(data, role, status);
        return result;
    }

    async updateUserService(id: string, data: UpdateUserDto): Promise<string> {
        const role = await this.roleServices.findByRoleId(data.roleId);
        const status = await this.statusServices.findStatusById(data.statusId);
        return await this.repository.updateUser(id, data, role, status);
    }

    async updateUserProfile(id: string, data: UpdateUserProfileDto): Promise<string> {
        return await this.repository.updateUserProfile(id, data);
    }

    async getUserById(id: string): Promise<User> {
        return await this.repository.getUserById(id);
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this.repository.getUserByEmail(email);
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.repository.getUserByUsername(username);
    }

    async getAllUser(): Promise<User[]> {
        return await this.repository.getAllUser();
    }

    async getAllPagination(
        sizePage: number,
        numberPage: number,
        email: string,
        userName: string,
        roleName: string,
        sortBy: string,
    ): Promise<[UserDto[], number]> {
        const [result, count] = await this.repository.getAllUserPagination(
            sizePage,
            numberPage,
            email,
            userName,
            roleName,
            sortBy,
        );
        const userDto: UserDto[] = [];
        for (const item of result) {
            userDto.push(this.mapper.map(item, UserDto, User));
        }
        return [userDto, count];
    }

    async deleteUserById(id: string): Promise<string> {
        return await this.repository.deleteUserById(id);
    }

    async uploadAvatar(file: string, userId: string): Promise<string> {
        return await this.repository.uploadAvatar(file, userId);
    }

    async resetPassword(id: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const resetPassword: string = await this.hashPassword('12345', salt);
        const user: User = await this.getUserById(id);
        await this.emailService.sendUserConfirmation(user, '12345');
        return await this.repository.resetPassword(id, resetPassword);
    }

    async updatePassword(id: string, password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const newPassword: string = await this.hashPassword(password, salt);
        return await this.repository.updatePassword(id, newPassword);
    }
}
