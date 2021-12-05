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
            },
            migrations : {
                directory : __dirname + "/migrations",
                tableName : "knex_migrations"
            }
        };
        this.db = knex(this.config);
    }

    init (): Promise<boolean> {

        return new Promise(async (resolve, reject) => {

            try {
                this.db.raw("select 1=1");
                this.configPgType();
                await this.db.migrate.latest();
                logger.info("[Knex] started");
                logger.info("[Migration] completed");
                resolve(true);
            } catch (error) {
                logger.error(error);
                const rollbackResult = this.db.migrate.rollback();
                logger.warn(rollbackResult);
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