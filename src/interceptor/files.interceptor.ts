import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import { MultipleFilesFormDataDTO } from 'src/imageroom/dto/multiplefile-image-imageroom.dto';

interface RequestBody extends Request {
    body: MultipleFilesFormDataDTO;
}
@Injectable()
export class FileToBodyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<RequestBody> {
        const ctx: HttpArgumentsHost = context.switchToHttp();
        const req: RequestBody = ctx.getRequest();
        if (req.body && Array.isArray(req.files) && req.files.length) {
            req.files.forEach((file: Express.Multer.File) => {
                const { fieldname } = file;
                if (!req.body[fieldname]) {
                    req.body[fieldname] = [file];
                } else {
                    if (fieldname == 'images') {
                        req.body[fieldname].push(file);
                    }
                }
            });
        }
        return next.handle().pipe(map((data: RequestBody) => data));
    }
}
