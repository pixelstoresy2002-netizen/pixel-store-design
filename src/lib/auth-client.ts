'use client';

import { createAuthClient } from 'better-auth/client';

/** Same-origin Better Auth client; its requests include the session cookie. */
export const authClient = createAuthClient();
