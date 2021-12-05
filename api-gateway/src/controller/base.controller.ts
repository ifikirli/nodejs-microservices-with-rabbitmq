/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import CustomResponse from "../response/custom.response";
import PaginatedCustomResponse from "../response/paginated-custom.response";
import ResponseStatusCodes from "../response/response-status-codes";

export default abstract class BaseController {
    
    renderOk (response: Response, statusCode: number = ResponseStatusCodes.SUCCESSFUL_GENERAL_OPERATION.code): Response {
        
        response.status(StatusCodes.OK).send(new CustomResponse(statusCode));
        return response;
    }

    renderData (response: Response, data: any, statusCode: number = ResponseStatusCodes.SUCCESSFUL_GENERAL_OPERATION.code): Response {
        
        response.status(StatusCodes.OK).send(new CustomResponse(statusCode, data));
        return response;
    }

    renderInsert (response: Response, id: string, statusCode: number = ResponseStatusCodes.SUCCESSFUL_INSERT_OPERATION.code): Response {
        
        response.status(StatusCodes.CREATED).send(new CustomResponse(statusCode, id));
        return response;
    }

    renderList (response: Response, data: any[], statusCode: number = ResponseStatusCodes.SUCCESSFUL_LIST_OPERATION.code): Response {
        
        response.status(StatusCodes.OK).send(new CustomResponse(statusCode, data));
        return response;
    }

    renderPaginatedList (response: Response, data: any, totalCount: number, pageSize: number, offset: number, statusCode: number = ResponseStatusCodes.SUCCESSFUL_LIST_OPERATION.code): Response {

        response.status(StatusCodes.OK).send(new PaginatedCustomResponse(statusCode, totalCount, pageSize, offset, data));
        return response;
    }

    renderGetDetail (response: Response, data: any, statusCode: number = ResponseStatusCodes.SUCCESSFUL_GET_DETAIL_OPERATION.code): Response {
        
        response.status(StatusCodes.OK).send(new CustomResponse(statusCode, data));
        return response;
    }

    renderUpdate (response: Response, statusCode: number = ResponseStatusCodes.SUCCESSFUL_UPDATE_OPERATION.code): Response {
        
        response.status(StatusCodes.OK).send(new CustomResponse(statusCode));
        return response;
    }

    renderDelete (response: Response, statusCode: number = ResponseStatusCodes.SUCCESSFUL_DELETE_OPERATION.code): Response {
    
        response.status(StatusCodes.OK).send(new CustomResponse(statusCode));
        return response;
    }
}
