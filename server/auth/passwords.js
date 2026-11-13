const bcrypt = require("bcryptjs");

// Cost 12 takes about a quarter of a second per hash on a small server: slow enough to make
// guessing expensive, fast enough for a login.
const ROUNDS = 12;

exports.hash = (password) => bcrypt.hash(password, ROUNDS);

exports.verify = (password, hash) => bcrypt.compare(password, hash);

// At least 10 characters, with a letter and a digit.
exports.isStrong = (password) =>
    typeof password === "string" &&
    password.length >= 10 &&
    /[a-z]/i.test(password) &&
    /\d/.test(password);
