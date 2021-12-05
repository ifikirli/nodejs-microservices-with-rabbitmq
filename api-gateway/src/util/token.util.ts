import * as jwt from "jsonwebtoken";
import { BusinessException } from "../exception/custom.exception";
import JwtTokenDetail from "../helper/token/jwt-token-detail";
import logger from "../logger/logger";

export default class TokenUtil {
    
    static verifyToken (token: string): jwt.JwtPayload | string {

        try {
            const jwtTokenDetail = new JwtTokenDetail();
            return jwt.verify(token, jwtTokenDetail.secret, Object.assign({}, jwtTokenDetail.options));
        } catch (error) {
            logger.error(error);
            throw new BusinessException();
        }
    }
}