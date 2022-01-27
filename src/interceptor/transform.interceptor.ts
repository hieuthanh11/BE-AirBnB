import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
    statusCode: number;
    message: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        console.log('end');
        return next.handle().pipe(
            map((data: T) => {
                return {
                    message: 'success',
                    data,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    statusCode: context.switchToHttp().getResponse().statusCode as number,
                };
            }),
        );
    }
}
