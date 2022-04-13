use rocket::{self, http::Status};
use diesel::pg::PgConnection;

use crate::db::models::Command;
use crate::db::connection::create;

