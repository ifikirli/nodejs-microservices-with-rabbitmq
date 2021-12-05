import { Hours } from "../../enum/hours";

export default interface CustomerMeetingRequest {
    
    title: string;
    meeting_day: Date;
    start_time: Hours;
    end_time: Hours;
    participants: string[];
    customer_id: number;
}