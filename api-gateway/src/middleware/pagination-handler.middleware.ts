/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response, NextFunction } from "express";
import { SortTypes } from "../enum/sort-types";
import PaginationOptions from "../helper/pagnination-options";

export default function handlePagination (request: Request, response: Response, next: NextFunction) {
    
    const paginationOptions = new PaginationOptions();
    if (request.query.order_by)
        paginationOptions.order_by = request.query.order_by.toString();
    if (request.query.sort_by)
        paginationOptions.sort_by = request.query.sort_by.toString() as SortTypes;
    if (request.query.limit)
        paginationOptions.limit = parseInt(request.query.limit.toString());
    if (request.query.skip)
        paginationOptions.skip = parseInt(request.query.skip.toString());
    request.paginationOptions = paginationOptions;
    next();
}