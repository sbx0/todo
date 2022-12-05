create table tasks
(
    id          bigint unsigned                not null auto_increment comment 'id',
    task_name   varchar(128)                   not null comment 'task name',
    task_remark varchar(256)                   null comment 'task remark',
    task_status tinyint unsigned default 0     not null comment 'task status',
    plan_time   datetime                       null comment 'plan time',
    create_time datetime         default now() not null comment 'when create',
    update_time datetime                       null on update now() comment 'when update',
    constraint tasks_pk primary key (id)
);
