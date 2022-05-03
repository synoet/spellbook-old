use tui::widgets::ListState;

use crate::utils;
use crate::LocalCommand;

use clipboard::{ClipboardProvider, ClipboardContext};

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
    Notification,
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
    pub notification_message: String,
    pub commands: Vec<LocalCommand>,
    pub quit: bool,
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
            notification_message: String::new(),
            commands: vec![],
            quit: false,
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
                self.commands = utils::read_local_commands().expect("Read Local Commands");
                self.lc_state.select(Some(0));
                self.active_tab = tab;
                self.lc_state.select(Some(0));
            }
            _ => {}
        }
    }

    pub fn load_local(&mut self) {
        self.commands = utils::read_local_commands().expect("Read Local Commands");
        self.lc_state.select(Some(0));
    }

    pub fn on_insert(&mut self, c: char) {
        match self.active_tab {
            Tab::Local => {
                self.lc_search_query.push(c);
                self.commands = utils::rank_sort(&mut self.commands, &self.lc_search_query);
            }
            Tab::Remote => {
                self.rc_search_query.push(c);
                self.commands = utils::remote_command_search(&self.rc_search_query)
                    .expect("Read commands from remote");
            }
        }
    }

    pub fn on_delete(&mut self) {
        match self.active_tab {
            Tab::Local => {
                if let Some(idx) = self.lc_state.selected() {
                    utils::delete_command_locally(self.commands[idx].id.clone())
                        .expect("delete command locally");
                    self.notification_message = format!(
                        "Sucessfully Deleted Command: {}",
                        self.commands[idx].content.clone()
                    );
                    self.load_local();
                    self.active_popup = Popup::Notification;
                }
            }
            _ => {}
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
                let mut ctx: ClipboardContext = ClipboardProvider::new().unwrap();
                ctx.set_contents(self.commands[self.lc_state.selected().unwrap()].content.clone())
                    .expect("set clipboard");
            }
        }
    }

    pub fn on_i(&mut self) {
        match self.active_tab {
            Tab::Remote => match self.rc_state.selected() {
                Some(idx) => {
                    let command = self.commands[idx].clone();
                    if utils::is_command_installed(command.id.clone())
                        .expect("Read Commands Locally")
                    {
                        self.notification_message =
                            format!("Command {}, is already installed locally", command.content);
                        self.active_popup = Popup::Notification;
                        return;
                    }
                    utils::install_command_locally(command.clone()).expect("Write local command");
                    self.notification_message = format!("Installed {}", command.content);
                    self.active_popup = Popup::Notification;
                    self.load_local();
                }
                None => {}
            },
            _ => {}
        };
    }

    pub fn on_backspace(&mut self) {
        match (self.active_tab, self.input_mode) {
            (Tab::Local, InputMode::Insert) => {
                self.lc_search_query.pop();
                self.commands = utils::rank_sort(&mut self.commands, &self.lc_search_query);
            }
            (Tab::Remote, InputMode::Insert) => {
                self.rc_search_query.pop();
            }
            (_, _) => {}
        }
    }

    pub fn on_up(&mut self) {
        match self.active_tab {
            Tab::Local => {
                if let Some(selected) = self.lc_state.selected() {
                    if selected > 0 && selected <= self.commands.len() {
                        self.lc_state.select(Some(selected - 1));
                    } else {
                        self.lc_state.select(Some(self.commands.len() - 1));
                    }
                }
            }
            Tab::Remote => {
                if let Some(selected) = self.rc_state.selected() {
                    if selected > 0 && selected <= self.commands.len() {
                        self.rc_state.select(Some(selected - 1));
                    } else {
                        self.rc_state.select(Some(self.commands.len() - 1));
                    }
                }
            }
        }
    }

    pub fn on_down(&mut self) {
        match self.active_tab {
            Tab::Local => {
                if let Some(selected) = self.lc_state.selected() {
                    if selected < self.commands.len() - 1 {
                        self.lc_state.select(Some(selected + 1));
                    } else {
                        self.lc_state.select(Some(0));
                    }
                }
            }
            Tab::Remote => {
                if let Some(selected) = self.rc_state.selected() {
                    if selected < self.commands.len() - 1 {
                        self.rc_state.select(Some(selected + 1));
                    } else {
                        self.rc_state.select(Some(0));
                    }
                }
            }
        }
    }
}
