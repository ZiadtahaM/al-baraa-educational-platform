import os
import sqlite3
import sys

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(base_dir, 'data', 'albaraa.sqlite')
os.makedirs(os.path.dirname(db_path), exist_ok=True)

print("=== AL-BARAA ACADEMY OS: GATE 1 RAW SQLITE SABOTAGE TEST ===")
con = sqlite3.connect(db_path)
con.execute("PRAGMA foreign_keys = ON;")

# Ensure schema exists from canonical schema.sql
schema_path = os.path.join(base_dir, 'schema.sql')
if os.path.exists(schema_path):
    with open(schema_path, 'r', encoding='utf-8') as f:
        con.executescript(f.read())

# Ensure valid student and teacher exist for FK tests
con.execute("""
    INSERT OR IGNORE INTO students (id, full_name, parent_phone, parent_timezone, currency)
    VALUES ('std-sabotage-1', 'Ziad Taha Student', '+966501234567', 'Asia/Riyadh', 'SAR')
""")
con.execute("""
    INSERT OR IGNORE INTO teachers (id, full_name_ar, full_name_en, email, timezone, hourly_rate_minor, teacher_hourly_split_minor, academy_commission_minor, currency)
    VALUES ('tea-sabotage-1', 'الشيخة سارة', 'Sheikha Sarah', 'sabotage.sarah@albaraa.edu.sa', 'Asia/Riyadh', 5000, 3500, 1500, 'SAR')
""")
con.commit()

passed = 0
failed = 0

# --- TEST 1: Negative Minutes Remaining CHECK Constraint Sabotage ---
print("\n[TEST 1] Attempting to insert negative minutes_remaining (-60) into student_hour_balances...")
try:
    con.execute("""
        INSERT INTO student_hour_balances (student_id, total_minutes_purchased, minutes_used, minutes_remaining)
        VALUES ('std-sabotage-1', 480, 540, -60)
    """)
    con.commit()
    print("FAILED: Negative balance was accepted! CHECK constraint failed to block invalid balance.")
    failed += 1
except sqlite3.IntegrityError as e:
    print(f"PASSED: SQLite engine rejected insertion as expected: {e}")
    passed += 1

# --- TEST 2: Foreign Key Constraint Sabotage ---
print("\n[TEST 2] Attempting to insert orphan class session with fake student_id ('non-existent-student')...")
try:
    con.execute("""
        INSERT INTO class_sessions (id, student_id, teacher_id, duration_minutes, teacher_payout_minor, academy_revenue_minor, currency, topic)
        VALUES ('sess-orphan-1', 'non-existent-student', 'tea-sabotage-1', 60, 3500, 1500, 'SAR', 'Tajweed Basics')
    """)
    con.commit()
    print("FAILED: Orphan class session was accepted! Foreign key constraint failed to block invalid student.")
    failed += 1
except sqlite3.IntegrityError as e:
    print(f"PASSED: SQLite engine rejected insertion as expected: {e}")
    passed += 1

import uuid

test_run_id = uuid.uuid4().hex[:8]
pack_id = f"pack-sabotage-{test_run_id}"
sess_id = f"sess-sabotage-{test_run_id}"
payout_id = f"payout-sabotage-{test_run_id}"

# --- TEST 3: Append-Only Trigger Sabotage (DELETE Blocked on hour_pack_purchases) ---
print("\n[TEST 3] Inserting valid hour pack purchase, then attempting DELETE...")
con.execute("""
    INSERT INTO hour_pack_purchases (id, student_id, plan_id, hours, minutes, price_minor, currency, status)
    VALUES (?, 'std-sabotage-1', 'plan-8h', 8, 480, 20000, 'SAR', 'SETTLED')
""", (pack_id,))
con.commit()

try:
    con.execute("DELETE FROM hour_pack_purchases WHERE id = ?", (pack_id,))
    con.commit()
    print("FAILED: Hour pack purchase record was deleted! Immutability trigger failed.")
    failed += 1
except sqlite3.DatabaseError as e:
    if "HOUR_PACK_PURCHASE_IMMUTABLE" in str(e):
        print(f"PASSED: SQLite BEFORE DELETE trigger successfully blocked deletion: {e}")
        passed += 1
    else:
        print(f"FAILED: Unexpected error: {e}")
        failed += 1

# --- TEST 4: Append-Only Trigger Sabotage (DELETE Blocked on class_sessions) ---
print("\n[TEST 4] Inserting valid class session, then attempting DELETE...")
con.execute("""
    INSERT INTO class_sessions (id, student_id, teacher_id, duration_minutes, teacher_payout_minor, academy_revenue_minor, currency, topic)
    VALUES (?, 'std-sabotage-1', 'tea-sabotage-1', 60, 3500, 1500, 'SAR', 'Quranic Recitation')
""", (sess_id,))
con.commit()

try:
    con.execute("DELETE FROM class_sessions WHERE id = ?", (sess_id,))
    con.commit()
    print("FAILED: Class session was deleted! Immutability trigger failed.")
    failed += 1
except sqlite3.DatabaseError as e:
    if "CLASS_SESSION_IMMUTABLE" in str(e):
        print(f"PASSED: SQLite BEFORE DELETE trigger successfully blocked session deletion: {e}")
        passed += 1
    else:
        print(f"FAILED: Unexpected error: {e}")
        failed += 1

# --- TEST 5: Append-Only Trigger Sabotage (DELETE Blocked on teacher_payout_ledgers) ---
print("\n[TEST 5] Inserting valid teacher payout, then attempting DELETE...")
con.execute("""
    INSERT INTO teacher_payout_ledgers (id, teacher_id, session_id, amount_minor, currency, status)
    VALUES (?, 'tea-sabotage-1', ?, 3500, 'SAR', 'SETTLED')
""", (payout_id, sess_id))
con.commit()

try:
    con.execute("DELETE FROM teacher_payout_ledgers WHERE id = ?", (payout_id,))
    con.commit()
    print("FAILED: Teacher payout was deleted! Immutability trigger failed.")
    failed += 1
except sqlite3.DatabaseError as e:
    if "TEACHER_PAYOUT_IMMUTABLE" in str(e):
        print(f"PASSED: SQLite BEFORE DELETE trigger successfully blocked payout deletion: {e}")
        passed += 1
    else:
        print(f"FAILED: Unexpected error: {e}")
        failed += 1

con.close()

print(f"\nGate 1 Verification Summary: {passed} PASSED, {failed} FAILED.")
if failed > 0:
    sys.exit(1)
print("ALL GATE 1 SQLITE SABOTAGE PROOFS VERIFIED WITH EXIT CODE 0.")
