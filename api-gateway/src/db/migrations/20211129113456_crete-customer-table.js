/* eslint-disable @typescript-eslint/no-var-requires */
const { onUpdateTrigger } = require("../../knexfile");

exports.up = async function (knex) {
  
    await knex.schema.dropTableIfExists("customer");
    await knex.schema.createTable("customer", (table) => {
        
        table.increments("id").unsigned().primary();
        table.string("email", 50).unique().notNullable();
        table.string("salt").notNullable();
        table.string("password").notNullable();
        table.timestamp("last_login", { useTz : false }).nullable();
        table.timestamps(false, true);
    }).then(() => 
        knex.raw(onUpdateTrigger("customer")));
};

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("customer");
};