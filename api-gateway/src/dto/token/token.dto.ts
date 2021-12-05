import TokenDetail from "../../interface/token/token-detail";

export default class TokenDto {
    
    access_token: string;
    expires_in: number;

    constructor (tokenDetail: TokenDetail) {
        
        this.access_token = tokenDetail.accessToken;
        this.expires_in = tokenDetail.expiresIn;
    }
}