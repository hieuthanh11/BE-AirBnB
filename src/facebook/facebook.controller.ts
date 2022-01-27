import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/isPublic';
import { FacebookService } from './facebook.service';
import { Request } from 'express';
import { TimeOut } from 'src/constants/auth.constants';

@ApiTags('Facebook')
@Controller('facebook')
export class FacebookController {
    constructor(private readonly facebookService: FacebookService) {}

    @Public()
    @Get('/loginFacebook?')
    @ApiResponse({
        status: 200,
        description: 'login with facebook by send tokenId',
    })
    async checkTokenId(
        @Query('accesstoken') accesstoken: string,
        @Query('idUser') idUser: string,
        @Req() req: Request,
    ): Promise<string> {
        const response = await this.facebookService.facebookLogin(accesstoken, idUser);
        req.res
            .cookie('access_token', response.access_token, {
                maxAge: TimeOut.accessToken,
                sameSite: 'none',
                httpOnly: false,
                secure: true,
            })
            .cookie('refresh_token', response.refresh_token, {
                maxAge: TimeOut.refreshToken,
                path: '/v1/auth/refreshToken',
                sameSite: 'none',
                httpOnly: false,
                secure: true,
            });
        return response.message;
    }
}
