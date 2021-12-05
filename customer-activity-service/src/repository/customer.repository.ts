import CustomerModel from "../db/model/customer.model";
import { DatabaseException } from "../exception/custom.exception";
import BaseRepository from "./base.repository";

class CustomerRepository extends BaseRepository<CustomerModel> {
    
    constructor () {

        super("customer");
    }

    async existCustomerById (customerId: number): Promise<boolean> {
        
        return new Promise((resolve, reject) => {
            
            this.knex.db(this.table)
                .select()
                .where("id", customerId)
                .first()
                .then((customer: CustomerModel) => {
                    resolve(customer != undefined);
                })
                .catch(error => {
                    reject(new DatabaseException(error));
                });
        });
    }
}

const customerRepository = new CustomerRepository();
export default customerRepository;
