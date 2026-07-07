import { drizzle } from 'drizzle-orm/d1';
import { lessons } from '../../src/db/schema';

export async function onRequest(context: any) {
  try {
    const db = drizzle(context.env.DB);
    const allLessons = await db.select().from(lessons);
    
    return new Response(JSON.stringify(allLessons), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
