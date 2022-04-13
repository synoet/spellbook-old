use rocket::{self, http::Status, serde::json::Json};
use rocket::response::{status::NotFound};
use diesel::pg::PgConnection;

use crate::db::models::Command;


#[get("/commands/<uuid>")]
pub fn get_command(uuid: String, conn: &PgConnection) -> Json<Command> {
    Json(Command::get(&uuid, &conn))
}
