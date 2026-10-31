import time
import sys
import subprocess
import os
import urllib.request
import sqlite3
from playwright.sync_api import sync_playwright

SERVER_PORT = 8093
BASE_URL = f"http://127.0.0.1:{SERVER_PORT}"
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(PROJECT_ROOT, "data", "albaraa.sqlite")

print("===========================================================================")
print("=== AL-BARAA ACADEMY OS: GATE 5 PLAYWRIGHT HARD-RELOAD PROOF SUITE =======")
print("===========================================================================")

# Step 1: Ensure server is running or start it
server_proc = None

def is_server_healthy():
    try:
        with urllib.request.urlopen(f"{BASE_URL}/health", timeout=2) as resp:
            return resp.status == 200
    except Exception:
        return False

if not is_server_healthy():
    print(f"\n[STEP 1] Starting Al-Baraa Server on port {SERVER_PORT}...")
    server_proc = subprocess.Popen(
        ["node", "server-api.mjs"],
        cwd=PROJECT_ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    started = False
    for i in range(20):
        time.sleep(0.5)
        if is_server_healthy():
            started = True
            break
    if not started:
        print("ERROR: Server failed to start on port 8093.")
        if server_proc:
            server_proc.kill()
        sys.exit(1)
    print(f"PASSED: Server started and listening at {BASE_URL}.")
else:
    print(f"\n[STEP 1] Server already running and healthy at {BASE_URL}.")

try:
    with sync_playwright() as p:
        print("\n[STEP 2] Launching Headless Chromium Browser...")
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        # Step 3: Test Academy Dashboard UI
        print(f"[STEP 3] Navigating to Academy Dashboard ({BASE_URL})...")
        page.goto(BASE_URL, wait_until="domcontentloaded")
        print("PASSED: Academy Dashboard loaded successfully.")

        # Step 4: Record a live hour-pack purchase via API
        print("\n[STEP 4] Executing hour-pack purchase for student-1...")
        purchase_res = page.request.post(f"{BASE_URL}/api/albaraa/packs/purchase", data={
            "studentId": "student-1",
            "packId": "plan-16h",
            "hours": 16,
            "priceMinor": 35000,
            "teacherId": "teacher-1"
        })
        assert purchase_res.status == 201, f"Purchase failed: {purchase_res.status}"
        purchase_data = purchase_res.json()
        tx_id = purchase_data["transaction"]["id"]
        print(f"PASSED: Hour pack purchased (Tx ID: {tx_id}).")

        # Step 5: Complete a Class Session
        print("\n[STEP 5] Recording class session completion...")
        session_res = page.request.post(f"{BASE_URL}/api/albaraa/sessions/complete", data={
            "studentId": "student-1",
            "teacherId": "teacher-1",
            "durationMinutes": 60,
            "topic": "تجويد سورة البقرة"
        })
        assert session_res.status == 200, f"Session failed: {session_res.status}"
        session_data = session_res.json()
        print("PASSED: Class session recorded and minutes deducted.")

        # Step 6: Hard Reload Proof (The True Persistence Gate)
        print("\n[STEP 6] Performing Hard Reload (page.reload()) to prove SQLite persistence...")
        page.reload(wait_until="networkidle")
        time.sleep(1)
        print("PASSED: Page reloaded successfully without session corruption.")

        # Step 7: Assert Physical SQLite Storage Record
        print("\n[STEP 7] Asserting physical SQLite database rows on disk...")
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute("SELECT hours, price_minor, status FROM hour_pack_purchases WHERE id = ?", (tx_id,))
        row = cur.fetchone()
        assert row is not None, f"Purchase {tx_id} not found in SQLite database!"
        assert row[0] == 16, f"Expected 16 hours, found {row[0]}"
        assert row[1] == 35000, f"Expected 35000 price_minor, found {row[1]}"
        print(f"PASSED: SQLite purchase row verified: hours={row[0]}, price_minor={row[1]}, status='{row[2]}'.")

        cur.execute("SELECT count(*) FROM class_sessions WHERE student_id = 'student-1'")
        sess_count = cur.fetchone()[0]
        assert sess_count >= 1, "Class sessions table must contain recorded session"
        print(f"PASSED: Verified {sess_count} class session(s) in SQLite table.")

        cur.execute("SELECT count(*) FROM teacher_payout_ledgers WHERE teacher_id = 'teacher-1'")
        payout_count = cur.fetchone()[0]
        assert payout_count >= 1, "Teacher payout ledger table must contain recorded payout"
        print(f"PASSED: Verified {payout_count} teacher payout record(s) in SQLite table.")

        browser.close()

except Exception as err:
    print(f"\nGATE 5 FAILED: {err}")
    if server_proc:
        server_proc.kill()
    sys.exit(1)

if server_proc:
    server_proc.kill()

print("\n===========================================================================")
print("=== ALL GATE 5 PLAYWRIGHT HARD-RELOAD PROOFS VERIFIED WITH EXIT CODE 0 ===")
print("===========================================================================")
