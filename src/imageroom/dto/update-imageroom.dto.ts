import { PartialType } from '@nestjs/swagger';
import { CreateImageroomDto } from './create-imageroom.dto';

export class UpdateImageroomDto extends PartialType(CreateImageroomDto) {}
