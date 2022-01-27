import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsNotBlank } from 'src/core/Blank/isNotBlank.decorator';
import { CreateUtilsDto } from './create-util.dto';

export class UpdateUtilsDto extends CreateUtilsDto {
    @ApiProperty({ type: String, description: 'name' })
    @IsNotBlank('name', { message: 'name is not empty' })
    name: string;

    @ApiProperty({ type: String, description: 'desc' })
    @IsNotBlank('desc', { message: 'desc is not empty' })
    desc: string;

    @IsNotEmpty()
    @ApiProperty({ type: Number, description: 'rate' })
    rate: number;
}
