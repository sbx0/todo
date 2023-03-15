create table client_user
(
    id          bigint unsigned        not null auto_increment comment 'id',
    nickname    varchar(128)           not null comment 'nickname',
    pwd         varchar(512)           not null comment 'password',
    create_time datetime default now() not null comment 'when create',
    update_time datetime               null on update now() comment 'when update',
    constraint client_user_pk primary key (id)
);