import Joi from "joi";
import { BadRequestException, BusinessException } from "../exception/custom.exception";
import CustomerActivityRequest from "../interface/customer-activity/customer-activity-request";
import logger from "../logger/logger";
import customerActivityRepository from "../repository/customer-activity.repository";
import customerRepository from "../repository/customer.repository";
import CustomResponse from "../response/custom.response";
import ResponseStatusCodes from "../response/response-status-codes";
import * as customerActivityValidationSchemas from "../validation/customer-activity.validation";
import BaseService from "./base.service";

class CustomerActivityService extends BaseService {

    _customerActivityRepository: typeof customerActivityRepository;

    constructor () {

        super();
        this._customerActivityRepository = customerActivityRepository;
        this.add = this.add.bind(this);
    }

    async add (customerActivityRequest: CustomerActivityRequest): Promise<CustomResponse> {
        
        return new Promise(async (resolve, reject) => {

            await customerActivityValidationSchemas.default.add.validateAsync(customerActivityRequest)
                .then(async (customerActivityRequest: CustomerActivityRequest) => {
                    try {
                        if (! await customerRepository.existCustomerById(customerActivityRequest.customerId))
                            throw new BusinessException(ResponseStatusCodes.INVALID_CUSTOMER_ID.code);
                        await this._customerActivityRepository.add({ customer_id : customerActivityRequest.customerId, activity : customerActivityRequest.activity });
                        resolve(this.renderOk());
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

const customerActivityService = new CustomerActivityService();
export default customerActivityService;