CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  bio TEXT,
  specialty TEXT
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  grade TEXT
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  teacher_id TEXT NOT NULL REFERENCES teachers(id),
  date INTEGER NOT NULL
);

-- Insert dummy data for portfolio demo
INSERT OR IGNORE INTO users (id, name, email, role, password_hash, created_at) VALUES 
('u1', 'Admin User', 'admin@example.com', 'admin', 'password', 1670000000000),
('u2', 'Jane Teacher', 'teacher@example.com', 'teacher', 'password', 1670000000000),
('u3', 'John Student', 'student@example.com', 'student', 'password', 1670000000000);

INSERT OR IGNORE INTO teachers (id, user_id, bio, specialty) VALUES 
('t1', 'u2', 'Math Teacher', 'Mathematics');

INSERT OR IGNORE INTO students (id, user_id, grade) VALUES 
('s1', 'u3', '10th Grade');

INSERT OR IGNORE INTO lessons (id, title, description, teacher_id, date) VALUES 
('l1', 'Algebra Basics', 'Introduction to Algebra', 't1', 1670000000000);
