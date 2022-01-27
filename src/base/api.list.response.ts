/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ApiListResponse = <TModel extends Type<unknown>>(model: TModel) => {
    return applyDecorators(
        ApiOkResponse({
            schema: {
                allOf: [
                    {
                        properties: {
                            count: {
                                type: 'number',
                            },
                            currentPage: {
                                type: 'number',
                            },
                            nextPage: {
                                type: 'number',
                                nullable: true,
                            },
                            prevPage: {
                                type: 'number',
                                nullable: true,
                            },
                            lastPage: {
                                type: 'number',
                                nullable: true,
                            },
                            result: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                    },
                ],
            },
        }),
    );
};
