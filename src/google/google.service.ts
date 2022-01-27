import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { LoginAuthDto } from 'src/auth/dto/login.dto';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleService {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
        private emailService: EmailService,
        private configService: ConfigService,
    ) {}

    async googleLogin(tokenId: string): Promise<LoginAuthDto> {
        const payload: TokenPayload = await this.verifyToken(tokenId);
        if (!payload.email_verified) {
            throw new BadRequestException('Email not already verify');
        }
        const user = await this.userService.getUserByEmail(payload.email);
        const passwordRandom = (Math.random() + 1).toString(36).substring(7);
        if (user == null) {
            const data = {
                userName: payload.name ?? '',
                firstName: payload.given_name ?? '',
                lastName: payload.family_name ?? '',
                password: passwordRandom,
                dob: '',
                phone: '',
                avatar: payload.picture,
                email: payload.email,
            };

            const result: User = await this.authService.signUpAuthUser(data);
            await this.emailService.sendUserConfirmation(result, passwordRandom);
            return this.authService.login(result);
        }
        return this.authService.login(user);
    }

    async verifyToken(tokenId: string): Promise<TokenPayload> {
        const client = new OAuth2Client(this.configService.get<string>('googleClientId'));
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: this.configService.get<string>('googleClientId'),
        });
        const payload: TokenPayload = ticket.getPayload();
        return payload;
    }
}
