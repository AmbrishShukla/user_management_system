const pool = require("./db");

// An audit entry never blocks or fails the request that caused it; a failed write is logged.
exports.record = (accountId, action, userId = null, detail = null) => {
    pool.query(
        'INSERT INTO audit_log SET account_id = ?, action = ?, user_id = ?, detail = ?',
        [accountId, action, userId, detail],
        (err) => {
            if (err) console.error("audit log write failed: " + err.code);
        }
    );
};

const PAGE_SIZE = 50;

// One page of the log, newest first. Pages start at 1.
exports.page = (page, callback) => {
    const offset = page * PAGE_SIZE;
    pool.query(
        'SELECT a.id, a.action, a.user_id, a.detail, a.created_at, acc.email FROM audit_log a JOIN account acc ON acc.id = a.account_id ORDER BY a.id DESC LIMIT ? OFFSET ?',
        [PAGE_SIZE, offset],
        callback
    );
};

exports.PAGE_SIZE = PAGE_SIZE;
