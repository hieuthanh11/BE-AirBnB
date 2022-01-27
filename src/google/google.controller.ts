import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from 'src/auth/dto/login.dto';
import { Public } from 'src/decorator/isPublic';
import { GoogleService } from './google.service';
@ApiTags('Google')
@Controller('google')
export class GoogleController {
    constructor(private readonly googleService: GoogleService) {}
    @Public()
    @Get(':tokenId')
    @ApiResponse({
        status: 200,
        description: 'login with google by send tokenId',
    })
    async checkTokenId(@Param('tokenId') tokenId: string): Promise<LoginAuthDto> {
        return await this.googleService.googleLogin(tokenId);
    }
}
