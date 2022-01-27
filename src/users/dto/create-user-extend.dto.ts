import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from 'src/core/Blank/isNotBlank.decorator';
import { CreateUserDto } from './create-user.dto';

export class CreateUserExtendDto extends CreateUserDto {
    @IsNotBlank('roleId', { message: 'roleId is not empty' })
    @ApiProperty({ type: String, description: 'roleId' })
    roleId: string;

    @IsNotBlank('statusId', { message: 'statusId is not empty' })
    @ApiProperty({ type: String, description: 'statusId' })
    statusId: string;
}
