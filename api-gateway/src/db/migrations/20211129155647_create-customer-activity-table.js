/* eslint-disable @typescript-eslint/no-var-requires */
const { onUpdateTrigger } = require("../../knexfile");

exports.up = async function (knex) {
  
    await knex.schema.dropTableIfExists("customer_activity");
    await knex.schema.createTable("customer_activity", (table) => {
        
        table.increments("id").unsigned().primary();
        table.integer("customer_id").references("id").inTable("customer").notNullable();
        table.string("activity").notNullable();
        table.timestamps(false, true);
    }).then(() => 
        knex.raw(onUpdateTrigger("customer_activity")));
};

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("customer_activity");
};