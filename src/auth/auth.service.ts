import { ConfigService } from '@nestjs/config';
import { User } from './../users/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpUserDto } from 'src/users/dto/signup-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Payload, PayloadRefreshToken } from 'src/core/Payload/payload';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login.dto';
import { TimeOut } from 'src/constants/auth.constants';
@Injectable()
export class AuthService {
    constructor(
        private userServices: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async getProfileUser(userId: string): Promise<User> {
        return await this.userServices.getUserById(userId);
    }

    async validateUser(username: string, password: string): Promise<User> {
        const user: User = await this.userServices.getUserByUsername(username);
        if (!user) {
            return null;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (user && isMatch) {
            return user;
        }
        return null;
    }

    async login(user: User): Promise<LoginAuthDto> {
        const payload: Payload = {
            username: user.userName,
            id: user.id,
            email: user.email,
            role: user.role.role,
        };
        const refreshToken = await this.createRefreshToken(user);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken,
            message: 'login successfully',
        };
    }

    async signUpAuthUser(data: SignUpUserDto): Promise<User> {
        return await this.userServices.signUpUser(data);
    }

    async signUpAuthHost(data: SignUpUserDto): Promise<User> {
        return await this.userServices.signUpHost(data);
    }

    async refreshToken(refreshToken: string): Promise<string> {
        const payloadRefresh: PayloadRefreshToken = this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>('secretRefreshToken'),
        });
        if (!payloadRefresh) throw new BadRequestException('this token is wrong');
        const user = await this.userServices.getUserById(payloadRefresh.id);
        if (refreshToken.localeCompare(user.refreshToken)) return null;
        const payload: Payload = {
            username: user.userName,
            id: user.id,
            email: user.email,
            role: user.role.role,
        };
        return this.jwtService.sign(payload);
    }

    async createRefreshToken(user: User): Promise<string> {
        const payloadRefreshToken: PayloadRefreshToken = {
            id: user.id,
        };

        const refreshToken: string = this.jwtService.sign(payloadRefreshToken, {
            secret: this.configService.get<string>('secretRefreshToken'),
            expiresIn: TimeOut.refreshToken,
        });

        await this.userServices.update(user.id, { refreshToken: refreshToken });
        return refreshToken;
    }

    async deleteRefreshToken(user: User): Promise<User> {
        return await this.userServices.update(user.id, { refreshToken: null });
    }

    async checkExistRefreshToken(userId: string): Promise<boolean> {
        const user = await this.userServices.getUserById(userId);
        if (user.refreshToken === null) return false;
        return true;
    }
}
