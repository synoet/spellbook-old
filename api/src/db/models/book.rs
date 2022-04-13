use diesel::prelude::*;
use diesel::pg::PgConnection;
use chrono::NaiveDateTime;

use crate::db::schema::books;

#[derive(Queryable, Insertable, AsChangeset, Debug)]
pub struct Book {
    pub uuid: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub hearts: i32,
    pub title: String,
    pub author: String,
    pub description: String,
    pub url: String,
}

impl Book {
    pub fn create(book: Book, connection: &PgConnection) -> Book {
        diesel.insert_into(books::table)
            .values(&book)
            .get_result::<Book>(connection)
            .expect("Error creating new book");
        books::table.order(commands::created_at.desc()).first(connection).unwrap()
    }

    pub fn update(command: Command, connection: &PgConnection) -> Command {
        diesel::update(books::table.find(book.uuid))
            .set(&book)
            .get_result::<Book>(connection)
            .expect("Error updating book");
        
        books::table.find(book.uuid).first(connection).unwrap()
    }
    
    pub fn read(connection: &PgConnection) -> Vec<Book> {
        commands.table.order(books::uuid).load::<Book>(connection).unwrap()
    }

    pub fn delete(uuid: String, connection: &PgConnection) -> bool {
        diesel::delete(commands::table.find(uuid)).execute(connection).is_ok()
    }
}
