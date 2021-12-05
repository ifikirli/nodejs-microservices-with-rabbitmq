import dotenv from "dotenv";
import logger from "./logger/logger";

dotenv.config();

class Config {
    
    NODE_ENV: string;
    PORT: number;
    SALT_ROUND: number;
    JWT_SECRET: string;
    JWT_TOKEN_ALGORITHM: string;
    JWT_ISSUER: string;
    JWT_AUDIENCE: string;
    JWT_EXPIRES_IN_AS_MINUTE: number;
    RABBITMQ_URL: string;
    POSTGRES_URL: string;
    POSTGRES_POOL_MIN: number;
    POSTGRES_POOL_MAX: number;
    SALT_TO_ENCODE: string;

    constructor () {

        this.NODE_ENV = process.env.NODE_ENV || "development";
        this.PORT = parseInt(process.env.PORT as string) || 3001;
        this.SALT_ROUND = parseInt(process.env.SALT_ROUND as string) || 8;
        this.JWT_SECRET = process.env.JWT_SECRET || "LtKXw23p";
        this.JWT_TOKEN_ALGORITHM = process.env.JWT_TOKEN_ALGORITHM || "HS256";
        this.JWT_ISSUER = process.env.JWT_ISSUER || "hdyq8KhB";
        this.JWT_AUDIENCE = process.env.JWT_ISSUER || "vdVk9Djm";
        this.JWT_EXPIRES_IN_AS_MINUTE = parseInt(process.env.JWT_EXPIRES_IN_AS_MINUTE as string) || 60;
        this.RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
        this.POSTGRES_URL = process.env.POSTGRES_URL || "postgres://microservicedb_user:123456@localhost:5442/microservicedb";
        this.POSTGRES_POOL_MIN = parseInt(process.env.POSTGRES_POOL_MIN as string) || 1;
        this.POSTGRES_POOL_MAX = parseInt(process.env.POSTGRES_POOL_MAX as string) || 5;
        this.SALT_TO_ENCODE = process.env.SALT_TO_ENCODE || "eHP9w5";
        logger.info(`NODE_ENV :: ${this.NODE_ENV}`);
        logger.info(`PORT :: ${this.PORT}`);
        logger.info(`SALT_ROUND :: ${this.SALT_ROUND}`);
        logger.info(`JWT_SECRET :: ${this.JWT_SECRET}`);
        logger.info(`JWT_TOKEN_ALGORITHM :: ${this.JWT_TOKEN_ALGORITHM}`);
        logger.info(`JWT_ISSUER :: ${this.JWT_ISSUER}`);
        logger.info(`JWT_AUDIENCE :: ${this.JWT_AUDIENCE}`);
        logger.info(`JWT_EXPIRES_IN_AS_MINUTE :: ${this.JWT_EXPIRES_IN_AS_MINUTE}`);
        logger.info(`RABBITMQ_URL :: ${this.RABBITMQ_URL}`);
        logger.info(`POSTGRES_URL :: ${this.POSTGRES_URL}`);
        logger.info(`POSTGRES_POOL_MIN :: ${this.POSTGRES_POOL_MIN}`);
        logger.info(`POSTGRES_POOL_MAX :: ${this.POSTGRES_POOL_MAX}`);
        logger.info(`SALT_TO_ENCODE :: ${this.SALT_TO_ENCODE}`);
        logger.info("[Config] loaded.");
    }
}

const config = new Config();
export default config;