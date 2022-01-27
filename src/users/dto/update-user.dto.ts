import { CreateUserDto } from './create-user.dto';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from 'src/core/Blank/isNotBlank.decorator';
export class UpdateUserDto extends CreateUserDto {
    @ApiProperty({ type: String, description: 'email' })
    @IsNotBlank('email', { message: 'email is not empty' })
    @IsEmail()
    email: string;

    @IsNotBlank('roleId', { message: 'roleId is not empty' })
    @ApiProperty({ type: String, description: 'roleId' })
    roleId: string;

    @IsNotBlank('statusId', { message: 'statusId is not empty' })
    @ApiProperty({ type: String, description: 'statusId' })
    statusId: string;
}

export class UpdatePasswordDto {
    @IsNotBlank('password', { message: 'password is not empty' })
    @ApiProperty({ type: String, description: 'password' })
    password: string;
}
