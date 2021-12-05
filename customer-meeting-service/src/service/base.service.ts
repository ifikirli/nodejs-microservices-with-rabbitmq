/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Response } from "express";
import CustomResponse from "../response/custom.response";
import PaginatedCustomResponse from "../response/paginated-custom.response";
import ResponseStatusCodes from "../response/response-status-codes";

export default abstract class BaseService {
    
    renderOk (statusCode: number = ResponseStatusCodes.SUCCESSFUL_GENERAL_OPERATION.code): CustomResponse {
        
        return new CustomResponse(statusCode);
    }

    renderData (data: any, statusCode: number = ResponseStatusCodes.SUCCESSFUL_GENERAL_OPERATION.code): CustomResponse {
        
        return new CustomResponse(statusCode, data);
    }

    renderInsert (id: number, statusCode: number = ResponseStatusCodes.SUCCESSFUL_INSERT_OPERATION.code): CustomResponse {
        
        return new CustomResponse(statusCode, id);
    }

    renderList (data: any[], statusCode: number = ResponseStatusCodes.SUCCESSFUL_LIST_OPERATION.code): CustomResponse {
        
        return new CustomResponse(statusCode, data);
    }

    renderPaginatedList (data: any, totalCount: number, pageSize: number, offset: number, statusCode: number = ResponseStatusCodes.SUCCESSFUL_LIST_OPERATION.code): PaginatedCustomResponse {

        return new PaginatedCustomResponse(statusCode, totalCount, pageSize, offset, data);
    }

    renderGetDetail (data: any, statusCode: number = ResponseStatusCodes.SUCCESSFUL_GET_DETAIL_OPERATION.code): CustomResponse {
        
        return new CustomResponse(statusCode, data);
    }

    renderUpdate (response: Response, statusCode: number = ResponseStatusCodes.SUCCESSFUL_UPDATE_OPERATION.code): CustomResponse {
        
        return new CustomResponse(statusCode);
    }

    renderDelete (response: Response, statusCode: number = ResponseStatusCodes.SUCCESSFUL_DELETE_OPERATION.code): CustomResponse {
    
        return new CustomResponse(statusCode);
    }
}
