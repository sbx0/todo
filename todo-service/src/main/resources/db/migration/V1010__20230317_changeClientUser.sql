alter table client_user
    drop column pwd;

alter table client_user
    add username varchar(50) null;

alter table client_user
    modify email varchar(128) null comment 'email';

alter table client_user
    add constraint client_user_users_username_fk
        foreign key (username) references users (username);