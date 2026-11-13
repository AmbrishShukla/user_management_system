const pool = require("../db");
const passwords = require("../auth/passwords");
const audit = require("../audit");

const normalEmail = (email) => String(email || "").trim().toLowerCase();

// show the login form
exports.loginForm = (req, res) => {
    res.render("login", { next: req.query.next });
};

// sign in, then go back to the page that asked for it
exports.login = (req, res) => {
    const email = normalEmail(req.body.email);
    pool.query('SELECT * FROM account WHERE email = ?', [email], async (err, rows) => {
        if (err) return res.status(500).send("Database error");
        const account = rows[0];
        const ok = account && (await passwords.verify(req.body.password || "", account.password_hash));
        if (!ok) {
            return res.status(401).render("login", { error: "Wrong email or password.", next: req.body.next });
        }
        // A new session id on login, so one planted before it can't be used to ride this one.
        req.session.regenerate((err) => {
            if (err) return res.status(500).send("Session error");
            req.session.account = { id: account.id, email: account.email, role: account.role };
            pool.query('UPDATE account SET last_login_at = NOW() WHERE id = ?', [account.id]);
            audit.record(account.id, "login");
            res.redirect(req.body.next || "/");
        });
    });
};

// show the sign-up form
exports.signupForm = (req, res) => {
    res.render("signup");
};

// create an account
exports.signup = async (req, res) => {
    const email = normalEmail(req.body.email);
    const { password, role } = req.body;
    if (!email.includes("@") || !passwords.isStrong(password)) {
        return res.status(400).render("signup", {
            error: "Use a valid email, and a password of at least 10 characters with a letter and a digit.",
        });
    }
    const hash = await passwords.hash(password);
    pool.query(
        'INSERT INTO account SET email = ?, password_hash = ?, role = ?',
        [email, hash, role || "viewer"],
        (err, result) => {
            if (err && err.code === "ER_DUP_ENTRY") {
                return res.status(409).render("signup", { error: "That email already has an account." });
            }
            if (err) return res.status(500).send("Database error");
            audit.record(result.insertId, "signup");
            res.redirect("/login");
        }
    );
};

// sign out
exports.logout = (req, res) => {
    const account = req.session.account;
    req.session.destroy(() => {
        if (account) audit.record(account.id, "logout");
        res.clearCookie("ums.sid");
        res.redirect("/login");
    });
};
