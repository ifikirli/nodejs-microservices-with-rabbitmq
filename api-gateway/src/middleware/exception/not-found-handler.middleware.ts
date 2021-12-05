/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export default function handleNotFoundException (request: Request, response: Response, next: NextFunction): void {
  
    response.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
}