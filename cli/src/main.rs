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

mod app;

const DB_PATH: &str = "./data/db.json";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LocalCommand {
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


    let mut app = app::App::new(app::Config::default());
    app.read_local_commands().expect("Read Local Commands");
    
    let menu_titles = vec!["Local Commands", "Installer", "Help"];

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
                .select(app.active_tab.into())
                .block(Block::default().title("Menu").borders(Borders::ALL))
                .style(Style::default().fg(Color::White))
                .highlight_style(Style::default().fg(Color::Yellow))
                .divider(Span::raw("|"));

            rect.render_widget(tabs, chunks[0]);

            let search = Paragraph::new(app.lc_search_query.as_ref())
                .style(match app.input_mode {
                    app::InputMode::Normal => Style::default(),
                    app::InputMode::Insert => Style::default().fg(Color::Yellow),
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

            match app.active_tab {
                app::Tab::Local => {
                    let commands_chunks = Layout::default()
                        .direction(Direction::Horizontal)
                        .constraints(
                            [Constraint::Percentage(40), Constraint::Percentage(60)].as_ref(),
                        )
                        .split(chunks[2]);
                    let (left, right) = render_commands(&app);
                    rect.render_stateful_widget(left, commands_chunks[0], &mut app.lc_state);
                    rect.render_widget(right, commands_chunks[1]);
                }
                _ => {}
            }

            match app.input_mode {
                app::InputMode::Normal => {}
                app::InputMode::Insert => {
                    rect.set_cursor(
                        chunks[1].x + app.lc_search_query.width() as u16 + 1,
                        chunks[1].y + 1,
                    )

                }
            }
            rect.render_widget(search, chunks[1]);
            rect.render_widget(branding, chunks[3]);
        })?;

        match rx.recv()? {
            Event::Input(event) => match (app.input_mode, event.code) {
                (_, KeyCode::Char('q')) => {
                    disable_raw_mode()?;
                    terminal.show_cursor()?;
                    terminal.clear()?;
                    break;
                }
                (app::InputMode::Insert, KeyCode::Char(c)) => app.on_insert(c),
                (_, KeyCode::Esc) => app.on_esc(),
                (_, KeyCode::Enter) => app.on_enter(),
                (_, KeyCode::Backspace) => app.on_backspace(),
                (_, KeyCode::Char('/')) => app.on_slash(),
                (_, KeyCode::Down) => app.on_down(),
                (_, KeyCode::Up) => app.on_up(),
                _ => {},
            },
            _ => {}
        }
    }

    Ok(())
}

fn render_commands<'a>(app: &app::App) -> (List<'a>, Table<'a>) {
    let commands = Block::default()
        .borders(Borders::ALL)
        .style(Style::default().fg(Color::White))
        .title("Local Commands")
        .border_type(BorderType::Plain);

    let command_list = app.commands.clone();

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
            app.lc_state
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

    let command_details = Table::new(vec![
        Row::new(vec![
            Span::styled("Id:", Style::default().add_modifier(Modifier::BOLD)),
            Span::styled(selected_command.id.to_string(), Style::default())
        ]).height(2),
        Row::new(vec![
            Span::styled("Command:", Style::default().add_modifier(Modifier::BOLD)),
            Span::styled(format!("  {}  ", selected_command.content.to_string()),
                Style::default().bg(Color::Yellow).fg(Color::Black).add_modifier(Modifier::BOLD)),
        ]).height(2),
        Row::new(vec![
            Span::styled("Description:", Style::default().add_modifier(Modifier::BOLD)),
            Span::styled(selected_command.description.to_string(), Style::default())
        ]).height(2),
        Row::new(vec![
            Span::styled("Labels:", Style::default().add_modifier(Modifier::BOLD)),
            Span::styled(format!("{:?}", selected_command.labels), Style::default())
        ]).height(2)
    ])
    .block(
        Block::default()
            .borders(Borders::ALL)
            .style(Style::default().fg(Color::White))
            .title("Detail")
            .border_type(BorderType::Plain),
    )
    .widths(&[
        Constraint::Percentage(10),
        Constraint::Percentage(90),
    ]);

    (list, command_details)
}
