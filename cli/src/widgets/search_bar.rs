use tui::{
    layout::Rect,
    style::{Color, Style},
    widgets::{Block, Borders, Paragraph},
    backend::Backend,
    terminal::Frame,
};


use crate::app::InputMode;

pub struct SearchBarWidget;

impl SearchBarWidget {
    pub fn draw<B: Backend> (
        input_mode: &InputMode, query: &String, loc: Rect, f: &mut Frame<B>
    ){
        f.render_widget(
            Paragraph::new(query.as_ref())
                .style(match input_mode {
                    InputMode::Normal => Style::default(),
                    InputMode::Insert => Style::default().fg(Color::Yellow),
                })
                .block(Block::default().borders(Borders::ALL).title("Search"))
            ,
            loc
        );
    }
}
