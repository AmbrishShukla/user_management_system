const test = require("node:test");
const assert = require("node:assert");
const passwords = require("../server/auth/passwords");

test("a strong password has 10 characters, a letter and a digit", () => {
    assert.equal(passwords.isStrong("correct horse 42"), true);
    assert.equal(passwords.isStrong("short1"), false);
    assert.equal(passwords.isStrong("onlyletterslong"), false);
    assert.equal(passwords.isStrong("1234567890"), false);
    assert.equal(passwords.isStrong(undefined), false);
});

test("a hash verifies its own password and no other", async () => {
    const hash = await passwords.hash("correct horse 42");
    assert.equal(await passwords.verify("correct horse 42", hash), true);
    assert.equal(await passwords.verify("correct horse 43", hash), false);
});
