import CustomerMeetingDetail from "./customer-meeting-detail";

export default interface PaginatedCustomerMeetings {
    
    data: CustomerMeetingDetail[];
    totalCount : number;
    pageSize : number;
    offset : number;
}