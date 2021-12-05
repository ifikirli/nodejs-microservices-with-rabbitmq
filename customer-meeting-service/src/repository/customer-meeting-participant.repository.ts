import CustomerMeetingParticipantModel from "../db/model/customer-meeting-participant.model";
import { DatabaseException } from "../exception/custom.exception";
import BaseRepository from "./base.repository";

class CustomerMeetingParticipantRepository extends BaseRepository<CustomerMeetingParticipantModel> {
    
    constructor () {

        super("customer_meeting_participant");
    }

    listByMeetingId (customerMeetingId: number): Promise<string[]> {
        
        return new Promise((resolve, reject) => {
            
            this.knex.db(this.table)
                .select()
                .where("customer_meeting_id", customerMeetingId)
                .then((customerMeetingParticipants: CustomerMeetingParticipantModel[]) => {
                    resolve(customerMeetingParticipants.map(it => 
                        it.email));
                })
                .catch(error => {
                    reject(new DatabaseException(error));
                });
        });
    }
}

const customerMeetingParticipantRepository = new CustomerMeetingParticipantRepository();
export default customerMeetingParticipantRepository;
