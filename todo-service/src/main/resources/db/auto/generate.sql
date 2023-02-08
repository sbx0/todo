create table asset_records
(
    id           bigint not null auto_increment,
    create_time  datetime(6),
    record_time  datetime(6),
    record_value decimal(38, 2),
    type_id      bigint,
    update_time  datetime(6),
    primary key (id)
) engine = InnoDB;
create table asset_types
(
    id          bigint not null auto_increment,
    create_time datetime(6),
    type_name   varchar(255),
    type_remark varchar(255),
    update_time datetime(6),
    primary key (id)
) engine = InnoDB;
create table categories
(
    id              bigint not null auto_increment,
    category_name   varchar(255),
    category_remark varchar(255),
    create_time     datetime(6),
    update_time     datetime(6),
    primary key (id)
) engine = InnoDB;
create table tasks
(
    id          bigint not null auto_increment,
    category_id bigint,
    create_time datetime(6),
    plan_time   datetime(6),
    task_name   varchar(255),
    task_remark varchar(255),
    task_status integer,
    update_time datetime(6),
    primary key (id)
) engine = InnoDB;
