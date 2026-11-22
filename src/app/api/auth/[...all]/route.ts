import { toNextJsHandler } from 'better-auth/next-js';

import { getAuthEnvironmentStatus } from '@/lib/auth-config';

function unavailable() {
  return Response.json({ error: 'Authentication is not configured.' }, { status: 503 });
}

async function handleAuth(request: Request, method: 'GET' | 'POST') {
  if (!getAuthEnvironmentStatus().configured) return unavailable();

  const { getAuth } = await import('@/lib/auth');
  return toNextJsHandler(getAuth())[method](request);
}

export async function GET(request: Request) {
  return handleAuth(request, 'GET');
}

export async function POST(request: Request) {
  return handleAuth(request, 'POST');
}
