use super::schema::commands;

fn rocket() -> _ {
    rocket::build().mount("/", routes![get_command])
}
