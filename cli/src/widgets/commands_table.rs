use tui::{
    layout::{Constraint,Rect},
    style::{
        Color,
        Modifier,
        Style
    },
    text::{Span,Spans},
    widgets::{
        Block,
        BorderType,
        Borders,
        List,
        ListItem,
        ListState,
        Row,
        Table,
    },
    terminal::Frame,
    backend::Backend,
};

use crate::LocalCommand;

pub struct CommandWidget;

impl CommandWidget {
    pub fn draw<B: Backend>(
        commands: &Vec<LocalCommand>, c_state: &mut ListState, loc: Vec<Rect>, f: &mut Frame<'_, B>
    ){
        let command_list = Block::default()
            .borders(Borders::ALL)
            .style(Style::default().fg(Color::White))
            .title("Local Commands")
            .border_type(BorderType::Plain);

        let commands: Vec<LocalCommand> = commands.clone();

        let items: Vec<_> = commands
            .iter()
            .map(|command| {
                ListItem::new(Spans::from(vec![Span::styled(
                    command.content.clone(),
                    Style::default(),
                )]))
            })
            .collect();

        let selected_command = commands
            .get(
                c_state
                    .selected()
                    .expect(""),
            )
            .expect("exists")
            .clone();

        let list = List::new(items).block(command_list).highlight_style(
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

        f.render_stateful_widget(list, loc[0], c_state);
        f.render_widget(command_details, loc[1]);
    }
}
