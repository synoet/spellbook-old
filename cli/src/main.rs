use serde::{Deserialize, Serialize};
use std::io;
use thiserror::Error;
use clap::{Arg, Command};

mod app;
mod ui;
mod utils;
mod widgets;

const DB_PATH: &str = "./data/db.json";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LocalCommand {
    id: String,
    content: String,
    description: String,
    labels: Vec<String>,
    created_at: String,
    updated_at: String,
    installed: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RemoteCommand {
    id: String,
    content: String,
    description: String,
    labels: Vec<String>,
    created_at: String,
    updated_at: String,
    author_id: Option<String>,
    book_id: Option<String>,
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
    let matches = Command::new("spellbook")
        .about("command manager utility")
        .version("0.1.0")
        .subcommand_required(false)
        .arg_required_else_help(false)
        .author("synoet")
        .subcommand(
            Command::new("add")
                .short_flag('a')
                .long_flag("add")
                .about("add a local command")
                .args(vec![
                    Arg::new("content")
                        .short('c')
                        .long("content")
                        .help("command content")
                        .takes_value(true),
                    Arg::new("description")
                        .short('d')
                        .long("description")
                        .help("command description")
                        .takes_value(true),
                    Arg::new("labels")
                        .short('l')
                        .long("command labels")
                        .takes_value(true)
                        .multiple_values(true)
                ])
        ).get_matches();

    match matches.subcommand() {
        Some(("add", add_matches)) => {},
        _ => {
            let mut app = app::App::new(app::Config::default());
            ui::draw_tui(&mut app).expect("Failed to draw TUI");
        }
    };

    Ok(())
}
