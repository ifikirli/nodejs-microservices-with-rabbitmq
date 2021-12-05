import { knex, Knex } from "knex";
import config from "../config";
import pg from "pg";
import moment from "moment";
import logger from "../logger/logger";

export class KnexDB {

    config: Knex.Config;
    db: Knex;

    constructor () {

        this.config = { 
            client : "postgresql",
            connection : config.POSTGRES_URL,
            pool : {
                min : config.POSTGRES_POOL_MIN,
                max : config.POSTGRES_POOL_MAX
            }
        };
        this.db = knex(this.config);
    }

    init (): Promise<boolean> {

        return new Promise((resolve, reject) => {

            try {
                this.db.raw("select 1=1");
                this.configPgType();
                logger.info("[Knex] started");
                resolve(true);
            } catch (error) {
                logger.error(error);
                reject(error);
            }
        });
    }

    configPgType (): void {

        pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, (val:string) => {
            return moment(val).local().format();
        });
      
        pg.types.setTypeParser(pg.types.builtins.DATE, (val:string) => {
            return moment(val).local().format();
        });

        pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
            return parseInt(value);
        });
        logger.info("[PgType] config completed.");
    }
}

const knexdb = new KnexDB();
export default knexdb;