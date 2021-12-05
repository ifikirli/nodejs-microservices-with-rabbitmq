/* eslint-disable @typescript-eslint/no-var-requires */
const { onUpdateTrigger } = require("../../knexfile");

exports.up = async function (knex) {
  
    await knex.schema.dropTableIfExists("customer_meeting");
    await knex.schema.createTable("customer_meeting", (table) => {
        
        table.increments("id").unsigned().primary();
        table.string("title", 50).notNullable();
        table.integer("customer_id").references("id").inTable("customer").notNullable();
        table.timestamp("start_time", { useTz : false }).notNullable();
        table.timestamp("end_time", { useTz : false }).notNullable();
        table.timestamps(false, true);
    }).then(() => 
        knex.raw(onUpdateTrigger("customer_meeting")));
};

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("customer_meeting");
};