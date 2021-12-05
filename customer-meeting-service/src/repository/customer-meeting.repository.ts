import { Knex } from "knex";
import CustomerMeetingModel from "../db/model/customer-meeting.model";
import { DatabaseException } from "../exception/custom.exception";
import PaginationOptions from "../helper/pagnination-options";
import CustomerMeetingDetail from "../interface/customer-meeting/customer-meeting-detail";
import PaginatedCustomerMeetings from "../interface/customer-meeting/paginated-customer-meetings";
import BaseRepository from "./base.repository";
import customerMeetingParticipantRepository from "./customer-meeting-participant.repository";

class CustomerMeetingRepository extends BaseRepository<CustomerMeetingModel> {
    
    constructor () {

        super("customer_meeting");
    }

    async existMeetingInDateRange (customerId: number, startTime: Date, endTime: Date): Promise<boolean> {

        return new Promise((resolve, reject) => {
            
            this.knex.db(this.table)
                .select()
                .where("customer_id", customerId)
                .where(function () {
                    this.where(function () {
                        this.where("start_time", ">=", startTime)
                        this.where("start_time", "<", endTime)
                    })
                    this.orWhere(function () {
                        this.where("end_time", ">", startTime)
                        this.where("end_time", "<", endTime)
                    })
                })
                .first()
                .then((customerMeeting: CustomerMeetingModel) => {
                    resolve(customerMeeting != undefined);
                })
                .catch(error => {
                    reject(new DatabaseException(error));
                });
        });
    }

    async list (customerId: number, paginationOptions: PaginationOptions, title?: string) : Promise<PaginatedCustomerMeetings> {

        return new Promise((resolve, reject) => {
            
            this.knex.db(`${this.table} as cm`)
                .select()
                .where((builder) => {
                    this.buildCustomerMeetingCriteria(builder, customerId, title);
                })
                .orderBy(paginationOptions.order_by, paginationOptions.sort_by)
                .limit(paginationOptions.limit)
                .offset(paginationOptions.skip)
                .then(async (customerMeetings: CustomerMeetingDetail[]) => {
                    if (!customerMeetings || customerMeetings.length <= 0)
                        resolve({ data : customerMeetings,
                            totalCount : 0,
                            pageSize : paginationOptions.limit,
                            offset : paginationOptions.skip,
                        });
                    else {
                        const subPromise = new Promise<void>((_resolve) => {

                            customerMeetings.forEach(async (customerMeeting, index) => {
                                customerMeeting.participants = await customerMeetingParticipantRepository.listByMeetingId(customerMeeting.id);
                                if (index == customerMeetings.length-1)
                                    _resolve();
                            });
                        });
                        subPromise.then(async () => {
                            resolve({ data : customerMeetings,
                                totalCount : await this.getTotalCustomerMeetingCount(customerId, title),
                                pageSize : paginationOptions.limit,
                                offset : paginationOptions.skip,
                            });
                        });
                    }
                })
                .catch(error => {
                    reject(new DatabaseException(error));
                });
        });
    }

    getTotalCustomerMeetingCount (customerId: number, title?: string): Promise<number> {
        
        return new Promise((resolve, reject) => {
      
            this.knex.db(`${this.table} as cm`)
                .count({ count : "cm.*" })
                .where((builder) => {
                    this.buildCustomerMeetingCriteria(builder, customerId, title);
                })
                .then((response) => {
                    resolve(response[0].count as number);
                })
                .catch(error => {
                    reject(new DatabaseException(error));
                });
        });
    }
    
    buildCustomerMeetingCriteria (builder: Knex.QueryBuilder, customerId: number, title?: string) {
        
        builder.where("cm.customer_id", customerId);
        if (title)
            builder.where("cm.title", "ilike", `%${title}%`);
    }
}

const customerMeetingRepository = new CustomerMeetingRepository();
export default customerMeetingRepository;
