import { ApiProperty } from '@nestjs/swagger';
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export class FileUploadDto {
    @IsFile()
    @MaxFileSize(1e9)
    @HasMimeType(['image/jpeg', 'image/png', 'image/svg', 'image/jpg', 'image/gif'])
    @ApiProperty({ type: 'string', format: 'binary' })
    avatar: FileSystemStoredFile;
}

export class FileImageUploadDto {
    @IsFile()
    @MaxFileSize(1e12)
    @HasMimeType(['image/jpeg', 'image/png', 'image/svg', 'image/jpg', 'image/gif'])
    @ApiProperty({ type: 'string', format: 'binary' })
    image: FileSystemStoredFile;
}
