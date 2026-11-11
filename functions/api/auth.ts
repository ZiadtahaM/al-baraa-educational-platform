import { drizzle } from 'drizzle-orm/d1';
import { users } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = 'al-baraa-production-jwt-secret-key-2026';

async function sha256Hex(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function signToken(payload: object): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const b64Header = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const b64Payload = btoa(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 * 7 })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const message = `${b64Header}.${b64Payload}`;
  
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  const b64Signature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${message}.${b64Signature}`;
}

export async function onRequestPost(context: any) {
  try {
    const db = drizzle(context.env.DB);
    const body = await context.request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));
    const userRecord = result[0];

    // Compute SHA-256 of provided password
    const passwordHash = await sha256Hex(password);

    // Verify hash or match initial seeded hash
    const isValid = userRecord && (
      userRecord.passwordHash === passwordHash ||
      userRecord.passwordHash === password // backwards compatibility for unhashed seed
    );

    if (!userRecord || !isValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = await signToken({
      sub: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
      name: userRecord.name
    });

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        role: userRecord.role,
      },
      token
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
