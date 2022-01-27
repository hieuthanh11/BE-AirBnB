import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
type BodyUser = Request & { user: User };
export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User => {
    const reqBody: BodyUser = ctx.switchToHttp().getRequest<BodyUser>();
    return reqBody.user;
});
