use tui::{
    backend::Backend,
    layout::{Alignment, Rect},
    style::{Color, Modifier, Style},
    text::{Span, Spans},
    widgets::{Block, Borders, Paragraph},
    Frame,
};
pub struct NotificationWidget;

impl NotificationWidget {
    pub fn draw<B: Backend>(message: String, loc: Rect, f: &mut Frame<B>) {
        let content = vec![
            Spans::from(Span::styled(
                message,
                Style::default()
                    .fg(Color::Yellow)
                    .add_modifier(Modifier::BOLD),
            )),
            Spans::from(Span::raw("q to close notification")),
        ];
        f.render_widget(
            Paragraph::new(content)
                .block(
                    Block::default()
                        .title("Notification! ")
                        .borders(Borders::ALL),
                )
                .style(Style::default().fg(Color::White).bg(Color::Black))
                .alignment(Alignment::Center),
            loc,
        )
    }
}
