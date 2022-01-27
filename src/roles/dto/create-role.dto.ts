import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRoleDto {
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'role' })
    role: string;
}
