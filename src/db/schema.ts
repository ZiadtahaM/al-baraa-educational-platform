import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['student', 'teacher', 'admin'] }).notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at').notNull().default(Date.now()),
});

export const teachers = sqliteTable('teachers', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  bio: text('bio'),
  specialty: text('specialty'),
});

export const students = sqliteTable('students', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  grade: text('grade'),
});

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  teacherId: text('teacher_id').notNull().references(() => teachers.id),
  date: integer('date').notNull(),
});
