import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from 'src/core/Blank/isNotBlank.decorator';

export class SignInUserDto {
    @IsNotBlank('username', { message: 'username is not empty' })
    @ApiProperty({ type: String, description: 'userName' })
    username: string;

    @IsNotBlank('password', { message: 'password is not empty' })
    @ApiProperty({ type: String, description: 'password' })
    password: string;
}
