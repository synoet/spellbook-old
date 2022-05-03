use crate::{Error, LocalCommand, DB_PATH};
use std::fs;
use std::io::prelude::*;
use chrono;
use cuid;

pub fn read() -> Result<Vec<LocalCommand>, Error>{
    let content = fs::read_to_string(DB_PATH)?;
    let parsed: Vec<LocalCommand> = serde_json::from_str(&content)?;

    Ok(parsed)
}

pub fn exists(content: String) -> bool{
    let commands = read().unwrap();
    if commands.iter().any(|c| c.content == content){
        return true;
    }
    false
}

pub fn add(content: String, description: String, labels: Vec<String>) -> Result<(), Error> {
    let mut command = LocalCommand {
        id: cuid::cuid().expect("CUID error"),
        content,
        description,
        labels: labels.iter().map(|x| x.to_string()).collect(),
        created_at: chrono::Utc::now().to_rfc3339(),
        updated_at: chrono::Utc::now().to_rfc3339(),
        installed: Some(false),
    };

    let mut commands = read()?;

    command.installed = Some(false);

    commands.push(command);

    let mut file = fs::File::create(DB_PATH)?;
    file.write_all(serde_json::to_string_pretty(&commands)?.as_bytes())?;

    Ok(())
}

pub fn install(command: LocalCommand) -> Result<(), Error> {
    let mut commands = read()?;
    let mut command = command.clone();

    command.installed = Some(true);

    commands.push(command);

    let new_file_name = DB_PATH.clone().replace("db", "db.backup");
    let mut file = fs::File::create(&new_file_name)?;

    file.write_all(serde_json::to_string_pretty(&commands)?.as_bytes())?;
    fs::remove_file(DB_PATH)?;
    fs::rename(&new_file_name, DB_PATH)?;

    Ok(())
}

pub fn delete(id: String) -> Result<(), Error> {
    let commands = read()?;

    let mut new_commands = commands.clone();
    new_commands.retain(|c| c.id != id);

    let new_file_name = DB_PATH.clone().replace("db", "db.backup");
    let mut file = fs::File::create(&new_file_name)?;

    file.write_all(serde_json::to_string_pretty(&new_commands)?.as_bytes())?;
    fs::remove_file(DB_PATH)?;
    fs::rename(&new_file_name, DB_PATH)?;

    Ok(())
}


#[derive(Clone, Debug)]
pub struct PartialCommand {
    pub content: Option<String>,
    pub description: Option<String>,
    pub labels: Option<Vec<String>>,
}

pub fn ammend(content: String, command: PartialCommand) -> Result<(), Error> {
    let commands = read()?;

    let old_command = commands.iter().find(|c| c.content == content);

    let mut new_commands = commands.clone();

    new_commands.retain(|c| c.content != content);

    new_commands.push(LocalCommand {
        id: old_command.unwrap().id.clone(),
        content: command.content.unwrap_or(old_command.unwrap().content.clone()),
        description: command.description.unwrap_or(old_command.unwrap().description.clone()),
        labels: command.labels.unwrap_or(old_command.unwrap().labels.clone()),
        created_at: old_command.unwrap().created_at.clone(),
        updated_at: chrono::Utc::now().to_rfc3339(),
        installed: old_command.unwrap().installed.clone(),
    });

    let new_file_name = DB_PATH.clone().replace("db", "db.backup");
    let mut file = fs::File::create(&new_file_name)?;

    file.write_all(serde_json::to_string_pretty(&new_commands)?.as_bytes())?;
    fs::remove_file(DB_PATH)?;
    fs::rename(&new_file_name, DB_PATH)?;

    Ok(())
}

pub fn search() -> Result<Vec<LocalCommand>, Error>{
    unimplemented!()
}
