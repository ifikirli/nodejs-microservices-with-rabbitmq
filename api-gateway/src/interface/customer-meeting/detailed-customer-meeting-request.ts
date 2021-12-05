import CustomerMeetingRequest from "./customer-meeting-request";

export default interface DetailedCustomerMeetingRequest extends CustomerMeetingRequest {
    
    customer_id: number;
}