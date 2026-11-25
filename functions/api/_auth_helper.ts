
export async function verifyToken(request: Request, env: AuthEnv): Promise<{ sub: string; email: string; role: string; name: string } | null> {
  const jwtSecret = getJwtSecret(env);
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [b64Header, b64Payload, b64Signature] = parts;
  const message = `${b64Header}.${b64Payload}`;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Reconstruct raw signature binary
    const binStr = atob(b64Signature.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      sigBytes[i] = binStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(message));
    if (!isValid) return null;

    const payload = JSON.parse(atob(b64Payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}

type AuthEnv = { JWT_SECRET?: string };

function getJwtSecret(env: AuthEnv): string {
  const secret = env?.JWT_SECRET;
  if (typeof secret !== 'string' || secret.trim().length < 32) {
    throw new Error('Server authentication is not configured');
  }
  return secret;
}
