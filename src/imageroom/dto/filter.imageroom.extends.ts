import { ApiProperty } from '@nestjs/swagger';
import { FilterPaginationBase } from 'src/base/filter.pagination.base';

export class FilterPaginationImageRoom extends FilterPaginationBase {
    @ApiProperty({
        type: Number,
        description: 'MaPhong',
        required: false,
    })
    maPhong: number;
}
