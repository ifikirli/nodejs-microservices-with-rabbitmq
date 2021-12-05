import CustomerModel from "../db/model/customer.model";
import { DatabaseException } from "../exception/custom.exception";
import BaseRepository from "./base.repository";

class CustomerRepository extends BaseRepository<CustomerModel> {
    
    constructor () {

        super("customer");
    }

    async getByEmail (email: string): Promise<CustomerModel> {
        
        return new Promise((resolve, reject) => {
            
            this.knex.db(this.table)
                .select()
                .where("email", email)
                .first()
                .then((customer: CustomerModel) => {
                    resolve(customer);
                })
                .catch(error => {
                    reject(new DatabaseException(error));
                });
        });
    }

    async updateLastLogin (customerId: number, lastLogin: Date): Promise<void> {
        
        return new Promise((resolve, reject) => {
            
            this.knex.db(this.table)
                .where("id", customerId)
                .update({ last_login : lastLogin })
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(new DatabaseException(error));
                });
        });
    }
}

const customerRepository = new CustomerRepository();
export default customerRepository;
