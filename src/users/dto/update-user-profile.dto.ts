import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from 'src/core/Blank/isNotBlank.decorator';
export class UpdateUserProfileDto {
    @IsNotBlank('firstName', { message: 'firstName is not empty' })
    @ApiProperty({ type: String, description: 'firstName' })
    firstName: string;

    @IsNotBlank('lastName', { message: 'lastName is not empty' })
    @ApiProperty({ type: String, description: 'lastName' })
    lastName: string;

    @IsNotBlank('password', { message: 'password is not empty' })
    @ApiProperty({ type: String, description: 'password' })
    password: string;

    @IsNotBlank('dob', { message: 'dob is not empty' })
    @ApiProperty({ type: String, description: 'dob' })
    dob: string;

    @IsNotBlank('phone', { message: 'phone is not empty' })
    @ApiProperty({ type: String, description: 'phone' })
    phone: string;

    @IsNotBlank('avatar', { message: 'avatar is not empty' })
    @ApiProperty({ type: String, description: 'avatar' })
    avatar: string;

    @IsNotBlank('email', { message: 'email is not empty' })
    @IsEmail()
    @ApiProperty({ type: String, description: 'email' })
    email: string;
}
