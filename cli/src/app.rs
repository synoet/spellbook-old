use std::fs;
use tui::widgets::ListState;

use crate::{Error, LocalCommand, DB_PATH};
use crate::utils::rank_sort;

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

struct RankedCommand {
    command: LocalCommand,
    rank: usize,
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
        self.active_tab = tab;
    }

    pub fn on_insert(&mut self, c: char) {
        match self.active_tab {
            Tab::Local => {
                self.lc_search_query.push(c);
                rank_sort(&mut self.commands, &self.lc_search_query);
            }
            Tab::Remote => self.rc_search_query.push(c),
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
                rank_sort(&mut self.commands, &self.lc_search_query);
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
                _ => {}
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
                _ => {}
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
}
