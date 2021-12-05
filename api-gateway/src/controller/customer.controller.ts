import * as express from "express";
import BaseController from "./base.controller";
import * as customerValidationSchemas from "../validation/customer.validation";
import UserRegisterRequest from "../interface/customer/user-register-request";
import Joi from "joi";
import { BadRequestException } from "../exception/custom.exception";
import QueueUtil from "../util/queue.util";
import { Queues } from "../enum/queues";
import commonUtil from "../util/common.util";
import CustomResponse from "../response/custom.response";
import logger from "../logger/logger";
import UserLoginRequest from "../interface/customer/user-login-request";
import TokenDto from "../dto/token/token.dto";
import TokenDetail from "../interface/token/token-detail";

class CustomerController extends BaseController {
  
  router: express.Router;

  constructor () {

      super();
      this.router = express.Router();
      this.routes();
  }

  async register (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestBody = request.body;
      customerValidationSchemas.default.register.validateAsync(requestBody)
          .then((userRegisterRequest: UserRegisterRequest) => {
              QueueUtil.sendMessageToRPC(Queues.CUSTOMER_REGISTER, {}, {}, userRegisterRequest)
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

  async login (request: express.Request, response: express.Response, next: express.NextFunction) {
      
      const requestBody = request.body;
      customerValidationSchemas.default.login.validateAsync(requestBody)
          .then((userLoginRequest: UserLoginRequest) => {
              QueueUtil.sendMessageToRPC(Queues.GET_TOKEN, {}, {}, userLoginRequest)
                  .then((customResponse: CustomResponse) => {
                      return this.renderGetDetail(response, new TokenDto(customResponse.data as TokenDetail));
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
      
      this.router.post("/register", this.register.bind(this));
      this.router.post("/login", this.login.bind(this));
  }
}

const customerController = new CustomerController();
export default customerController.router;
