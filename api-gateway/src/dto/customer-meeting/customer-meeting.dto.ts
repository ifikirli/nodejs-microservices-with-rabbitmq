import CustomerMeetingDetail from "../../interface/customer-meeting/customer-meeting-detail";
import commonUtil from "../../util/common.util";

export default class CustomerMeetingDto {
    
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    participants: string [];

    constructor (customerMeetingDetail: CustomerMeetingDetail) {
        
        this.id = commonUtil.encode(customerMeetingDetail.id);
        this.title = customerMeetingDetail.title;
        this.start_time = commonUtil.formatDate(customerMeetingDetail.start_time, "YYYY-MM-DD HH:mm");
        this.end_time = commonUtil.formatDate(customerMeetingDetail.end_time, "YYYY-MM-DD HH:mm");
        this.participants = customerMeetingDetail.participants;
    }
}