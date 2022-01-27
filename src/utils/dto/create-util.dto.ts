import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsNotBlank } from 'src/core/Blank/isNotBlank.decorator';
export class UtilsID {
    @ApiProperty({ type: String, description: 'id util' })
    idUtil: string;
}
export class ListUtilID {
    @ApiProperty({
        type: [UtilsID],
        description: 'list util id',
    })
    utils: [UtilsID];
}
export class CreateUtilsDto {
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
