# user_management_system
this is a user management system where we can add a used edit it delete it or search it . It is built using express ,nodejs , mysql and bootstrap

## Accounts

Signing in is required for every page. Accounts have one of three roles:
- **viewer** sees and searches users;
- **editor** also adds, edits, removes and exports them;
- **admin** also manages accounts and reads the audit log at `/admin`.

Create the tables with `migrations/002_accounts.sql`. Set `SESSION_SECRET` to a long random string (the app refuses to start in production without it), and `TRUST_PROXY=1` when it runs behind a proxy that terminates TLS. Run the tests with `npm test`.
