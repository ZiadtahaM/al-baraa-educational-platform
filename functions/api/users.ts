import { drizzle } from 'drizzle-orm/d1';
import { users } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

export async function onRequest(context: any) {
  try {
    const db = drizzle(context.env.DB);
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    }).from(users);
    
    return new Response(JSON.stringify(allUsers), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
