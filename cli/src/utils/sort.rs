use crate::LocalCommand;

struct RankedCommand {
    command: LocalCommand,
    rank: usize,
}

pub fn rank_sort(commands: &mut Vec<LocalCommand>, query: &String) -> Vec<LocalCommand> {
    let lower_query = query.to_lowercase();

    let query_tags: Vec<&str> = lower_query.split(" ").collect();

    let mut ranked_commands: Vec<RankedCommand> = commands
        .iter()
        .map(|c| {
            let description_words: Vec<String> =
                c.description.split(" ").map(|s| String::from(s)).collect();
            let content_words: Vec<String> =
                c.content.split(" ").map(|s| String::from(s)).collect();

            let label_rank = c
                .labels
                .iter()
                .filter(|l| query_tags.contains(&l.as_str()))
                .count();
            let description_rank = description_words
                .iter()
                .filter(|d| query_tags.contains(&d.as_str()))
                .count();
            let content_rank = content_words
                .iter()
                .filter(|c| query_tags.contains(&c.as_str()))
                .count();

            RankedCommand {
                command: c.to_owned(),
                rank: label_rank + description_rank + content_rank,
            }
        })
        .collect::<Vec<RankedCommand>>();

    ranked_commands.sort_by(|a, b| b.rank.cmp(&a.rank));

    ranked_commands
        .iter()
        .map(|rc| rc.command.to_owned())
        .collect()
}
