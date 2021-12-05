import CustomerActivityModel from "../db/model/customer-activity.model";
import BaseRepository from "./base.repository";

class CustomerActivityRepository extends BaseRepository<CustomerActivityModel> {
    
    constructor () {

        super("customer_activity");
    }
}

const customerActivityRepository = new CustomerActivityRepository();
export default customerActivityRepository;
