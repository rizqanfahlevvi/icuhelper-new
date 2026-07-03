// Firebase web API key — a public app identifier (same one shipped in the client
// bundle), NOT a secret. It only lets us call Google's token-lookup endpoint.
const FIREBASE_WEB_API_KEY = 'AIzaSyCJi9_n27mOjZ4545pKqifR6PzFIa2zhuk';

/**
 * Verifies a Firebase Auth ID token by asking Google's Identity Toolkit
 * whether it maps to a real, non-disabled user. Avoids pulling in the
 * firebase-admin SDK (which would need service-account credentials).
 */
export async function verifyIdToken(idToken: string | undefined): Promise<boolean> {
  if (!idToken) return false;
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_WEB_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data.users) && data.users.length > 0 && !data.users[0].disabled;
  } catch {
    return false;
  }
}

/** Extracts the bearer token from an Authorization header value. */
export function extractBearerToken(authorizationHeader: string | undefined): string | undefined {
  if (!authorizationHeader?.startsWith('Bearer ')) return undefined;
  return authorizationHeader.slice('Bearer '.length);
}
