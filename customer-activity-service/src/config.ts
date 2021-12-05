import dotenv from "dotenv";
import logger from "./logger/logger";

dotenv.config();

class Config {
    
    NODE_ENV: string;
    PORT: number;
    RABBITMQ_URL: string;
    POSTGRES_URL: string;
    POSTGRES_POOL_MIN: number;
    POSTGRES_POOL_MAX: number;

    constructor () {

        this.NODE_ENV = process.env.NODE_ENV || "development";
        this.PORT = parseInt(process.env.PORT as string) || 3002;
        this.RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
        this.POSTGRES_URL = process.env.POSTGRES_URL || "postgres://microservicedb_user:123456@localhost:5442/microservicedb";
        this.POSTGRES_POOL_MIN = parseInt(process.env.POSTGRES_POOL_MIN as string) || 1;
        this.POSTGRES_POOL_MAX = parseInt(process.env.POSTGRES_POOL_MAX as string) || 5;
        logger.info(`NODE_ENV :: ${this.NODE_ENV}`);
        logger.info(`PORT :: ${this.PORT}`);
        logger.info(`RABBITMQ_URL :: ${this.RABBITMQ_URL}`);
        logger.info(`POSTGRES_URL :: ${this.POSTGRES_URL}`);
        logger.info(`POSTGRES_POOL_MIN :: ${this.POSTGRES_POOL_MIN}`);
        logger.info(`POSTGRES_POOL_MAX :: ${this.POSTGRES_POOL_MAX}`);
        logger.info("[Config] loaded.");
    }
}

const config = new Config();
export default config;