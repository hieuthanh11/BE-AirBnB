import { ApiProperty } from '@nestjs/swagger';
import { FilterPaginationBase } from 'src/base/filter.pagination.base';

export class FilterPaginationRoom extends FilterPaginationBase {
    @ApiProperty({
        type: Number,
        description: 'Number Room',
        required: false,
    })
    maPhong: number;
}
