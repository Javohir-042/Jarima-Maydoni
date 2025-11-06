import { createParamDecorator, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { JwtPayload, JwtPayloadWithRefreshToken } from "../types";
export const GetCurrentUser = createParamDecorator(
    (data: keyof JwtPayloadWithRefreshToken, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayloadWithRefreshToken;


        if (!user) {
            throw new ForbiddenException("Token noto'g'ri")
        }

        if (!data) {
            return user;
        }
        return user[data];
    }
)