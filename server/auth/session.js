const session = require("express-session");

const secret = process.env.SESSION_SECRET;
if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("Set SESSION_SECRET: sessions can't be signed without it.");
}

module.exports = session({
    name: "ums.sid",
    secret: secret || "development-only-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 8 * 60 * 60 * 1000,
    },
});
