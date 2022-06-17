import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const isCreated = await knex.schema.hasTable('user');
    if (isCreated){
        return;
    }

    await knex.schema.createTable('user', table => {
        table.increments('id').primary();
        table.string('username', 128).notNullable();
        table.string('password', 255).notNullable();
        table.string('email').notNullable();
        table.boolean('isBanned').notNullable().defaultTo(false);
    })
}


export async function down(_knex: Knex): Promise<void> {
    //no downs
}

