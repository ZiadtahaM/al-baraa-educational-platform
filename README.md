# Al-Baraa Academy OS

Prepaid Lesson Minute Ledger and Teacher Payout Settlement Platform for Arabic and Quranic Academies.

## Product Overview

Al-Baraa Academy OS solves the accounting leakage and student retention drop-off common in private Arabic and Quranic tutoring academies. Instead of managing chaotic spreadsheets and delayed post-lesson invoicing, the academy sells prepaid minute packages. Students consume minutes as lessons occur, while teachers receive transparent payouts calculated on actual completed minutes.

## Core Domain Model

1. Prepaid Minute Wallets
Students purchase prepaid minute packages (for example, 300, 600, or 1200 minutes). Each completed lesson debits the exact duration from the student wallet. If a student attempts to schedule or debit a lesson exceeding their available balance, the system rejects the transaction.

2. Teacher Payout Settlement
Teacher payouts are calculated per completed lesson using integer-precision formulas. The total gross revenue allocated to a lesson splits into the teacher payout and the academy retained share with zero penny leakage.

3. Low-Balance Click-to-WhatsApp Renewal
When a student wallet drops to 120 minutes or fewer, the system generates a Click-to-WhatsApp renewal message with the current minute balance, direct package pricing, and payment links.

4. Pedagogical Study Sheets
After each completed lesson, the system produces a structured study sheet containing recitation notes, assigned Surah homework, and teacher evaluation for parent review.

## System Architecture

The application runs a unified React frontend and a secured API server on port 8093.

- Frontend: React 18, Vite, Tailwind CSS, Lucide icons, and Arabic RTL layout.
- Backend: Node.js server API with Cloudflare Pages Functions compatibility.
- Security: HMAC-SHA256 signed session tokens, SHA-256 password hashing, and role-based route guards.
- Persistence: SQLite database with write-ahead logging (WAL) and Cloudflare D1 compatibility.

## API Reference

### GET /health and GET /ready
Dual-probe liveness and readiness health checks returning active student counts, teacher directory, and persistence status.

### POST /api/auth/login
Authenticates a user with email and password, returning an HMAC-SHA256 session token and user profile.

### GET /api/albaraa/students
Returns all enrolled students with active minute balances and package history.

### POST /api/albaraa/lessons/debit
Debits completed lesson minutes from a student wallet, computes teacher payout, and persists the transaction.

### GET /api/albaraa/teachers/settlement
Returns aggregated payout calculations, completed minutes, and academy retained margins per teacher.

## Local Verification

Run the automated verification lever to test all domain invariants:

```bash
node D:/tools/cli/verify-albaraa.mjs
```

The verification lever validates Ubiquitous Language compliance, integer balance calculations, zero-leakage conservation equations, low-balance alert boundaries, insufficient balance rejections, and disk persistence.
