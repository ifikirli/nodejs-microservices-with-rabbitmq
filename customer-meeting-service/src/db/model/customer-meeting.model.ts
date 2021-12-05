import BaseTimestampsModel from "./base/base-timestamps.model";

export default interface CustomerMeetingModel extends BaseTimestampsModel {

    title: string;
    customer_id: number;
    start_time: Date;
    end_time: Date;
}