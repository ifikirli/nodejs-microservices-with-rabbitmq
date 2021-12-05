import { NextFunction, Request, Response } from "express";
import { TokenNotFoundException, TokenVerificationException } from "../exception/custom.exception";
import ResponseStatusCodes from "../response/response-status-codes";
import TokenUtil from "../util/token.util";

export default function handleToken (request: Request, response: Response, next: NextFunction): void {
    
    let token = request.headers["x-authorization"] || request.headers["authorization"];

    if (!token)
        next(new TokenNotFoundException());
    else {
        token = token.toString().replace("Bearer ", "");
        try {
            const jwtPayload = TokenUtil.verifyToken(token);
            if (!jwtPayload)
                return next(new TokenVerificationException());
            request.userId = jwtPayload["sub"] as string;
            if (!request.userId)
                return next(new TokenVerificationException(ResponseStatusCodes.NO_USER_ID_IN_TOKEN.code));
            next();
        } catch (error) {
            next(error);
        }
    }
}