import { ApiProperty } from '@nestjs/swagger';
export class FilterPaginationBase {
    @ApiProperty({
        type: String,
        description: 'SizePage(Summary of element on page)',
        default: '5',
        required: false,
    })
    sizePage: string | number;

    @ApiProperty({
        type: String,
        description: 'NumberPage(Total number element on current page)',
        default: '1',
        required: false,
    })
    numberPage: string | number;
}

export interface IPaginateResponse<T> {
    result: T[];

    count: number;

    currentPage: number;

    nextPage: number;

    prevPage: number;

    lastPage: number;
}

export function paginateResponse<T>(
    data: [T[], number],
    page: number,
    limit: number,
): IPaginateResponse<T> {
    const [result, total]: [T[], number] = data;
    const lastPage: number = Math.ceil(total / limit);
    const nextPage: number = page + 1 > lastPage ? null : page + 1;
    const prevPage: number = page - 1 < 1 ? null : page - 1;
    return {
        result: result,
        count: total,
        currentPage: page,
        nextPage: nextPage,
        prevPage: prevPage,
        lastPage: lastPage,
    };
}
