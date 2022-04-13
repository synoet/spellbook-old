use diesel::prelude::*;
use diesel::pg::PgConnection;

use crate::db::schema::commands;

#[derive(Queryable, Insertable, AsChangeset, Debug)]
pub struct Command {
    id: i32,
    command: String,
    label: String,
}

impl Command {
    pub fn create(command: Command, connection: &PgConnection) -> Command {
        diesel::insert_into(commands::table)
            .values(&command)
            .get_result::<Command>(connection)
            .expect("Error creating new command");

        commands::table.order(commands::id.desc()).first(connection).unwrap()
    }

    pub fn read(connection: &PgConnection) -> Vec<Command> {
        commands::table.order(commands::id).load::<Command>(connection).unwrap()
    }

    pub fn update(id: i32, command: Command, connection: &PgConnection) -> Command {
        diesel::update(commands::table.find(id))
            .set(&command)
            .get_result::<Command>(connection)
            .expect("Error updating new command");

        commands::table.find(id).first(connection).unwrap()
    }

    pub fn delete(id: i32, connection: &PgConnection) -> bool {
        diesel::delete(commands::table.find(id)).execute(connection).is_ok()
    }
}
