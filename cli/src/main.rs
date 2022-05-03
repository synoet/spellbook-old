use clap::{arg, Arg, Command};
use serde::{Deserialize, Serialize};
use std::io;
use thiserror::Error;

mod cli;
mod core;
mod ui;
mod utils;

use ui::app;

const DB_PATH: &str = "/home/synoet/dev/spellbook/cli/data/db.json";

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
                    arg!([COMMAND] "command to add locally"),
                    Arg::new("description")
                        .short('d')
                        .long("description")
                        .help("command description")
                        .takes_value(true),
                    Arg::new("labels")
                        .short('l')
                        .long("command labels")
                        .takes_value(true)
                        .multiple_values(true),
                ]),
        )
        .subcommand(
            Command::new("search")
                .short_flag('s')
                .long_flag("search")
                .about("search for a command on the remote registry")
                .args(vec![
                    arg!([QUERY] "search query to filter results from registry"),
                    Arg::new("limit")
                        .long("limit")
                        .help("limit the number of results")
                        .takes_value(true)
                        .required(false),
                ]),
        )
        .subcommand(
            Command::new("list")
                .short_flag('l')
                .long_flag("list")
                .about("list all commands")
                .args(vec![
                    arg!([QUERY] "query to sort list by"),
                    Arg::new("limit")
                        .long("limit")
                        .help("limit number of results")
                        .takes_value(true)
                        .required(false),
                ]),
        )
        .subcommand(
            Command::new("install")
                .short_flag('i')
                .long_flag("install")
                .about("install a command locally from registry")
                .args(vec![Arg::new("limit")
                    .long("limit")
                    .help("limit number of results")
                    .takes_value(true)
                    .required(false)]),
        )
        .subcommand(
            Command::new("ammend")
                .short_flag('m')
                .long_flag("ammend")
                .about("ammend a command")
                .arg(arg!([COMMAND])),
        )
        .subcommand(
            Command::new("explain")
                .short_flag('e')
                .long_flag("explain")
                .about("explain a command")
                .args(vec![arg!([COMMAND] "command to explain")]),
        )
        .get_matches();

    match matches.subcommand() {
        Some(("add", add_matches)) => cli::add(add_matches)?,
        Some(("search", search_matches)) => cli::search(search_matches)?,
        Some(("install", install_matches)) => cli::install(install_matches)?,
        Some(("list", list_matches)) => cli::list(list_matches)?,
        Some(("ammend", ammend_matches)) => cli::ammend(ammend_matches)?,
        _ => {
            let mut app = app::App::new(app::Config::default());
            ui::draw_tui(&mut app).expect("Failed to draw TUI");
        }
    };

    Ok(())
}
