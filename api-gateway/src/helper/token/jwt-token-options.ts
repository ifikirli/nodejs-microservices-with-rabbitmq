import config from "../../config";
import * as jwt from "jsonwebtoken";

export default class JwtTokenOptions {

    algorithm: jwt.Algorithm;
    issuer: string;
    audience: string;
    expiresIn: number;

    constructor () {

        this.algorithm = config.JWT_TOKEN_ALGORITHM as jwt.Algorithm;
        this.issuer = config.JWT_ISSUER;
        this.audience = config.JWT_AUDIENCE;
        this.expiresIn = config.JWT_EXPIRES_IN_AS_MINUTE * 60000;
    }
}