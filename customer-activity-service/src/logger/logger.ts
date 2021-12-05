import winston, { format } from "winston";
import * as dotenv from "dotenv";

dotenv.config();

const customLevels = {
  
    levels : {
        
        error : 0,
        warn : 1,
        info : 2,
        http : 3,
        verbose : 4,
        debug : 5,
        silly : 6
    },

    colors : {

        error : "red",
        warn : "orange",
        info : "green",
        http : "blue"
    }
};

const { timestamp, printf, errors, json } = format;

const developmentFormat = printf(({ level, message, timestamp, stack }) => {

    const log = `${timestamp} | ${level} | ${message}`;
    return stack ? `${log}\n ${stack}` : log;
});

const timestampFormat = "YYYY-MM-DD HH:mm:ss";

const logger = winston.createLogger({
  
    transports : [
        new winston.transports.Console()
    ],
    levels : customLevels.levels,
    format : process.env.NODE_ENV == "development" ? 
        format.combine(errors({ stack : true }), 
            format.colorize({ all : true }), 
            timestamp({ format : timestampFormat }), 
            developmentFormat) : 
        format.combine(errors({ stack : true }), 
            timestamp({ format : timestampFormat }), 
            json())
});

export default logger;