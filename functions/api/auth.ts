import { drizzle } from 'drizzle-orm/d1';
import { users } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

export async function onRequestPost(context: any) {
  try {
    const db = drizzle(context.env.DB);
    const body = await context.request.json();
    const { email, password } = body;

    const result = await db.select().from(users).where(eq(users.email, email));
    const userRecord = result[0];

    if (!userRecord || userRecord.passwordHash !== password) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        role: userRecord.role,
      },
      token: 'dummy-jwt-token-for-portfolio'
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
