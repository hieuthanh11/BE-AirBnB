import { PartialType } from '@nestjs/swagger';
import { BaseRoomDto } from './base-room.dto';

export class UpdateRoomDto extends PartialType(BaseRoomDto) {}
