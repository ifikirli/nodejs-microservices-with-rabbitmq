import CustomerModel from "../db/model/customer.model";
import BaseRepository from "./base.repository";

class CustomerRepository extends BaseRepository<CustomerModel> {
    
    constructor () {

        super("customer");
    }
}

const customerRepository = new CustomerRepository();
export default customerRepository;
