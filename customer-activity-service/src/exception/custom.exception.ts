/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import logger from "../logger/logger";
import ResponseStatusCodes from "../response/response-status-codes";

export class CustomException extends Error {

    status: StatusCodes;
    status_code: number;
    validation_errors?: ValidationError[];

    constructor (status: StatusCodes, statusCode: number, validationErrors?: ValidationError[]) {

        super();
        this.status = status;
        this.status_code = statusCode;
        this.validation_errors = validationErrors;
    }
}

export class TokenNotFoundException extends CustomException {

    constructor () {

        super(StatusCodes.UNAUTHORIZED, ResponseStatusCodes.TOKEN_NOT_FOUND.code);
    }
}

export class TokenVerificationException extends CustomException {

    constructor (statusCode : number = ResponseStatusCodes.TOKEN_VERIFICATION_ERROR.code) {

        super(StatusCodes.UNAUTHORIZED, statusCode);
    }
}

export class AuthorizationException extends CustomException {

    constructor (statusCode: number = ResponseStatusCodes.NO_PERMISSION_FOR_OPERATION.code) {

        super(StatusCodes.FORBIDDEN, statusCode);
    }
}

export class BusinessException extends CustomException {

    constructor (statusCode: number = ResponseStatusCodes.BUSINESS_EXCEPTION.code) {

        super(StatusCodes.INTERNAL_SERVER_ERROR, statusCode);
    }
}

export class InvalidParamsException extends CustomException {
    
    constructor (statusCode: number = ResponseStatusCodes.INVALID_PARAMETERS.code) {
        
        super(StatusCodes.BAD_REQUEST, statusCode);
    }
}

export class BadRequestException extends CustomException {

    constructor (error: Joi.ValidationError) {

        logger.error(error);
        super(StatusCodes.BAD_REQUEST, ResponseStatusCodes.GENERAL_VALIDATION_ERROR.code);
        this.validation_errors = [];
        for (const errorDetail of error.details) {
            const key = errorDetail.path as unknown;
            this.validation_errors.push({ [key as string] : errorDetail.message });
        }
    }
}

export class DatabaseException extends CustomException {

    constructor (error: any) {
        
        logger.error(error);
        super(StatusCodes.INTERNAL_SERVER_ERROR, ResponseStatusCodes.DB_EXCEPTION.code);
    }
}

export class ValidationError {
    
    [key: string]: string
}