use crate::app;
use crate::widgets::CommandWidget;
use crate::widgets::NotificationWidget;
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
    layout::{Constraint, Direction, Layout, Rect},
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

    app.load_local();

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

            match app.active_tab {
                app::Tab::Local => {
                    CommandWidget::draw(
                        &app.active_tab,
                        &app.commands,
                        &mut app.lc_state,
                        chunks[2],
                        &mut rect,
                    );

                    SearchBarWidget::draw(
                        &app.input_mode,
                        &app.lc_search_query,
                        chunks[1],
                        &mut rect,
                    );
                }
                app::Tab::Remote => {
                    CommandWidget::draw(
                        &app.active_tab,
                        &app.commands,
                        &mut app.rc_state,
                        chunks[2],
                        &mut rect,
                    );

                    SearchBarWidget::draw(
                        &app.input_mode,
                        &app.rc_search_query,
                        chunks[1],
                        &mut rect,
                    );
                }
            }

            let popup_chunk = popup_area(30, 10, size);

            match app.active_popup {
                app::Popup::Notification => {
                    NotificationWidget::draw(
                        app.notification_message.clone(),
                        popup_chunk,
                        &mut rect,
                    );
                }
                _ => {}
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
        })?;

        match rx.recv()? {
            Event::Input(event) => match (app.input_mode, app.active_popup, event.code) {
                (_, app::Popup::None, KeyCode::Char('q')) => {
                    disable_raw_mode()?;
                    terminal.show_cursor()?;
                    terminal.clear()?;
                    break;
                }
                (_, _, KeyCode::Char('q')) => app.active_popup = app::Popup::None,
                (app::InputMode::Normal, _, KeyCode::Char('1')) => {
                    app.set_active_tab(app::Tab::Local)
                }
                (app::InputMode::Normal, _, KeyCode::Char('2')) => {
                    app.set_active_tab(app::Tab::Remote)
                }
                (app::InputMode::Insert, _, KeyCode::Char(c)) => app.on_insert(c),
                (app::InputMode::Normal, _, KeyCode::Char('i')) => app.on_i(),
                (app::InputMode::Normal, app::Popup::None, KeyCode::Char('d')) => app.on_delete(),
                (_, _, KeyCode::Esc) => app.on_esc(),
                (_, _, KeyCode::Enter) => app.on_enter(),
                (_, _, KeyCode::Backspace) => app.on_backspace(),
                (_, _, KeyCode::Char('/')) => app.on_slash(),
                (_, _, KeyCode::Down) => app.on_down(),
                (_, _, KeyCode::Up) => app.on_up(),
                _ => {}
            },
            _ => {}
        }
    }

    Ok(())
}

fn popup_area(percent_x: u16, percent_y: u16, r: Rect) -> Rect {
    let popup_layout = Layout::default()
        .direction(Direction::Vertical)
        .constraints(
            [
                Constraint::Percentage((100 - percent_y) / 2),
                Constraint::Percentage(percent_y),
                Constraint::Percentage((100 - percent_y) / 2),
            ]
            .as_ref(),
        )
        .split(r);

    Layout::default()
        .direction(Direction::Horizontal)
        .constraints(
            [
                Constraint::Percentage((100 - percent_x) / 2),
                Constraint::Percentage(percent_x),
                Constraint::Percentage((100 - percent_x) / 2),
            ]
            .as_ref(),
        )
        .split(popup_layout[1])[1]
}
