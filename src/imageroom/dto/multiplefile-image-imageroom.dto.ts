import { ApiProperty } from '@nestjs/swagger';
import { ApiFile } from 'src/base/multifile.request';
import { IsNotBlank } from 'src/core/Blank/isNotBlank.decorator';

export class MultipleFilesFormDataDTO {
    @IsNotBlank('roomId', { message: 'roomId is not empty' })
    @ApiProperty({ type: String })
    roomId: string;

    @ApiFile({ isArray: true })
    images: Array<Express.Multer.File>;
}
