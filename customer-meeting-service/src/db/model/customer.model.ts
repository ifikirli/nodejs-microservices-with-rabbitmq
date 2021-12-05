import BaseTimestampsModel from "./base/base-timestamps.model";

export default interface CustomerModel extends BaseTimestampsModel {

    email: string;
    salt: string;
    password: string;
    last_login?: Date;
}