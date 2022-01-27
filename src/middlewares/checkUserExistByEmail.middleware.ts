import { UsersService } from '../users/users.service';
import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export interface RequestBody extends Request {
    body: CreateUserDto;
}
@Injectable()
export class CheckMiddlewareUserExistByEmail implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}
    async use(req: RequestBody, res: Response, next: NextFunction): Promise<void | NextFunction> {
        const user: User = await this.usersService.getUserByEmail(req.body.email);
        if (user != undefined) {
            throw new BadRequestException(`${req.body.email} is already exist`);
        }
        return next();
    }
}
