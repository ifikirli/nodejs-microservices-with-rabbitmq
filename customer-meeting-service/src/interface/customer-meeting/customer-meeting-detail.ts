export default interface CustomerMeetingDetail {
    
    id: number;
    title: string;
    start_time: Date;
    end_time: Date;
    participants: string[];
}