use std::fs;

use crate::{Error, LocalCommand, DB_PATH};

pub fn read_local_commands() -> Result<Vec<LocalCommand>, Error> {
    let db_content = fs::read_to_string(DB_PATH)?;
    let parsed: Vec<LocalCommand> = serde_json::from_str(&db_content)?;

    Ok(parsed)
}

pub fn install_command_locally() -> Result<(), Error> {
    unimplemented!()
}
