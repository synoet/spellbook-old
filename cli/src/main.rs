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
                        .takes_value(true)
                        .required(true),
                    Arg::new("description")
                        .short('d')
                        .long("description")
                        .help("command description")
                        .takes_value(true)
                        .requires(true),
                    Arg::new("labels")
                        .short('l')
                        .long("command labels")
                        .takes_value(true)
                        .multiple_values(true)
                        .required(true),
                ])
        )
        .subcommand(
            Command::new("search")
                .short_flag('s')
                .long_flag("search")
                .about("search for a command")
                .args(vec![
                    Arg::new("query")
                        .short('q')
                        .long("query")
                        .help("query string")
                        .takes_value(true)
                        .required(true)
                ])
        )
        .get_matches();

    match matches.subcommand() {
        Some(("add", add_matches)) => {
            let content = add_matches.value_of("content").unwrap();
            let description = add_matches.value_of("description").unwrap();
            let labels: Vec<&str> = add_matches.values_of("labels").unwrap().collect();
            utils::add_command_locally(
                LocalCommand {
                    id: cuid::cuid()?,
                    content: content.to_string(),
                    description: description.to_string(),
                    labels: labels.iter().map(|x| x.to_string()).collect(),
                    created_at: chrono::Utc::now().to_rfc3339(),
                    updated_at: chrono::Utc::now().to_rfc3339(),
                    installed: Some(false),
                }
            ).expect("Adding a command locally");
        },
        Some(("search", search_matches)) => {
            let query = search_matches.value_of("query").unwrap();
            let mut commands = utils::read_local_commands()?;
            let ranked_commands = utils::rank_sort(&mut commands, &query.to_string());
            for (i, command) in ranked_commands.iter().enumerate() {
                println!("    {}. {}",{i + 1}, command.content);
            }
        },
        _ => {
            let mut app = app::App::new(app::Config::default());
            ui::draw_tui(&mut app).expect("Failed to draw TUI");
        }
    };

    Ok(())
}
