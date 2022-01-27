import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { LoginAuthDto } from 'src/auth/dto/login.dto';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Facebook } from './facebook.interface';

@Injectable()
export class FacebookService {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
        private emailService: EmailService,
        private configService: ConfigService,
        private httpService: HttpService,
    ) {}

    async facebookLogin(accesstoken: string, idUser: string): Promise<LoginAuthDto> {
        const config: AxiosRequestConfig = {
            method: 'get',
            url: `https://graph.facebook.com/${idUser}?fields=id,name,email,picture&access_token=${accesstoken}`,
            headers: {},
        };

        const res = await axios(config);
        const data: Facebook = res.data as Facebook;
        const user = await this.userService.getUserByEmail(data.email);
        const passwordRandom = (Math.random() + 1).toString(36).substring(7);
        if (user == null) {
            const obj = {
                userName: data.email.split('@')[0] ?? '',
                firstName: '',
                lastName: data.name ?? '',
                password: passwordRandom,
                dob: '',
                phone: '',
                avatar: data.picture,
                email: data.email,
            };
            const result: User = await this.authService.signUpAuthUser(obj);
            await this.emailService.sendUserConfirmation(result, passwordRandom);
            return this.authService.login(result);
        }
        return this.authService.login(user);
    }
}
