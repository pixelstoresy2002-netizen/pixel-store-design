# Pixel Store authentication contract

## Backend boundary

- Better Auth uses the existing Prisma `user`, `session`, `account`, and
  `verification` tables through the PostgreSQL Prisma adapter.
- Email/password is enabled, while public sign-up is disabled in the runtime
  configuration.
- `/api/auth/[...all]` serves Better Auth only after required server environment
  values are configured; otherwise it returns a generic `503` response.
- `requireAdmin()` is the single server-side authorization guard. It accepts only
  an unexpired Better Auth session whose normalized email is in `ADMIN_EMAILS`.
- `/admin` is a dynamic server route which calls that guard before rendering the
  approved client dashboard. Anonymous, expired, missing-configuration, and
  non-allowlisted cases all redirect to `/admin/login?next=/admin`.
- Cookie prefix: `pixel-store-admin`; cookies are secure in production.

Future Admin queries and Server Actions must call `requireAdmin()` before reading
or mutating protected data. Client-side route visibility is never authorization.

## Required private configuration

Add these values privately to the ignored local `.env` and the deployment
environment; do not commit them or replace the existing database variables.

```dotenv
BETTER_AUTH_SECRET=<private-random-secret-at-least-32-bytes>
BETTER_AUTH_URL=https://your-approved-domain.example
ADMIN_EMAILS=approved-admin@example.com
```

For local development, `BETTER_AUTH_URL` is normally `http://localhost:3000`.
`ADMIN_EMAILS` supports a comma-separated list and is normalized server-side.

### Windows PowerShell bootstrap

Generate a new secret privately without printing it to the terminal, then paste
it into the ignored `.env` file yourself:

```powershell
$bytes = New-Object byte[] 48
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes) | Set-Clipboard
```

Add the following redacted values to `.env` (not `.env.example`), choosing the
actual administrator email yourself:

```dotenv
BETTER_AUTH_SECRET=<paste-private-secret-from-clipboard>
BETTER_AUTH_URL=http://localhost:3000
ADMIN_EMAILS=<approved-administrator-email>
```

The provisioning script loads `.env` through `dotenv/config`; use the same
three values in the Vercel project, but set `BETTER_AUTH_URL` to the approved
HTTPS production origin there.

## First administrator bootstrap

After the three values are privately configured and an approved administrator has
provided their name, allowlisted email, and password, run interactively:

```bash
npm run admin:provision
```

The command prompts for all identity and password values, verifies the email is
allowlisted, calls Better Auth's supported sign-up API internally, and exits with
no changes when the email already exists. It has no HTTP endpoint and never
inserts a password directly into the database. Do not run it until an approved
administrator identity and private credentials are available.

## Admin login and logout

`/admin/login` submits `email` and `password` to Better Auth's email/password
sign-in client. The form shows generic bilingual failures and does not reveal
allowlist membership. A successful session returns to a validated local Admin
path (otherwise `/admin`).

The Admin header calls Better Auth sign-out, clears the session cookie, and then
returns to `/admin/login`. The client uses the same-origin Better Auth client, so
sign-in/sign-out requests include session cookies. The protected Admin page and
both CustomerRequest APIs independently validate that same cookie on the server.

When `/admin` redirects to `/admin/login`, the login page preserves the intended
post-login destination only after validating it is a local Admin path. It rejects
external URLs and `/admin/login` itself to avoid open redirects and loops. Expired
and unauthorized sessions use the same generic login state.
