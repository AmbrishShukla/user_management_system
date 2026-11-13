// Only signed-in accounts get past this; everyone else goes to the login page and comes back.
exports.requireAccount = (req, res, next) => {
    if (!req.session.account) {
        return res.redirect("/login?next=" + encodeURIComponent(req.originalUrl));
    }
    next();
};

const RANK = { viewer: 1, editor: 2, admin: 3 };

// Accounts with at least this role.
exports.requireRole = (role) => (req, res, next) => {
    const account = req.session.account;
    if (account && RANK[account.role] < RANK[role]) {
        return res.status(403).send("You don't have access to this page.");
    }
    next();
};
