const pool = require("../db");
const audit = require("../audit");

const ROLES = ["viewer", "editor", "admin"];

// the audit log, newest first, a page at a time
exports.auditLog = (req, res) => {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    audit.page(page, (err, entries) => {
        if (err) return res.status(500).send("Database error");
        res.render("admin/audit", {
            entries,
            page,
            prev: page > 1 ? page - 1 : null,
            next: entries.length === audit.PAGE_SIZE ? page + 1 : null,
        });
    });
};

// every account, with the last thing it did
exports.accounts = (req, res) => {
    pool.query('SELECT id, email, role, last_login_at FROM account ORDER BY email', (err, accounts) => {
        if (err) return res.status(500).send("Database error");
        let pending = accounts.length;
        if (pending === 0) return res.render("admin/accounts", { accounts, roles: ROLES });
        accounts.forEach((account) => {
            pool.query(
                'SELECT action, created_at FROM audit_log WHERE account_id = ? ORDER BY id DESC LIMIT 1',
                [account.id],
                (err, rows) => {
                    account.lastAction = !err && rows[0] ? rows[0] : null;
                    pending -= 1;
                    if (pending === 0) res.render("admin/accounts", { accounts, roles: ROLES });
                }
            );
        });
    });
};

// change an account's role
exports.setRole = (req, res) => {
    const role = req.body.role;
    if (!ROLES.includes(role)) return res.status(400).send("Unknown role");
    pool.query('UPDATE account SET role = ? WHERE id = ?', [role, req.params.id], (err) => {
        if (err) return res.status(500).send("Database error");
        audit.record(req.session.account.id, "set_role", null, "account " + req.params.id + " -> " + role);
        res.redirect("/admin/accounts");
    });
};
