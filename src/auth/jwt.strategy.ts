/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/constants/auth.constants';
import { Payload } from 'src/core/Payload/payload';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            secretOrKey: jwtConstants.secret,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request): string => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const data = request?.cookies['access_token'];
                    if (!data) {
                        return null;
                    }
                    return data as string;
                },
            ]),
        });
    }

    async validate(payload: Payload): Promise<Payload> {
        const existRefreshToken = await this.authService.checkExistRefreshToken(payload.id);

        if (!existRefreshToken)
            throw new HttpException('Token invalid', HttpStatus.PERMANENT_REDIRECT);
        return payload;
    }
}
