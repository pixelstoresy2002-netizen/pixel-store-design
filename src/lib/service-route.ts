import { normalizeIdentifier } from './data/query-inputs.ts';

/** Safely normalizes the dynamic path segment before a server-side lookup. */
export function normalizeServiceRouteIdentifier(value: string | undefined): string | undefined {
  try {
    return normalizeIdentifier(decodeURIComponent(value ?? ''));
  } catch {
    return undefined;
  }
}
