use tui::widgets::ListState;
use std::fs;

use crate::{
    LocalCommand,
    Error,
    DB_PATH,
};

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
    Insert
}

pub struct Config {
    pub sync: bool,
    pub disable_remote: bool,
}

struct RankedCommand {
    command: LocalCommand,
    rank: usize
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
    pub commands: Vec<LocalCommand>
}

impl App {

    pub fn new(config : Config) -> Self {
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

    pub fn active_tab_index(&mut self) -> usize {
        self.active_tab.into()
    }

    pub fn set_active_tab(&mut self, tab: Tab) {
        self.active_tab = tab;
    }

    pub fn on_insert(&mut self, c: char) {
        match self.active_tab {
            Tab::Local => {
                self.lc_search_query.push(c);
                self.sort();
            },
            Tab::Remote => self.rc_search_query.push(c),
            _ => {}
        }
    }

    pub fn clear_search_query(&mut self) {
        match self.active_tab {
            Tab::Local => self.lc_search_query = String::new(),
            Tab::Remote => self.rc_search_query = String::new(),
            _ => {},
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
                self.sort();
            },
            (Tab::Remote, InputMode::Insert) => {
                self.rc_search_query.pop();
            },
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
                },
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
                },
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

    fn sort(&mut self){
        let lower_query = self.lc_search_query.to_lowercase();

        let query_tags: Vec<&str> = lower_query.split(" ").collect();

        let mut ranked_commands: Vec<RankedCommand> = self.commands.iter().map(|c| {
            let description_words: Vec<String> = c.description.split(" ").map(|s| String::from(s)).collect();
            let content_words: Vec<String> = c.content.split(" ").map(|s| String::from(s)).collect();

            let label_rank = c.labels.iter().filter(|l| query_tags.contains(&l.as_str())).count();
            let description_rank = description_words.iter().filter(|d| query_tags.contains(&d.as_str())).count();
            let content_rank = content_words.iter().filter(|c| query_tags.contains(&c.as_str())).count();

            RankedCommand {
                command: c.to_owned(),
                rank: label_rank + description_rank + content_rank, 
            }
        }).collect::<Vec<RankedCommand>>();

        ranked_commands.sort_by(|a, b| b.rank.cmp(&a.rank));

        self.commands = ranked_commands.iter().map(|rc| rc.command.to_owned()).collect();

    }


}
