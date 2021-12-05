/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CustomException } from "../../exception/custom.exception";

export default function handleCustomException (customException: CustomException, request: Request, response: Response, next: NextFunction): void {

    const { ["status"] : deletedFields, ...otherFields } = customException;
    response.status(customException.status).send(otherFields);
}