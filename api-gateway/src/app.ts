/* eslint-disable @typescript-eslint/no-namespace */
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { StatusCodes } from "http-status-codes";
import config from "./config";
import commonController from "./controller/common.controller";
import customerMeetingController from "./controller/customer-meeting.controller";
import customerController from "./controller/customer.controller";
import knexdb from "./db/knex";
import PaginationOptions from "./helper/pagnination-options";
import logger from "./logger/logger";
import handleCustomException from "./middleware/exception/exception-handler.middleware";
import handleNotFoundException from "./middleware/exception/not-found-handler.middleware";
import QueueUtil from "./util/queue.util";

declare global {
    namespace Express {
        export interface Request {
    
            userId: string;
            requestTime: Date;
            paginationOptions: PaginationOptions;
        }
    }
}

class ApiGateway {

    app: express.Application;
    appRouter: express.Router;
    server: http.Server;

    constructor () {

        this.app = express();
        this.appRouter = express.Router();
        this.server = new http.Server;
    }

    init (): Promise<void> {
        
        return new Promise(async (resolve, reject) => {

            try {

                this.setRequestTime();
                await knexdb.init();
                await this.initializeQueues();
                this.initializeMiddlewares();
                this.initializeLoggingFilter();
                this.initializeAppRouters();
                this.registerExceptionHandlers();
                logger.info("[App initialization] was completed.");
                resolve();
    
            } catch (error) {
                logger.error(error);                
                reject(error);
            }
        });
    }

    private setRequestTime () {

        this.app.use(function (request: Request, response: Response, next: NextFunction) {
    
            request.requestTime = new Date();
            next();
        });
    }

    private async initializeQueues (): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                await QueueUtil.connect();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    private initializeMiddlewares () {
        
        this.app.use(cors());
        this.app.use(express.json({ limit : "5mb" }));
        this.app.use(express.urlencoded({ extended : false, limit : "5mb" }));
        logger.info("[Middlewares] were initialized.");
    }

    private initializeLoggingFilter () {
        
        this.app.use(function (request: Request, response: Response, next: NextFunction) {
        
            response.on("finish", function () {
    
                const duration = new Date().getTime() - request.requestTime.getTime();
                const userId = request.userId ? request.userId : "Anonim";
                const logContext = `${userId} | ${request.method} | ${request.originalUrl} | ${response.statusCode} | ${duration} ms`;
    
                if (response.statusCode == StatusCodes.OK || response.statusCode == StatusCodes.CREATED || response.statusCode == StatusCodes.NOT_MODIFIED)
                    logger.info(logContext);
                else
                    logger.error(logContext);
            });
            next();
        });
    }
    
    private initializeAppRouters () {
        
        const apiPath = "/api";
        this.app.use(apiPath, this.appRouter);
        this.appRouter.use("/common", commonController);
        this.appRouter.use("/customer", customerController);
        this.appRouter.use("/customer_meeting", customerMeetingController);
        logger.info("[AppRouters] were initialized.");
    }

    private registerExceptionHandlers () {
        
        this.app.use(handleCustomException);
        this.app.use(handleNotFoundException);
    }

    listen (): Promise<void> {

        return new Promise((resolve, reject) => {

            this.server = http.createServer(this.app);
            this.server.on("error", (error: Error) => {

                reject(error);
                process.exit(2);
            });

            this.server.listen(config.PORT, () => {

                logger.info(`[App] was started at port: ${config.PORT}`);
                resolve();
            });
        });
    }
}

const app = new ApiGateway();
export default app;