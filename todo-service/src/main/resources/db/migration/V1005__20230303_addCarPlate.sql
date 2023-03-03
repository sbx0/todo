create table car_config
(
    id            bigint unsigned        not null auto_increment comment 'id',
    car_plate_num varchar(128)           not null comment 'car plate number',
    lot_id        varchar(64)            not null comment 'lot id',
    api_host      varchar(256)           not null comment 'api host',
    api_path      varchar(256)           not null comment 'api host',
    create_time   datetime default now() not null comment 'when create',
    update_time   datetime               null on update now() comment 'when update',
    constraint car_config_pk primary key (id)
);

create table car_plate_photo
(
    id            bigint unsigned        not null auto_increment comment 'id',
    car_plate_num varchar(128)           not null comment 'car plate number',
    lot_name      varchar(128)           not null comment 'lot name',
    floor_name    varchar(128)           not null comment 'floor name',
    park_no       varchar(128)           not null comment 'park no',
    img_url       varchar(256)           not null comment 'img url',
    create_time   datetime default now() not null comment 'when create',
    update_time   datetime               null on update now() comment 'when update',
    constraint car_plate_photo_pk primary key (id)
);