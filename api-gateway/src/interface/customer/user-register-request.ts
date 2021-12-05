import UserLoginRequest from "./user-login-request";

export default interface UserRegisterRequest extends UserLoginRequest {
    
    password_confirmation: string;
}