import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from 'src/core/Blank/isNotBlank.decorator';

export class CreateImageroomDto {
    @IsNotBlank('image', { message: 'image is not empty' })
    @ApiProperty({ type: String, description: 'image' })
    images: string;
}
