export interface PublicApiError {
  code: string;
  message: string;
}

export function publicApiSuccess<T>(requestId: string, data: T) {
  return { requestId, data };
}

export function publicApiError(requestId: string, error: PublicApiError) {
  return { requestId, error };
}
