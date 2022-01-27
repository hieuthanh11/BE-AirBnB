import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export const ApiFile =
    (options?: ApiPropertyOptions): PropertyDecorator =>
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    // eslint-disable-next-line @typescript-eslint/ban-types
    (target: Object, propertyKey: string | symbol): void => {
        if (options?.isArray) {
            ApiProperty({
                type: 'array',
                items: {
                    type: 'file',
                    properties: {
                        [propertyKey]: {
                            type: 'string',
                            format: 'binary',
                        },
                    },
                },
            })(target, propertyKey);
        } else {
            ApiProperty({
                type: 'file',
                properties: {
                    [propertyKey]: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            })(target, propertyKey);
        }
    };
