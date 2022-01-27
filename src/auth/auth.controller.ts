/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MapInterceptor } from '@automapper/nestjs';
import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UseGuards,
    Req,
    Get,
    HttpStatus,
    BadRequestException,
    HttpException,
    HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TimeOut } from 'src/constants/auth.constants';
import { Payload } from 'src/core/Payload/payload';
import { GetUser } from 'src/decorator/decorator';
import { Public } from 'src/decorator/isPublic';
import { Roles } from 'src/decorator/roles.decorator';
import { LocalAuthGuard } from 'src/Guards/local-auth.guard';
import { Role_ENUM } from 'src/roles/roles.enum';
import { SignInUserDto } from 'src/users/dto/signin-user.dto';
import { SignUpUserDto } from 'src/users/dto/signup-user.dto';
import UserDto from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';

interface RequestExtend extends Request {
    user: Payload;
}
@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('/signup')
    @ApiResponse({
        status: 201,
        description: 'Signup successfully',
        type: UserDto,
    })
    @UseInterceptors(MapInterceptor(UserDto, User))
    async signUp(@Body() signUpUserDto: SignUpUserDto): Promise<User> {
        return await this.authService.signUpAuthUser(signUpUserDto);
    }

    @Public()
    @Post('/signUpHost')
    @ApiResponse({
        status: 201,
        description: 'Signup successfully host',
        type: UserDto,
    })
    @UseInterceptors(MapInterceptor(UserDto, User))
    async signUpHost(@Body() signUpUserDto: SignUpUserDto): Promise<User> {
        return await this.authService.signUpAuthHost(signUpUserDto);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: SignInUserDto })
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Login successfully',
        type: LoginAuthDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Login fail',
        type: String,
    })
    @Post('login')
    async login(@GetUser() user: User, @Req() req: Request): Promise<string> {
        const response = await this.authService.login(user);
        req.res
            .cookie('access_token', response.access_token, {
                maxAge: TimeOut.accessToken,
                sameSite: 'none',
                httpOnly: false,
                //open secure below if use swagger
                secure: true,
            })
            .cookie('refresh_token', response.refresh_token, {
                maxAge: TimeOut.refreshToken,
                path: '/v1/auth/refreshToken',
                sameSite: 'none',
                httpOnly: false,
                //open secure below if use swagger
                secure: true,
            });
        return response.message;
    }

    @Roles(Role_ENUM.ADMIN, Role_ENUM.CLIENT, Role_ENUM.HOST)
    @UseInterceptors(MapInterceptor(UserDto, User))
    @Get('profile')
    async getProfile(@Req() req: RequestExtend): Promise<User> {
        return await this.authService.getProfileUser(req.user.id);
    }

    @Public()
    @Get('/refreshToken')
    async refreshToken(@Req() req: Request): Promise<string | number> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const refreshToken: string = req.cookies['refresh_token'];
        if (!refreshToken) throw new BadRequestException('this is not token');
        const newAccessToken = await this.authService.refreshToken(refreshToken);
        if (!newAccessToken)
            throw new HttpException('Token invalid', HttpStatus.PERMANENT_REDIRECT);
        req.res.cookie('access_token', newAccessToken);
        return 'refresh token successful';
    }

    @Roles(Role_ENUM.ADMIN, Role_ENUM.HOST, Role_ENUM.CLIENT)
    @Get('/logout')
    async logout(@GetUser() user: User): Promise<void> {
        await this.authService.deleteRefreshToken(user);
    }
}
