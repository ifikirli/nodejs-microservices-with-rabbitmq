/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require("dotenv");
dotenv.config();

module.exports = {

    development : {
        client : "postgresql",
        connection : process.env.POSTGRES_URL ||"postgres://microservicedb_user:123456@localhost:5442/microservicedb",
        pool : {
            min : parseInt(process.env.POSTGRES_POOL_MIN, 10) || 1,
            max : parseInt(process.env.POSTGRES_POOL_MAX, 10) || 5,
        }
    },
    
    production : {
        client : "postgresql",
        connection : process.env.POSTGRES_URL,
        pool : {
            min : process.env.POSTGRES_POOL_MIN,
            max : process.env.POSTGRES_POOL_MAX,
        }
    }
};
