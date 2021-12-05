import config from "../../config";
import JwtTokenOptions from "./jwt-token-options";

export default class JwtTokenDetail {

    secret: string;
    options: JwtTokenOptions;

    constructor () {

        this.secret = config.JWT_SECRET;
        this.options = new JwtTokenOptions();
    }
}