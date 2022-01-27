import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from 'src/core/Blank/isNotBlank.decorator';

export class CreateImageHotelDto {
    @IsNotBlank('image', { message: 'Image is not empty' })
    @ApiProperty({ type: String, description: 'image' })
    images: string;
}
