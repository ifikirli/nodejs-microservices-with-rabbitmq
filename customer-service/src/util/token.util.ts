import * as jwt from "jsonwebtoken";
import config from "../config";
import { BusinessException } from "../exception/custom.exception";
import JwtTokenDetail from "../helper/token/jwt-token-detail";
import TokenDetail from "../interface/token/token-detail";
import logger from "../logger/logger";
import ResponseStatusCodes from "../response/response-status-codes";

export default class TokenUtil {
    
    static getToken (customerId: string): TokenDetail {
        
        try {
            const jwtTokenDetail = new JwtTokenDetail();
            const token = jwt.sign({ sub : customerId }, config.JWT_SECRET, Object.assign({}, jwtTokenDetail.options));
            return { accessToken : token, expiresIn : jwtTokenDetail.options.expiresIn };
        } catch (error) {
            logger.error(error);
            throw new BusinessException(ResponseStatusCodes.TOKEN_CREATE_ERROR.code);
        }
    }
}