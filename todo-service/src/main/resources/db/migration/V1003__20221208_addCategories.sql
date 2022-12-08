alter table tasks
    add category_id bigint unsigned null comment 'category id' after plan_time;

create table categories
(
    id              bigint unsigned        not null auto_increment comment 'id',
    category_name   varchar(128)           not null comment 'category name',
    category_remark varchar(256)           null comment 'category remark',
    create_time     datetime default now() not null comment 'when create',
    update_time     datetime               null on update now() comment 'when update',
    constraint categories_pk primary key (id)
);
