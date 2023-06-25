alter table tasks
    add prev_id bigint unsigned null comment 'prev id';

alter table tasks
    add next_id bigint unsigned null comment 'next id';

alter table tasks
    add position float(6, 2) null comment 'position';