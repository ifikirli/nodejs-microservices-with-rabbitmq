import BaseTimestampsModel from "./base/base-timestamps.model";

export default interface CustomerActivityModel extends BaseTimestampsModel {

    customer_id: number;
    activity: string;
}