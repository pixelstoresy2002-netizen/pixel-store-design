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
  unchanged client dashboard. Anonymous, expired, missing-configuration, and
  non-allowlisted cases all redirect to `/admin/login`.
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

## LAP-77 frontend handoff

The login screen should submit `email` and `password` to Better Auth's
email/password sign-in client flow. The UI must show a generic invalid-credential
error, avoid revealing allowlist membership, and redirect a successful session to
`/admin`. Sign-out must invoke Better Auth sign-out, clear the session cookie, and
redirect to `/admin/login`.

When `/admin` redirects to `/admin/login`, the login page should preserve the
intended post-login destination only after validating it is a local Admin path.
Expired and unauthorized sessions should use the same generic login state. The
current backend intentionally does not create the login presentation; that work
belongs to LAP-47/LAP-77.
