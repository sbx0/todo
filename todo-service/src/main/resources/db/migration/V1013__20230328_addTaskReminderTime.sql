alter table tasks
    add reminder_time datetime null comment 'reminder_time' after plan_time;

