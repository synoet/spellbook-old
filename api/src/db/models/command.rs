use diesel::prelude::*;
use diesel::pg::PgConnection;
use chrono::NaiveDateTime;

use crate::db::schema::commands;

#[derive(Queryable, Insertable, AsChangeset, Debug)]
pub struct Command {
    pub uuid: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub hearts: i32,
    pub command: String,
    pub description: String,
    pub book: String,
}

impl Command {
    pub fn create(command: Command, connection: &PgConnection) -> Command {
        diesel::insert_into(commands::table)
            .values(&command)
            .get_result::<Command>(connection)
            .expect("Error creating new command");

        commands::table.order(commands::uuid.desc()).first(connection).unwrap()
    }

    pub fn update(command: Command, connection: &PgConnection) -> Command {
        diesel::update(commands::table.find(command.uuid))
            .set(&command)
            .get_result::<Command>(connection)
            .expect("Error updating command");

        commands::table.find(command.uuid).first(connection).unwrap()
    }

    pub fn read(connection: &PgConnection) -> Vec<Command> {
        commands::table.order(commands::uuid).load::<Command>(connection).unwrap()
    }

    pub fn delete(uuid: String, connection: &PgConnection) -> bool {
        diesel::delete(commands::table.find(uuid)).execute(connection).is_ok()
    }
}
