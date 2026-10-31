-- Al-Baraa Academy Platform: Gate 1 Relational Schema
-- Enforces: Fixed-Point Minor Units (Halalas/Cents), Append-Only Ledgers, and Zero-Mock Relational Constraints
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_timezone TEXT NOT NULL DEFAULT 'Asia/Riyadh',
  currency TEXT NOT NULL DEFAULT 'SAR',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  full_name_ar TEXT NOT NULL,
  full_name_en TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  timezone TEXT NOT NULL DEFAULT 'Asia/Riyadh',
  hourly_rate_minor INTEGER NOT NULL CHECK (hourly_rate_minor > 0),
  teacher_hourly_split_minor INTEGER NOT NULL CHECK (teacher_hourly_split_minor >= 0),
  academy_commission_minor INTEGER NOT NULL CHECK (academy_commission_minor >= 0),
  currency TEXT NOT NULL DEFAULT 'SAR',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS hour_pack_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hours INTEGER NOT NULL CHECK (hours > 0),
  price_minor INTEGER NOT NULL CHECK (price_minor > 0),
  currency TEXT NOT NULL DEFAULT 'SAR',
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS hour_pack_purchases (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  plan_id TEXT NOT NULL,
  hours INTEGER NOT NULL CHECK (hours > 0),
  minutes INTEGER NOT NULL CHECK (minutes > 0),
  price_minor INTEGER NOT NULL CHECK (price_minor > 0),
  currency TEXT NOT NULL DEFAULT 'SAR',
  teacher_id TEXT REFERENCES teachers(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'SETTLED' CHECK (status IN ('PENDING', 'SETTLED', 'CANCELLED')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS class_sessions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  teacher_payout_minor INTEGER NOT NULL CHECK (teacher_payout_minor >= 0),
  academy_revenue_minor INTEGER NOT NULL CHECK (academy_revenue_minor >= 0),
  currency TEXT NOT NULL DEFAULT 'SAR',
  topic TEXT NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS teacher_payout_ledgers (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,
  session_id TEXT REFERENCES class_sessions(id) ON DELETE RESTRICT,
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  currency TEXT NOT NULL DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'SETTLED' CHECK (status IN ('PENDING', 'SETTLED', 'HOLD')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS student_hour_balances (
  student_id TEXT PRIMARY KEY REFERENCES students(id) ON DELETE RESTRICT,
  total_minutes_purchased INTEGER NOT NULL DEFAULT 0,
  minutes_used INTEGER NOT NULL DEFAULT 0,
  minutes_remaining INTEGER NOT NULL CHECK (minutes_remaining >= 0),
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  route TEXT NOT NULL,
  response_code INTEGER NOT NULL,
  response_body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_outbox (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  dispatched INTEGER NOT NULL DEFAULT 0 CHECK (dispatched IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Triggers for Append-Only Financial and Session Invariants
CREATE TRIGGER IF NOT EXISTS prevent_hour_pack_delete
BEFORE DELETE ON hour_pack_purchases
BEGIN
  SELECT RAISE(ABORT, 'HOUR_PACK_PURCHASE_IMMUTABLE');
END;

CREATE TRIGGER IF NOT EXISTS prevent_class_session_delete
BEFORE DELETE ON class_sessions
BEGIN
  SELECT RAISE(ABORT, 'CLASS_SESSION_IMMUTABLE');
END;

CREATE TRIGGER IF NOT EXISTS prevent_teacher_payout_delete
BEFORE DELETE ON teacher_payout_ledgers
BEGIN
  SELECT RAISE(ABORT, 'TEACHER_PAYOUT_IMMUTABLE');
END;
