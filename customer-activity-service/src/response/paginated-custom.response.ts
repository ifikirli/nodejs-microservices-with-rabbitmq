/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomResponse from "./custom.response";

export default class PaginatedCustomResponse extends CustomResponse {

    total_count: number;
    page_size: number;
    offset: number;

    constructor (statusCode: number, totalCount: number, pageSize: number, offset: number, data: any[]) {
         
        super(statusCode, data);
        this.total_count = totalCount;
        this.page_size = pageSize;
        this.offset = offset;
    }
}