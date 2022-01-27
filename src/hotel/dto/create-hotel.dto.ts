import { ApiProperty } from '@nestjs/swagger';
import { ServicesID } from 'src/services/dto/create-service.dto';
import { BaseHotelDTO } from './base-hotel.dto';

export class CreateHotelDTO extends BaseHotelDTO {
    @ApiProperty({
        type: [ServicesID],
        description: 'list service id',
        default: [
            { idService: '339e035b-369b-4174-b9cf-cdf9b7346f84' },
            { idService: '25edacda-314b-4732-ab2e-a71c8a315eea' },
        ],
    })
    services: [ServicesID];
}
