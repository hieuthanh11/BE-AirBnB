import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from 'src/core/Blank/isNotBlank.decorator';
import { ApiFile } from 'src/base/multifile.request';
export class MultipleFilesFormDataHotelDTO {
    @IsNotBlank('hotelID', { message: 'hotelId is not empty' })
    @ApiProperty({ type: String, description: 'Hotel ID' })
    hotelId: string;

    @ApiFile({ isArray: true })
    images: Array<Express.Multer.File>;
}
