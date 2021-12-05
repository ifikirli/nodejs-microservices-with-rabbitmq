import { CustomerActivities } from "../../enum/customer-activities";

export default interface CustomerActivityRequest {
    
    customerId: number;
    activity: CustomerActivities;
}