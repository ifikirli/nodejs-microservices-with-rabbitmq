exports.up = async function (knex) {
  
    await knex.schema.dropTableIfExists("customer_meeting_participant");
    await knex.schema.createTable("customer_meeting_participant", (table) => {
        
        table.increments("id").unsigned().primary();
        table.integer("customer_meeting_id").references("id").inTable("customer_meeting").notNullable();
        table.string("email", 50).notNullable();
        table.unique(["customer_meeting_id", "email"]);
    });
};

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("customer_meeting_participant");
};