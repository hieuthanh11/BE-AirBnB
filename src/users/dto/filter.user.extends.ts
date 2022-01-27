import { ApiProperty } from '@nestjs/swagger';
import { FilterPaginationBase } from 'src/base/filter.pagination.base';

export class FilterPaginationUser extends FilterPaginationBase {
    @ApiProperty({
        type: String,
        description: 'Email',
        required: false,
    })
    email: string;

    @ApiProperty({
        type: String,
        description: 'userName',
        required: false,
    })
    userName: string;
}
