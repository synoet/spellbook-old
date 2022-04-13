table! {
    books (uuid) {
        uuid -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        hearts -> Int4,
        title -> Varchar,
        author -> Varchar,
        description -> Varchar,
        url -> Varchar,
    }
}

table! {
    commands (uuid) {
        uuid -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        hearts -> Int4,
        description -> Varchar,
        command -> Varchar,
        book -> Varchar,
    }
}

allow_tables_to_appear_in_same_query!(
    books,
    commands,
);
