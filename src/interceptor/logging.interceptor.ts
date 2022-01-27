import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        console.log('Before...');
        const now = Date.now();
        return next.handle().pipe(
            tap(() => console.log(`After... ${Date.now() - now}ms`)),
            catchError((err) => {
                console.log('err caught in interceptor', err);
                throw err;
            }),
        );
    }
}
