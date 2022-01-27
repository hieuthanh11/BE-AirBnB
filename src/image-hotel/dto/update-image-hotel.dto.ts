import { PartialType } from '@nestjs/swagger';
import { CreateImageHotelDto } from './create-image-hotel.dto';

export class UpdateImageHotelDto extends PartialType(CreateImageHotelDto) {}
