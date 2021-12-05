import BaseModel from "./base/base.model";

export default interface CustomerMeetingParticipantModel extends BaseModel {

    customer_meeting_id: number;
    email: string;
}