create table asset_records
(
    id           bigint unsigned        not null auto_increment comment 'id',
    type_id      bigint unsigned        not null comment 'asset type id',
    record_value decimal(15, 2)         not null comment 'record value',
    record_time  datetime               null comment 'record time',
    create_time  datetime default now() not null comment 'when create',
    update_time  datetime               null on update now() comment 'when update',
    constraint asset_records_pk primary key (id)
);

create table asset_types
(
    id          bigint unsigned        not null auto_increment comment 'id',
    type_name   varchar(128)           not null comment 'asset type name',
    type_remark varchar(256)           null comment 'asset type remark',
    create_time datetime default now() not null comment 'when create',
    update_time datetime               null on update now() comment 'when update',
    constraint asset_types_pk primary key (id)
);
