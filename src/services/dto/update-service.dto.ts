import { PartialType } from '@nestjs/swagger';
import { CreateServicesDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServicesDto) {}
