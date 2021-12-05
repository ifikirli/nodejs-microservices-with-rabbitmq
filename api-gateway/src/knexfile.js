require("ts-node/register");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require("dotenv");
if (process.env.NODE_ENV === "production") {
    dotenv.config({
        path : ".prod.env",
    });
} else {
    dotenv.config();
}

module.exports = {

    development : {
        client : "postgresql",
        connection : process.env.POSTGRES_URL ||"postgres://microservicedb_user:123456@localhost:5442/microservicedb",
        pool : {
            min : parseInt(process.env.POSTGRES_POOL_MIN, 10) || 1,
            max : parseInt(process.env.POSTGRES_POOL_MAX, 10) || 5,
        },
        migrations : {
            directory : "./db/migrations",
            tableName : "knex_migrations",
        }
    },
    
    production : {
        client : "postgresql",
        connection : process.env.POSTGRES_URL,
        pool : {
            min : process.env.POSTGRES_POOL_MIN,
            max : process.env.POSTGRES_POOL_MAX,
        },
        migrations : {
            directory : "./db/migrations",
            tableName : "knex_migrations",
        }
    },

    onUpdateTrigger : table => 
        `CREATE TRIGGER ${table}_updated_at
         BEFORE UPDATE ON ${table}
         FOR EACH ROW
         EXECUTE PROCEDURE on_update_timestamp();`
};
