use serde::{Deserialize, Serialize};
use std::io;
use thiserror::Error;


mod widgets;
mod app;
mod ui;

const DB_PATH: &str = "./data/db.json";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LocalCommand {
    id: String,
    content: String,
    description: String,
    labels: Vec<String>,
    created_at: String,
    updated_at: String,
}

#[derive(Error, Debug)]
pub enum Error {
    #[error("error reading from DB file")]
    ReadDbError(#[from] io::Error),
    #[error("error parsing from DB file")]
    ParseDBError(#[from] serde_json::Error),
}

pub enum Event<I> {
    Input(I),
    Tick,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut app = app::App::new(app::Config::default());
    ui::draw_tui(&mut app).expect("Failed to draw TUI");


    Ok(())
}
