import { ApiProperty } from '@nestjs/swagger';
import { FilterPaginationBase } from 'src/base/filter.pagination.base';

export class FilterPaginationHotel extends FilterPaginationBase {
    @ApiProperty({
        type: String,
        description: 'Hotel Name',
        required: false,
    })
    name: string;
}
