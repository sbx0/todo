alter table client_user
    add constraint client_user_pk
        unique (username);
ALTER TABLE tasks
    ADD user_id BIGINT UNSIGNED DEFAULT 1 NOT NULL COMMENT 'customUser id';
ALTER TABLE categories
    ADD user_id BIGINT UNSIGNED DEFAULT 1 NULL COMMENT 'customUser id';
ALTER TABLE asset_records
    ADD user_id BIGINT UNSIGNED DEFAULT 1 NOT NULL COMMENT 'customUser id';
ALTER TABLE asset_types
    ADD user_id BIGINT UNSIGNED DEFAULT 1 NOT NULL COMMENT 'customUser id';