use crate::app;
use crate::widgets::CommandWidget;
use crate::widgets::SearchBarWidget;
use crate::widgets::TabMenuWidget;
use crate::Event;
use crossterm::{
    event::{self, Event as CEvent, KeyCode},
    terminal::{disable_raw_mode, enable_raw_mode},
};
use std::io;
use std::sync::mpsc;
use std::thread;
use std::time::{Duration, Instant};
use tui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    Terminal,
};

use unicode_width::UnicodeWidthStr;

pub fn draw_tui(app: &mut app::App) -> Result<(), Box<dyn std::error::Error>> {
    enable_raw_mode().expect("can run in raw mode");
    let (tx, rx) = mpsc::channel();
    let tick_rate = Duration::from_millis(250);
    thread::spawn(move || {
        let mut last_tick = Instant::now();
        loop {
            let timeout = tick_rate
                .checked_sub(last_tick.elapsed())
                .unwrap_or_else(|| Duration::from_millis(0));

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

    app.read_local_commands().expect("Read Local Commands");

    loop {
        terminal.draw(|mut rect| {
            let size = rect.size();

            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .margin(2)
                .constraints(
                    [
                        Constraint::Length(3),
                        Constraint::Length(3),
                        Constraint::Min(3),
                    ]
                    .as_ref(),
                )
                .split(size);

            TabMenuWidget::draw(
                vec!["[1]Local", "[2]Remote", "[3]Help"],
                app.active_tab,
                chunks[0],
                &mut rect,
            );

            let commands_chunks = Layout::default()
                .direction(Direction::Horizontal)
                .constraints([Constraint::Percentage(40), Constraint::Percentage(60)].as_ref())
                .split(chunks[2]);

            match app.active_tab {
                app::Tab::Local => {
                    CommandWidget::draw(
                        &app.active_tab,
                        &app.commands,
                        &mut app.lc_state,
                        vec![commands_chunks[0], commands_chunks[1]],
                        &mut rect,
                    );
                }
                app::Tab::Remote => CommandWidget::draw(
                    &app.active_tab,
                    &app.commands,
                    &mut app.rc_state,
                    vec![commands_chunks[0], commands_chunks[1]],
                    &mut rect,
                ),
            }

            match (app.active_tab, app.input_mode) {
                (_, app::InputMode::Normal) => {}
                (app::Tab::Local, app::InputMode::Insert) => rect.set_cursor(
                    chunks[1].x + app.lc_search_query.width() as u16 + 1,
                    chunks[1].y + 1,
                ),
                (app::Tab::Remote, app::InputMode::Insert) => rect.set_cursor(
                    chunks[1].x + app.rc_search_query.width() as u16 + 1,
                    chunks[1].y + 1,
                ),
            }

            match app.active_tab {
                app::Tab::Local => {
                    SearchBarWidget::draw(
                        &app.input_mode,
                        &app.lc_search_query,
                        chunks[1],
                        &mut rect,
                    );
                }
                app::Tab::Remote => {
                    SearchBarWidget::draw(
                        &app.input_mode,
                        &app.rc_search_query,
                        chunks[1],
                        &mut rect,
                    );
                }
            }
        })?;

        match rx.recv()? {
            Event::Input(event) => match (app.input_mode, event.code) {
                (_, KeyCode::Char('q')) => {
                    disable_raw_mode()?;
                    terminal.show_cursor()?;
                    terminal.clear()?;
                    break;
                }
                (app::InputMode::Normal, KeyCode::Char('1')) => app.set_active_tab(app::Tab::Local),
                (app::InputMode::Normal, KeyCode::Char('2')) => {
                    app.set_active_tab(app::Tab::Remote)
                }
                (app::InputMode::Insert, KeyCode::Char(c)) => app.on_insert(c),
                (app::InputMode::Normal, KeyCode::Char('i')) => {
                    match app.active_tab {
                        app::Tab::Local => {}
                        app::Tab::Remote => {
                            //TODO -- install command
                        }
                    }
                }
                (_, KeyCode::Esc) => app.on_esc(),
                (_, KeyCode::Enter) => app.on_enter(),
                (_, KeyCode::Backspace) => app.on_backspace(),
                (_, KeyCode::Char('/')) => app.on_slash(),
                (_, KeyCode::Down) => app.on_down(),
                (_, KeyCode::Up) => app.on_up(),
                _ => {}
            },
            _ => {}
        }
    }

    Ok(())
}
