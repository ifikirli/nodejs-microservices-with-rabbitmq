/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class CustomResponse {

    status_code: number;
    data?: any;

    constructor (statusCode: number, data?: any) {
         
        this.status_code = statusCode;
        this.data = data;
    }
}