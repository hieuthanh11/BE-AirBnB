import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { RequestBody } from './checkUserExistByEmail.middleware';

@Injectable()
export class CheckMiddlewareUsername implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}
    async use(req: RequestBody, res: Response, next: NextFunction): Promise<void | NextFunction> {
        const user = await this.usersService.getUserByUsername(req.body.userName);

        if (user != undefined) {
            throw new BadRequestException(`${req.body.userName} is already exist `);
        }

        return next();
    }
}
