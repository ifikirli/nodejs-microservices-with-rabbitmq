/* eslint-disable @typescript-eslint/no-namespace */
import cors from "cors";
import express from "express";
import http from "http";
import config from "./config";
import knexdb from "./db/knex";
import { ExchangeTypes } from "./enum/exchange-types";
import { Exchanges } from "./enum/exchanges";
import { Queues } from "./enum/queues";
import logger from "./logger/logger";
import customerActivityService from "./service/customer-activity.service";
import QueueUtil from "./util/queue.util";

class CustomerActivityServiceApi {

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

                await knexdb.init();
                await this.initializeQueues();
                this.initializeMiddlewares();
                this.initializeAppRouters();
                logger.info("[App initialization] was completed.");
                resolve();
    
            } catch (error) {
                logger.error(error);                
                reject(error);
            }
        });
    }

    private async initializeQueues (): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                await QueueUtil.connect();
                await QueueUtil.consumeQueue(Queues.CUSTOMER_ACTIVITY, 1, {}, { noAck : true }, customerActivityService.add);
                await QueueUtil.consumeExchange(Exchanges.TOPIC_MEETING, ExchangeTypes.TOPIC, "meeting.create.#", { durable : false }, { noAck : true }, customerActivityService.add);
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }

    private initializeMiddlewares () {
        
        this.app.use(cors());
        this.app.use(express.json({ limit : "5mb" }));
        this.app.use(express.urlencoded({ extended : false, limit : "5mb" }));
        logger.info("[Middlewares] were initialized.");
    }

    private initializeAppRouters () {
        
        const apiPath = "/api";
        this.app.use(apiPath, this.appRouter);
        logger.info("[AppRouters] were initialized.");
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

const app = new CustomerActivityServiceApi();
export default app;