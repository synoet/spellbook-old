use crossterm::{
    event::{self, Event as CEvent, KeyCode},
    terminal::{disable_raw_mode, enable_raw_mode},
};
use serde::{Deserialize, Serialize};
use std::fs;
use std::io;
use std::sync::mpsc;
use std::thread;
use std::time::{Duration, Instant};
use thiserror::Error;
use tui::{
    backend::CrosstermBackend,
    layout::{Alignment, Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style},
    text::{Span, Spans},
    widgets::{
        Block, BorderType, Borders, Cell, List, ListItem, ListState, Paragraph, Row, Table, Tabs, Clear,
    },
    Terminal,
};

use unicode_width::UnicodeWidthStr;

const DB_PATH: &str = "./data/db.json";

#[derive(Serialize, Deserialize, Debug, Clone)]
struct LocalCommand {
    id: String,
    content: String,
    description: String,
    labels: Vec<String>,
    created_at: String,
    updated_at: String,
}

#[derive(Error, Debug)]
enum Error {
    #[error("error reading from DB file")]
    ReadDbError(#[from] io::Error),
    #[error("error parsing from DB file")]
    ParseDBError(#[from] serde_json::Error),
}

enum Event<I> {
    Input(I),
    Tick,
}

#[derive(Copy, Clone, Debug)]
enum MenuItem {
    LocalCommands,
}

#[derive(Copy, Clone, Debug)]
enum Popup {
    AddCommand,
    None,
}

#[derive(Copy, Clone, Debug)]
enum InputMode {
    Normal,
    Insert
}

impl From<MenuItem> for usize {
    fn from(item: MenuItem) -> usize {
        match item {
            MenuItem::LocalCommands => 0,
        }
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    enable_raw_mode().expect("can run in raw mode");
    let (tx, rx) = mpsc::channel();
    let tick_rate = Duration::from_millis(250);
    thread::spawn(move || {
        let mut last_tick = Instant::now();
        loop {
            let timeout = tick_rate
                .checked_sub(last_tick.elapsed())
                .unwrap_or_else( || Duration::from_millis(0));

            if event::poll(timeout).expect("poll works") {
                if let CEvent::Key(key) = event::read().expect("can read event") { 
                    tx.send(Event::Input(key)).expect("can send event");
                }
            }
            if last_tick.elapsed() >= tick_rate {
                if let Ok(_) = tx.send(Event::Tick) {
                    last_tick = Instant::now();
                }
            }
        }
    });

    let stdout = io::stdout();
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;
    terminal.clear()?;
    
    let menu_titles = vec!["Local Commands", "Installer", "Help"];
    let mut active_menu_item = MenuItem::LocalCommands;
    let mut search_query = String::new();
    let mut input_mode =  InputMode::Normal;
    let mut active_popup = Popup::None;
    let mut command_state = ListState::default();
    command_state.select(Some(0));

    loop {
        terminal.draw(|rect| {
            let size = rect.size();
            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .margin(2)
                .constraints([
                    Constraint::Length(3),
                    Constraint::Length(3),
                    Constraint::Min(2),
                    Constraint::Length(3),
                ]
                .as_ref(),
            )
            .split(size);

            let menu = menu_titles
                .iter()
                .map(|t| {
                    let (first, rest) = t.split_at(1);
                    Spans::from(vec![
                        Span::styled(
                            first,
                            Style::default()
                                .fg(Color::Yellow)
                                .add_modifier(Modifier::UNDERLINED),
                        ),
                        Span::styled(rest, Style::default().fg(Color::White)),
                    ])
                })
                .collect();

            let tabs = Tabs::new(menu)
                .select(active_menu_item.into())
                .block(Block::default().title("Menu").borders(Borders::ALL))
                .style(Style::default().fg(Color::White))
                .highlight_style(Style::default().fg(Color::Yellow))
                .divider(Span::raw("|"));

            rect.render_widget(tabs, chunks[0]);

            let search = Paragraph::new(search_query.as_ref())
                .style(match input_mode {
                    InputMode::Normal => Style::default(),
                    InputMode::Insert => Style::default().fg(Color::Yellow),
                })
                .block(Block::default().borders(Borders::ALL).title("Search"));

            let branding = Paragraph::new("  spellbook v0.1.0")
                .style(Style::default().fg(Color::Yellow))
                .alignment(Alignment::Center)
                .block(
                    Block::default()
                        .borders(Borders::NONE)
                        .style(Style::default().fg(Color::White))
                );

            match active_menu_item {
                MenuItem::LocalCommands => {
                    let commands_chunks = Layout::default()
                        .direction(Direction::Horizontal)
                        .constraints(
                            [Constraint::Percentage(40), Constraint::Percentage(60)].as_ref(),
                        )
                        .split(chunks[2]);
                    let (left, right) = render_commands(&command_state);
                    rect.render_stateful_widget(left, commands_chunks[0], &mut command_state);
                    rect.render_widget(right, commands_chunks[1]);
                }
            }

            match input_mode {
                InputMode::Normal => {}
                InputMode::Insert => {
                    rect.set_cursor(
                        chunks[1].x + search_query.width() as u16 + 1,
                        chunks[1].y + 1,
                    )

                }
            }
            rect.render_widget(search, chunks[1]);
            rect.render_widget(branding, chunks[3]);
        })?;


        match rx.recv()? {
            Event::Input(event) => match input_mode {
                InputMode::Normal => match event.code {
                    KeyCode::Char('q') => {
                        disable_raw_mode()?;
                        terminal.show_cursor()?;
                        break;
                    }
                    KeyCode::Char('/') => {
                        match input_mode {
                            InputMode::Normal => {
                                input_mode = InputMode::Insert;
                            }
                            InputMode::Insert => {
                                input_mode = InputMode::Normal;
                            }
                        }
                    }
                    KeyCode::Down => {
                        if let Some(selected) = command_state.selected() {
                            let amount_commands = read_db().expect("can fetch command list").len();
                            if selected >= amount_commands - 1 {
                                command_state.select(Some(0));
                            } else {
                                command_state.select(Some(selected + 1));
                            }
                        }
                    }
                    KeyCode::Up => {
                        if let Some(selected) = command_state.selected() {
                            let amount_commands = read_db().expect("can fetch command list").len();
                            if selected > 0 {
                                command_state.select(Some(selected - 1));
                            } else {
                                command_state.select(Some(amount_commands - 1));
                            }
                        }
                    }
                    _ => {}
                }
                InputMode::Insert => match event.code {
                    KeyCode::Char(c) => {
                        search_query.push(c);
                    }
                    KeyCode::Backspace => {
                        search_query.pop();
                    }
                    KeyCode::Esc => {
                        input_mode = InputMode::Normal
                    }
                    _ => {}
                }
            }
            _ => {}
        }

    }

    Ok(())
}

fn centered_rect(percent_x: u16, percent_y: u16, r: Rect) -> Rect {
    let popup_layout = Layout::default()
        .direction(Direction::Vertical)
        .constraints(
            [
                Constraint::Percentage((100 - percent_y)/2),
                Constraint::Percentage(percent_y),
                Constraint::Percentage((100 - percent_y)/2),

            ]
            .as_ref(),
        )
        .split(r);
    Layout::default()
        .direction(Direction::Horizontal)
        .constraints(
            [
                Constraint::Percentage((100 - percent_x)/ 2),
                Constraint::Percentage(percent_x),
                Constraint::Percentage((100 - percent_x)/2),
            ]
            .as_ref(),
        )
        .split(popup_layout[1])[1]
}

fn render_commands<'a>(command_state: &ListState) -> (List<'a>, Table<'a>) {
    let commands = Block::default()
        .borders(Borders::ALL)
        .style(Style::default().fg(Color::White))
        .title("Local Commands")
        .border_type(BorderType::Plain);

    let command_list = read_db().expect("can fetch command list");
    let items: Vec<_> = command_list
        .iter()
        .map(|command| {
            ListItem::new(Spans::from(vec![Span::styled(
                command.content.clone(),
                Style::default(),
            )]))
        })
        .collect();

    let selected_command = command_list
        .get(
            command_state
                .selected()
                .expect(""),
        )
        .expect("exists")
        .clone();

    let list = List::new(items).block(commands).highlight_style(
        Style::default()
            .bg(Color::Yellow)
            .fg(Color::Black)
            .add_modifier(Modifier::BOLD),
    );

    let command_details = Table::new(vec![Row::new(vec![
        Cell::from(Span::raw(selected_command.id.to_string())),
        Cell::from(Span::raw(selected_command.content)),
        Cell::from(Span::raw(selected_command.description)),
        Cell::from(Span::raw("labels".to_string())),
        Cell::from(Span::raw(selected_command.created_at.to_string())),
    ])])
    .header(Row::new(vec![
        Cell::from(Span::styled(
            "ID",
            Style::default().add_modifier(Modifier::BOLD),
        )),
        Cell::from(Span::styled(
            "Content",
            Style::default().add_modifier(Modifier::BOLD),
        )),
        Cell::from(Span::styled(
            "Description",
            Style::default().add_modifier(Modifier::BOLD),
        )),
        Cell::from(Span::styled(
            "Labels",
            Style::default().add_modifier(Modifier::BOLD),
        )),
        Cell::from(Span::styled(
            "Created At",
            Style::default().add_modifier(Modifier::BOLD),
        )),
    ]))
    .block(
        Block::default()
            .borders(Borders::ALL)
            .style(Style::default().fg(Color::White))
            .title("Detail")
            .border_type(BorderType::Plain),
    )
    .widths(&[
        Constraint::Percentage(5),
        Constraint::Percentage(20),
        Constraint::Percentage(20),
        Constraint::Percentage(5),
        Constraint::Percentage(20),
    ]);

    (list, command_details)
}

fn read_db() -> Result<Vec<LocalCommand>, Error> {
    let db_content = fs::read_to_string(DB_PATH)?;
    let parsed: Vec<LocalCommand> = serde_json::from_str(&db_content)?;
    Ok(parsed)
}
