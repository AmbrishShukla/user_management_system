-- Accounts for the people who manage users, and an audit trail of what they change.
CREATE TABLE account (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    role ENUM('viewer', 'editor', 'admin') NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL
);

CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    action VARCHAR(40) NOT NULL,
    user_id INT NULL,
    detail VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES account(id)
);
