use diesel::r2d2::{ConnectionManager, Pool as R2Pool, PooledConnection};
use std::ops::Deref;
use rocket::http::Status;
use rocket::request::{self, FromRequest, Outcome};
use rocket::{Request, State};

type DbType = diesel::pg::PgConnection;

type Pool = R2Pool<ConnectionManager<DbType>>;
type PoolConn = PooledConnection<ConnectionManager<DbType>>;

pub struct DbConn(pub PoolConn);

impl Deref for DbConn {
    type Target = DbType;
    fn deref(&self) -> &Self::Target { &self.0 }
}

// TODO -- implement FromRequest for DbConn

pub fn init(database_url: &str) -> Pool {
    let manager = ConnectionManager::<DbType>::new(database_url);
    R2Pool::new(manager).expect("db pool")
}
