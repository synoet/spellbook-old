use crate::core::{local, remote, search};
use crate::{Error, LocalCommand};
use clap::ArgMatches;
use std::io::Write;

use termion::{color, style};

fn print_command(command: &LocalCommand, index: Option<usize>) {
    if let Some(idx) = index {
        print!("{}{}{}. ", color::Fg(color::Blue), style::Bold, idx);
    }
    print!("{}{}{}", style::Reset, style::Bold, command.content);
    print!("{}", style::Reset);
    for label in command.labels.clone() {
        print!(" {}{label} {}", color::Fg(color::Yellow), style::Reset);
    }
    println!(
        "\n   {}{}{}",
        color::Fg(color::White),
        command.description,
        style::Reset
    );
    println!("");
}

fn print_commands(commands: &Vec<LocalCommand>, limit: usize) {
    for (idx, command) in commands.iter().enumerate() {
        if idx < limit {
            print_command(command, Some(idx + 1));
        }
    }
}

fn print_error_message(message: &str) {
    print!(
        "{}{} warning: {}{}",
        color::Fg(color::Red),
        style::Bold,
        style::Reset,
        message
    );
    print!("{} (we reccomend not adding duplicate commands, if this was intended use {}{}--force{}{} flag)", 
        color::Fg(color::White), style::Reset, style::Bold, style::Reset, color::Fg(color::White));
    println!("");
}

fn print_sucess_message(message: &str) {
    print!("\n");
    print!(
        "{}{} success: {}{}",
        color::Fg(color::Green),
        style::Bold,
        style::Reset,
        message
    );
    println!("\n");
}

fn take_input() -> String {
    print!("{} ==>  {}", color::Fg(color::Green), style::Reset);
    std::io::stdout().flush().unwrap();
    let mut input = String::new();
    std::io::stdin()
        .read_line(&mut input)
        .expect("Failed to read input");

    input
}

enum ValueType<'a> {
    Single(&'a String),
    List(&'a Vec<String>),
}

fn ammend_take_input(prompt: &str, helper: Option<&str>, old_value: ValueType) -> Option<String> {
    print!("\n");
    print!("{}{}{}: ", color::Fg(color::Blue), prompt, style::Reset);

    if let Some(h) = helper {
        print!("{}({}){}\n", color::Fg(color::White), h, style::Reset);
    } else {
        print!("\n");
    }

    let old = match old_value {
        ValueType::Single(value) => value.to_string(),
        ValueType::List(list) => format!("{:?}", &list).to_string(),
    };

    print!(
        "{}[{old}]{} {}==> {}",
        color::Fg(color::White),
        style::Reset,
        color::Fg(color::Green),
        style::Reset
    );
    std::io::stdout().flush().unwrap();
    let mut input = String::new();
    std::io::stdin()
        .read_line(&mut input)
        .expect("failed to read input");

    match input.trim() {
        "" => None,
        _ => Some(input.trim().to_string()),
    }
}

pub fn add(matches: &ArgMatches) -> Result<(), Error> {
    let content = matches.value_of("COMMAND").unwrap();
    let description = matches.value_of("description").unwrap();
    let labels = matches
        .values_of("labels")
        .unwrap()
        .map(|x| x.to_string())
        .collect();

    if local::exists(content.to_string()) {
        print_error_message("Command already exists");
        return Ok(());
    }

    local::add(content.to_string(), description.to_string(), labels)?;

    print_sucess_message("Command added");

    Ok(())
}

pub fn search(matches: &ArgMatches) -> Result<(), Error> {
    let query = matches.value_of("QUERY").unwrap();
    let commands = remote::search(query.to_string()).expect("Searching for commands");

    let limit = match matches.value_of("limit") {
        Some(limit) => limit.parse::<usize>().expect("Invalid limit"),
        None => commands.len(),
    };

    print_commands(&commands, limit);

    Ok(())
}

pub fn install(matches: &ArgMatches) -> Result<(), Error> {
    let query = matches.value_of("QUERY").unwrap();
    let commands = remote::search(query.to_string()).expect("Searching for commands");

    let limit = match matches.value_of("limit") {
        Some(limit) => limit.parse::<usize>().expect("Invalid limit"),
        None => commands.len(),
    };

    print_commands(&commands, limit);

    println!(
        "{}{} ==>  {}{}{} ",
        color::Fg(color::Green),
        style::Bold,
        style::Reset,
        "Commands to install locally (eg: 1 , 1 2 3)",
        style::Reset
    );
    let input = take_input();

    let selection = input
        .trim()
        .parse::<usize>()
        .expect("Expected a valid number");

    let command = commands
        .iter()
        .nth(selection - 1)
        .expect("Invalid selection");

    local::add(
        command.content.clone(),
        command.description.clone(),
        command.labels.clone(),
    )?;

    print_sucess_message("Command added");

    Ok(())
}

pub fn list(matches: &ArgMatches) -> Result<(), Error> {
    let mut commands = local::read().expect("Listing commands");
    let limit = match matches.value_of("limit") {
        Some(l) => l.parse::<usize>().unwrap(),
        None => commands.len(),
    };

    if let Some(query) = matches.value_of("QUERY") {
        commands = search::rank(&mut commands, &query.to_string());
    }

    print_commands(&commands, limit);

    Ok(())
}

pub fn ammend(matches: &ArgMatches) -> Result<(), Error> {
    let mut commands = local::read()?;

    match matches.value_of("COMMAND") {
        Some(content) => {
            commands.retain(|c| c.content == content);
            let command = commands.iter().next();
            match command {
                Some(c) => {
                    let new_content =
                        ammend_take_input("Edit Command", None, ValueType::Single(&c.content));
                    let new_description = ammend_take_input(
                        "Edit Description",
                        None,
                        ValueType::Single(&c.description),
                    );
                    let new_labels = ammend_take_input(
                        "Edit Labels",
                        Some("ex: 'label1 label2 label3'"),
                        ValueType::List(&c.labels),
                    );

                    let labels = match new_labels {
                        Some(l) => Some(l.split(" ").map(|x| x.to_string()).collect()),
                        None => None,
                    };

                    local::ammend(
                        c.content.clone(),
                        local::PartialCommand {
                            content: new_content,
                            description: new_description,
                            labels,
                        },
                    )?;

                    print_sucess_message("Command updated");
                }
                None => {
                    println!("Command '{}' not found", content);
                    return Ok(());
                }
            }
        }
        None => {
            println!("You need to supply a command to ammend");
            return Ok(());
        }
    };

    Ok(())
}

pub fn explain(matches: &ArgMatches) -> Result<(), Error> {
    unimplemented!()
}
