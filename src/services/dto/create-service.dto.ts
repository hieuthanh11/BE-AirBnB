import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ServicesID {
    @ApiProperty({ type: String, description: 'id service' })
    idService: string;
}
export class ListServiceID {
    @ApiProperty({
        type: [ServicesID],
        description: 'list service id',
    })
    services: [ServicesID];
}
export class CreateServicesDto {
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'name' })
    name: string;

    @ApiProperty({ type: String, description: 'desc' })
    desc: string;

    @ApiProperty({ type: Number, description: 'rate' })
    rate: number;
}
