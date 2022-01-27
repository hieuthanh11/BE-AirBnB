import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { LoggerService } from 'src/logger/custom.logger';
interface ResponseObject {
    statusCode: number;
    name: string;
    message: string;
    timestamp: string;
    path: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private logger: LoggerService) {}
    catch(
        exception: HttpException | Error,
        host: ArgumentsHost,
    ): Response<ResponseObject, Record<string, ResponseObject>> {
        const context: HttpArgumentsHost = host.switchToHttp();
        const response: Response = context.getResponse<Response>();
        const request: Request = context.getRequest<Request>();
        this.handleMessage(exception);

        const status: number = exception instanceof HttpException && exception.getStatus();

        if (
            (exception instanceof HttpException &&
                exception.getStatus() === HttpStatus.UNAUTHORIZED) ||
            (exception instanceof HttpException && exception.getStatus() === HttpStatus.FORBIDDEN)
        ) {
            (exception.getResponse() as Error).message =
                'You do not have permission to access this resource';
        }
        let mess = '';
        switch (exception instanceof HttpException && exception.getStatus()) {
            case HttpStatus.BAD_REQUEST:
                if (
                    Array.isArray(
                        (
                            exception instanceof HttpException &&
                            (exception.getResponse() as { error: string; message: string[] })
                        ).message,
                    )
                ) {
                    mess = (
                        exception instanceof HttpException &&
                        (exception.getResponse() as { error: string; message: string[] })
                    ).message[0];
                    break;
                }
                mess =
                    exception instanceof HttpException &&
                    (exception.getResponse() as { error: string; message: string }).message;
                break;
            case HttpStatus.NOT_FOUND:
                mess =
                    exception instanceof HttpException &&
                    (exception.getResponse() as { error: string; message: string }).error;
                break;
            case HttpStatus.FORBIDDEN:
                mess =
                    exception instanceof HttpException &&
                    (exception.getResponse() as Error).message;
                break;
            default:
                mess = exception.message;
                break;
        }
        const dataResponse: ResponseObject = {
            statusCode: status,
            name: exception instanceof HttpException && exception.name,
            message: mess,
            timestamp: new Date().toISOString(),
            path: request.url,
        };
        return response.status(status).json(dataResponse) as Response<
            ResponseObject,
            Record<string, ResponseObject>
        >;
    }

    private handleMessage(exception: HttpException | Error): void {
        let message = 'Internal Server Error';

        if (exception instanceof HttpException) {
            message = JSON.stringify(exception.getResponse());
        } else if (exception instanceof Error) {
            message = exception.stack.toString();
        }

        this.logger.error(message);
    }
}
