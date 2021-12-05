import bcrypt from "bcrypt";
import Joi from "joi";
import config from "../config";
import { CustomerActivities } from "../enum/customer-activities";
import { Queues } from "../enum/queues";
import { BadRequestException, BusinessException } from "../exception/custom.exception";
import UserLoginRequest from "../interface/customer/user-login-request";
import UserRegisterRequest from "../interface/customer/user-register-request";
import logger from "../logger/logger";
import customerRepository from "../repository/customer.repository";
import CustomResponse from "../response/custom.response";
import ResponseStatusCodes from "../response/response-status-codes";
import commonUtil from "../util/common.util";
import QueueUtil from "../util/queue.util";
import TokenUtil from "../util/token.util";
import * as customerValidationSchemas from "../validation/customer.validation";
import BaseService from "./base.service";

class CustomerService extends BaseService {

    _customerRepository: typeof customerRepository;

    constructor () {

        super();
        this._customerRepository = customerRepository;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    async register (userRegisterRequest: UserRegisterRequest): Promise<CustomResponse> {
        
        return new Promise(async (resolve, reject) => {

            await customerValidationSchemas.default.register.validateAsync(userRegisterRequest)
                .then(async (userRegisterRequest: UserRegisterRequest) => {
                    try {
                        if (await this._customerRepository.getByEmail(userRegisterRequest.email))
                            throw new BusinessException(ResponseStatusCodes.EXIST_EMAIL.code);
                        const salt = bcrypt.genSaltSync(config.SALT_ROUND);
                        const password = bcrypt.hashSync(userRegisterRequest.password, salt);
                        const customerId = await this._customerRepository.add({ email : userRegisterRequest.email, salt : salt, password : password });
                        try {
                            QueueUtil.sendMessageToQueue(Queues.CUSTOMER_ACTIVITY, {}, {}, { customerId : customerId, activity : CustomerActivities.CUSTOMER_REGISTER });
                        } catch (error) {
                            logger.error(error);
                        }
                        resolve(this.renderInsert(customerId));
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

    async login (userRegisterRequest: UserRegisterRequest): Promise<CustomResponse> {
        
        return new Promise(async (resolve, reject) => {

            await customerValidationSchemas.default.login.validateAsync(userRegisterRequest)
                .then(async (userLoginRequest: UserLoginRequest) => {
                    try {
                        const customer = await this._customerRepository.getByEmail(userLoginRequest.email)
                        if (!customer || !customer.id)
                            throw new BusinessException(ResponseStatusCodes.NO_USER_RECORD.code);
                        const password = bcrypt.hashSync(userLoginRequest.password, customer.salt);
                        if (customer.password != password)
                            throw new BusinessException(ResponseStatusCodes.NO_USER_RECORD.code);
                        const tokenDetail = TokenUtil.getToken(commonUtil.encode(customer.id));
                        this._customerRepository.updateLastLogin(customer.id, new Date());
                        resolve(this.renderGetDetail(tokenDetail));
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

const customerService = new CustomerService();
export default customerService;