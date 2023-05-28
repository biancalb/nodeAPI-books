/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("livros", tbl => {
        tbl.increments ('id');
        tbl.text ("nome", 255) 
           .unique ()
           .notNullable();
        tbl.decimal ("valor").notNullable();
        tbl.text ("autor", 128).notNullable();
    });  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
