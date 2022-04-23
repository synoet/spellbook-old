use reqwest;
use std::fs;
use tui::widgets::ListState;

use crate::utils::rank_sort;
use crate::{Error, LocalCommand, RemoteCommand, DB_PATH};

#[derive(Copy, Clone, Debug)]
pub enum Tab {
    Local,
    Remote,
}

impl From<Tab> for usize {
    fn from(item: Tab) -> usize {
        match item {
            Tab::Local => 0,
            Tab::Remote => 1,
        }
    }
}

#[derive(Copy, Clone)]
pub enum Popup {
    None,
    Add,
    Edit,
    Delete,
}

#[derive(Copy, Clone, Debug)]
pub enum InputMode {
    Normal,
    Insert,
}

pub struct Config {
    pub sync: bool,
    pub disable_remote: bool,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            sync: false,
            disable_remote: false,
        }
    }
}

pub struct App {
    pub config: Config,
    pub input_mode: InputMode,
    pub active_tab: Tab,
    pub active_popup: Popup,
    pub lc_state: ListState,
    pub rc_state: ListState,
    pub lc_search_query: String,
    pub rc_search_query: String,
    pub commands: Vec<LocalCommand>,
}

impl App {
    pub fn new(config: Config) -> Self {
        App {
            config,
            input_mode: InputMode::Normal,
            active_tab: Tab::Local,
            active_popup: Popup::None,
            lc_state: ListState::default(),
            rc_state: ListState::default(),
            lc_search_query: String::new(),
            rc_search_query: String::new(),
            commands: vec![],
        }
    }

    pub fn set_active_tab(&mut self, tab: Tab) {
        match (self.active_tab, tab) {
            (Tab::Local, Tab::Remote) => {
                self.active_tab = tab;
                self.commands = vec![];
                self.rc_state.select(Some(0));
            }
            (Tab::Remote, Tab::Local) => {
                self.read_local_commands()
                    .expect("Failed to read local commands");
                self.active_tab = tab;
                self.lc_state.select(Some(0));
            }
            _ => {}
        }
    }

    pub fn on_insert(&mut self, c: char) {
        match self.active_tab {
            Tab::Local => {
                self.lc_search_query.push(c);
                self.commands = rank_sort(&mut self.commands, &self.lc_search_query);
            }
            Tab::Remote => {
                self.rc_search_query.push(c);
                self.remote_command_search()
                    .expect("Read commands from remote");
            }
        }
    }

    pub fn on_slash(&mut self) {
        match self.input_mode {
            InputMode::Normal => self.input_mode = InputMode::Insert,
            _ => {}
        }
    }

    pub fn on_esc(&mut self) {
        match self.input_mode {
            InputMode::Insert => self.input_mode = InputMode::Normal,
            _ => {}
        }
    }

    pub fn on_enter(&mut self) {
        match self.input_mode {
            InputMode::Insert => self.input_mode = InputMode::Normal,
            InputMode::Normal => {
                // TODO -- implement command copying
                unimplemented!()
            }
        }
    }

    pub fn on_backspace(&mut self) {
        match (self.active_tab, self.input_mode) {
            (Tab::Local, InputMode::Insert) => {
                self.lc_search_query.pop();
                self.commands = rank_sort(&mut self.commands, &self.lc_search_query);
            }
            (Tab::Remote, InputMode::Insert) => {
                self.rc_search_query.pop();
            }
            (_, _) => {}
        }
    }

    pub fn on_up(&mut self) {
        if let Some(selected) = self.lc_state.selected() {
            match self.active_tab {
                Tab::Local => {
                    if self.commands.len() > 0 {
                        self.lc_state.select(Some(selected - 1));
                    }
                }
                Tab::Remote => {
                    if self.commands.len() > 0 {
                        self.rc_state.select(Some(selected - 1));
                    }
                }
            }
        }
    }

    pub fn on_down(&mut self) {
        if let Some(selected) = self.lc_state.selected() {
            match self.active_tab {
                Tab::Local => {
                    if selected < self.commands.len() - 1 {
                        self.lc_state.select(Some(selected + 1));
                    }
                }
                Tab::Remote => {
                    if selected < self.commands.len() - 1 {
                        self.rc_state.select(Some(selected + 1));
                    }
                }
            }
        }
    }

    pub fn read_local_commands(&mut self) -> Result<(), Error> {
        let db_content = fs::read_to_string(DB_PATH)?;
        let parsed: Vec<LocalCommand> = serde_json::from_str(&db_content)?;
        self.commands = parsed;
        self.lc_state.select(Some(0));

        Ok(())
    }

    #[tokio::main]
    async fn remote_command_search(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        let result = reqwest::get(format!(
            "http://localhost:8000/commands/search?q={}",
            self.rc_search_query
        ))
        .await;
        let json = result.unwrap().json::<Vec<RemoteCommand>>().await?;
        self.commands = json
            .iter()
            .map(|c| LocalCommand {
                id: c.id.clone(),
                description: c.description.clone(),
                content: c.content.clone(),
                labels: c.labels.clone(),
                created_at: c.created_at.clone(),
                updated_at: c.updated_at.clone(),
            })
            .collect();
        Ok(())
    }
}
