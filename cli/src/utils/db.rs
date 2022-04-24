use std::fs;
use std::io::prelude::*;

use crate::{Error, LocalCommand, DB_PATH};

pub fn read_local_commands() -> Result<Vec<LocalCommand>, Error> {
    let db_content = fs::read_to_string(DB_PATH)?;
    let parsed: Vec<LocalCommand> = serde_json::from_str(&db_content)?;

    Ok(parsed)
}

pub fn install_command_locally(command: LocalCommand) -> Result<(), Error> {
    let mut commands = read_local_commands()?;

    commands.push(command);

    let new_file_name = DB_PATH.clone().replace("db", "db.backup");

    let mut file = fs::File::create(&new_file_name)?;

    file.write_all(serde_json::to_string_pretty(&commands)?.as_bytes())?;

    fs::remove_file(DB_PATH)?;

    fs::rename(&new_file_name, DB_PATH)?;

    Ok(())
}
