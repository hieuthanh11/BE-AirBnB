/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException } from '@nestjs/common';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
interface Query {
    query: { sizePage: number | string; numberPage: number | string };
}
type RequestExtend = Request & Query;
@Injectable()
export class PagerMiddleware implements NestMiddleware {
    use(req: RequestExtend, res: Response, next: NextFunction): void {
        const numberPage: string = (req.query.numberPage as string)
            ? (req.query.numberPage as string)
            : '1';

        const sizePage: string = (req.query.sizePage as string)
            ? (req.query.sizePage as string)
            : '5';
        if (!numberPage.match(/^[0-9]+$/)) {
            throw new BadRequestException({ error: `${req.query.numberPage} must be number` });
        }
        if (!sizePage.match(/^[0-9]+$/)) {
            throw new BadRequestException({ error: `${req.query.sizePage} must be number` });
        }
        req.query.numberPage = +req.query.numberPage || 1;
        req.query.sizePage = +req.query.sizePage || 5;
        return next();
    }
}
