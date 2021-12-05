import Joi from "joi";
import { CustomerActivities } from "../enum/customer-activities";
import { ExchangeTypes } from "../enum/exchange-types";
import { Exchanges } from "../enum/exchanges";
import { BadRequestException, BusinessException } from "../exception/custom.exception";
import CustomerMeetingListRequest from "../helper/customer-meeting/customer-meeting-list-request";
import CustomerMeetingRequest from "../interface/customer-meeting/customer-meeting-request";
import logger from "../logger/logger";
import customerMeetingParticipantRepository from "../repository/customer-meeting-participant.repository";
import customerMeetingRepository from "../repository/customer-meeting.repository";
import customerRepository from "../repository/customer.repository";
import CustomResponse from "../response/custom.response";
import PaginatedCustomResponse from "../response/paginated-custom.response";
import ResponseStatusCodes from "../response/response-status-codes";
import commonUtil from "../util/common.util";
import QueueUtil from "../util/queue.util";
import * as customerMeetingValidationSchemas from "../validation/customer-meeting.validation";
import BaseService from "./base.service";

class CustomerMeetingService extends BaseService {

    _customerMeetingRepository: typeof customerMeetingRepository;

    constructor () {

        super();
        this._customerMeetingRepository = customerMeetingRepository;
        this.add = this.add.bind(this);
        this.list = this.list.bind(this);
    }

    async add (customerMeetingRequest: CustomerMeetingRequest): Promise<CustomResponse> {
        
        return new Promise(async (resolve, reject) => {

            await customerMeetingValidationSchemas.default.add.validateAsync(customerMeetingRequest)
                .then(async (customerMeetingRequest: CustomerMeetingRequest) => {
                    try {
                        const customer = await customerRepository.findById(customerMeetingRequest.customer_id);
                        if (!customer)
                            throw new BusinessException(ResponseStatusCodes.INVALID_CUSTOMER_ID.code);
                        const startTime = commonUtil.setHour(customerMeetingRequest.meeting_day, customerMeetingRequest.start_time);
                        let endTime = commonUtil.setHour(customerMeetingRequest.meeting_day, customerMeetingRequest.end_time);
                        if (endTime < startTime)
                            endTime = commonUtil.addDays(endTime, 1);
                        if (await this._customerMeetingRepository.existMeetingInDateRange(customerMeetingRequest.customer_id, startTime, endTime))
                            throw new BusinessException(ResponseStatusCodes.EXIST_MEETING_IN_DATE_RANGE.code);
                        const customerMeetingId = await this._customerMeetingRepository.add({ customer_id : customerMeetingRequest.customer_id, title : customerMeetingRequest.title, start_time : startTime, end_time : endTime });
                        await this.addParticipantsToMeeting(customerMeetingId, customerMeetingRequest.participants);
                        try {
                            QueueUtil.publishMessageToExchange(Exchanges.TOPIC_MEETING, ExchangeTypes.TOPIC, "meeting.create", { durable : false }, {}, { customerId : customerMeetingRequest.customer_id, activity : CustomerActivities.CUSTOMER_MEETING });
                        } catch (error) {
                            logger.error(error);
                        }
                        resolve(this.renderInsert(customerMeetingId));
                    } catch (error) {
                        logger.error(error);
                        reject(error);
                    }
                })
                .catch((error: Joi.ValidationError) => {
                    reject(new BadRequestException(error));
                });
        });
    }

    async addParticipantsToMeeting (customerMeetingId: number, participants: string[]): Promise<void> {

        return new Promise((resolve) => {
            
            const subPromise = new Promise<void>((_resolve) => {

                participants.forEach(async (participant, index) => {
                    await customerMeetingParticipantRepository.add({ customer_meeting_id : customerMeetingId, email : participant });
                    if (index == participants.length-1)
                        _resolve();
                });
            });
            subPromise.then(() => {
                resolve();
            });
        });
    }

    async list (customerMeetingListRequest: CustomerMeetingListRequest): Promise<PaginatedCustomResponse> {
        
        return new Promise(async (resolve, reject) => {

            await customerMeetingValidationSchemas.default.list.validateAsync(customerMeetingListRequest)
                .then(async (customerMeetingListRequest: CustomerMeetingListRequest) => {
                    try {
                        const customer = await customerRepository.findById(customerMeetingListRequest.customerId);
                        if (!customer)
                            throw new BusinessException(ResponseStatusCodes.INVALID_CUSTOMER_ID.code);
                        const paginatedCustomerMeetings = await this._customerMeetingRepository.list(customerMeetingListRequest.customerId, customerMeetingListRequest.paginationOptions, customerMeetingListRequest.title);
                        resolve(this.renderPaginatedList(paginatedCustomerMeetings.data, paginatedCustomerMeetings.totalCount, paginatedCustomerMeetings.pageSize, paginatedCustomerMeetings.offset));
                    } catch (error) {
                        logger.error(error);
                        reject(error);
                    }
                })
                .catch((error: Joi.ValidationError) => {
                    reject(new BadRequestException(error));
                });
        });
    }
}

const customerMeetingService = new CustomerMeetingService();
export default customerMeetingService;