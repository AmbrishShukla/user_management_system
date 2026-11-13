const test = require("node:test");
const assert = require("node:assert");
const { requireAccount, requireRole } = require("../server/middleware/auth");

// Runs a middleware against a fake request and response, and says what it did.
function run(middleware, session, url = "/") {
    const outcome = { status: null, redirect: null, next: false };
    const res = {
        status(code) {
            outcome.status = code;
            return this;
        },
        send() {
            return this;
        },
        redirect(to) {
            outcome.redirect = to;
        },
    };
    middleware({ session, originalUrl: url }, res, () => {
        outcome.next = true;
    });
    return outcome;
}

test("requireAccount sends visitors to the login page and back", () => {
    const outcome = run(requireAccount, {}, "/edituser/7");
    assert.equal(outcome.redirect, "/login?next=%2Fedituser%2F7");
    assert.equal(outcome.next, false);
});

test("requireAccount lets a signed-in account through", () => {
    assert.equal(run(requireAccount, { account: { role: "viewer" } }).next, true);
});

test("requireRole lets an admin into admin pages", () => {
    assert.equal(run(requireRole("admin"), { account: { role: "admin" } }).next, true);
});

test("requireRole refuses an editor an admin page", () => {
    const outcome = run(requireRole("admin"), { account: { role: "editor" } });
    assert.equal(outcome.status, 403);
    assert.equal(outcome.next, false);
});

test("requireRole lets an editor edit", () => {
    assert.equal(run(requireRole("editor"), { account: { role: "editor" } }).next, true);
});
