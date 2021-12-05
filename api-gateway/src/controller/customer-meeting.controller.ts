/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from "express";
import Joi from "joi";
import CustomerMeetingDto from "../dto/customer-meeting/customer-meeting.dto";
import { Queues } from "../enum/queues";
import { BadRequestException, TokenVerificationException } from "../exception/custom.exception";
import CustomerMeetingListRequest from "../helper/customer-meeting/customer-meeting-list-request";
import CustomerMeetingDetail from "../interface/customer-meeting/customer-meeting-detail";
import CustomerMeetingRequest from "../interface/customer-meeting/customer-meeting-request";
import DetailedCustomerMeetingRequest from "../interface/customer-meeting/detailed-customer-meeting-request";
import logger from "../logger/logger";
import handlePagination from "../middleware/pagination-handler.middleware";
import handleToken from "../middleware/token-handler.middleware";
import CustomResponse from "../response/custom.response";
import ResponseStatusCodes from "../response/response-status-codes";
import commonUtil from "../util/common.util";
import QueueUtil from "../util/queue.util";
import * as customerMeetingValidationSchemas from "../validation/customer-meeting.validation";
import BaseController from "./base.controller";

class CustomerMeetingController extends BaseController {
  
  router: express.Router;

  constructor () {

      super();
      this.router = express.Router();
      this.routes();
  }

  async add (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestBody = request.body;
      customerMeetingValidationSchemas.default.add.validateAsync(requestBody)
          .then((customerMeetingRequest: CustomerMeetingRequest) => {
              const customerId = commonUtil.decode(request.userId);
              if (!customerId)
                  return next(new TokenVerificationException(ResponseStatusCodes.NO_VALID_USER_INFO_IN_TOKEN.code));
              const detailedCustomerMeetingRequest = Object.assign({}, customerMeetingRequest as DetailedCustomerMeetingRequest);
              detailedCustomerMeetingRequest.customer_id = customerId as number;
              QueueUtil.sendMessageToRPC(Queues.CUSTOMER_MEETING, {}, {}, detailedCustomerMeetingRequest)
                  .then((customResponse: CustomResponse) => {
                      return this.renderInsert(response, commonUtil.encode(customResponse.data));
                  })
                  .catch(error => {
                      logger.error(error);
                      next(error);
                  });
          })
          .catch((error: Joi.ValidationError) => {
              next(new BadRequestException(error));
          });
  }

  async list (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestQuery = request.query;
      customerMeetingValidationSchemas.default.list.validateAsync(requestQuery)
          .then((customerMeetingListRequest: CustomerMeetingListRequest) => {
              const customerId = commonUtil.decode(request.userId);
              if (!customerId)
                  return next(new TokenVerificationException(ResponseStatusCodes.NO_VALID_USER_INFO_IN_TOKEN.code));
              QueueUtil.sendMessageToRPC(Queues.CUSTOMER_MEETING_LIST, {}, {}, { customerId : customerId as number, title : customerMeetingListRequest.title, paginationOptions : request.paginationOptions })
                  .then((paginatedCustomResponse: any) => {
                      return this.renderPaginatedList(response, paginatedCustomResponse.data.map((it: CustomerMeetingDetail) => 
                          new CustomerMeetingDto(it)), paginatedCustomResponse.total_count, paginatedCustomResponse.page_size, paginatedCustomResponse.offset);
                  })
                  .catch(error => {
                      logger.error(error);
                      next(error);
                  });
          })
          .catch((error: Joi.ValidationError) => {
              next(new BadRequestException(error));
          });
  }

  routes (): void {
      
      this.router.post("", handleToken, this.add.bind(this));
      this.router.get("", handleToken, handlePagination, this.list.bind(this));
  }
}

const customerMeetingController = new CustomerMeetingController();
export default customerMeetingController.router;
