import { drizzle } from 'drizzle-orm/d1';
import { users } from '../../src/db/schema';
import { verifyToken } from './_auth_helper';

export async function onRequest(context: any) {
  try {
    const session = await verifyToken(context.request);
    if (!session || session.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized: Admin role required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
