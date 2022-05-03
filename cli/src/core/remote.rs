use crate::{Error, LocalCommand, RemoteCommand};
pub struct Remote;

#[tokio::main]
pub async fn search(query: String) -> Result<Vec<LocalCommand>, Box<dyn std::error::Error>> {
    let result = reqwest::get(format!(
        "http://localhost:8000/api/commands/search?q={}",
        query
    ))
    .await;
    let json = result.unwrap().json::<Vec<RemoteCommand>>().await?;
    let parsed: Vec<LocalCommand> = json
        .iter()
        .map(|c| LocalCommand {
            id: c.id.clone(),
            description: c.description.clone(),
            content: c.content.clone(),
            labels: c.labels.clone(),
            created_at: c.created_at.clone(),
            updated_at: c.updated_at.clone(),
            installed: None,
        })
        .collect();
    Ok(parsed)
}

pub fn get_user_commands() -> Result<(), Error> {
    unimplemented!()
}
