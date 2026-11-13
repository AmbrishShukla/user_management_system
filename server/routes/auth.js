const express = require("express");
const rateLimit = require("express-rate-limit");
const auth = require("../controllers/authController");

const router = express.Router();

// Ten tries per address every 15 minutes, against password guessing.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});

router.get("/login", auth.loginForm);
router.post("/login", auth.login);
router.use("/login", loginLimiter);

router.get("/signup", auth.signupForm);
router.post("/signup", auth.signup);

router.post("/logout", auth.logout);

module.exports = router;
