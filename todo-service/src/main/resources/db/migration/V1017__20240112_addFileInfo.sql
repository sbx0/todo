CREATE TABLE file_info
(
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT,
    name            VARCHAR(36),
    original_name   VARCHAR(255),
    path            VARCHAR(255),
    real_path    VARCHAR(255),
    md5             VARCHAR(32),
    size            BIGINT,
    type            VARCHAR(50),
    encryption_type SMALLINT DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_fi_path ON file_info (path);
CREATE INDEX idx_fi_user_id ON file_info (user_id);
CREATE INDEX idx_fi_type ON file_info (type);