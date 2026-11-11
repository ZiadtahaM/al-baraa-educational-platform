import { drizzle } from 'drizzle-orm/d1';
import { lessons } from '../../src/db/schema';
import { eq, or } from 'drizzle-orm';
import { verifyToken } from './_auth_helper';

export async function onRequest(context: any) {
  try {
    const session = await verifyToken(context.request);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = drizzle(context.env.DB);
    let allLessons;
    
    // Admins see all lessons; teachers/students only see their own
    if (session.role === 'admin') {
      allLessons = await db.select().from(lessons);
    } else {
      allLessons = await db.select().from(lessons).where(
        or(eq(lessons.teacherId, session.sub), eq(lessons.studentId, session.sub))
      );
    }
    
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
