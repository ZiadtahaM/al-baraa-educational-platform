process.env.NODE_ENV = 'test';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/albaraa.sqlite');

describe('Al-Baraa Gate 3: Stateful API, Idempotency & Outbox Suite', () => {
  let baseUrl;
  let server;
  const idempotencyKey = `idem_albaraa_${Date.now()}`;
  const studentId = 'student-1';

  before(async () => {
    const mod = await import('../server-api.mjs');
    server = mod.server;
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server && server.listening) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  test('POST 1: Initial state change with Idempotency-Key writes to SQLite and outbox', async () => {
    const payload = {
      studentId,
      packId: 'plan-8h',
      hours: 8,
      priceMinor: 20000,
      teacherId: 'teacher-1'
    };

    const res = await fetch(`${baseUrl}/api/albaraa/packs/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.transaction.id);

    // Verify row committed to SQLite
    const db = new DatabaseSync(dbPath);
    const storedPurchase = db.prepare('SELECT * FROM hour_pack_purchases WHERE id = ?').get(body.transaction.id);
    assert.ok(storedPurchase, 'Hour pack purchase must exist in SQLite database');
    assert.equal(storedPurchase.hours, 8);

    const idemRow = db.prepare('SELECT * FROM idempotency_keys WHERE key = ?').get(idempotencyKey);
    assert.ok(idemRow, 'Idempotency key must be persisted in SQLite table');
    assert.equal(idemRow.response_code, 201);

    const outboxRows = db.prepare('SELECT * FROM audit_outbox WHERE topic = ?').all('HOUR_PACK_PURCHASED');
    assert.ok(outboxRows.length >= 1, 'Audit event must exist in audit_outbox table');
    db.close();
  });

  test('POST 2: Duplicate POST with identical Idempotency-Key returns cached response without duplicate side effects', async () => {
    const payload = {
      studentId,
      packId: 'plan-8h',
      hours: 8,
      priceMinor: 20000,
      teacherId: 'teacher-1'
    };

    const res = await fetch(`${baseUrl}/api/albaraa/packs/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    assert.equal(res.headers.get('x-idempotent-replay'), 'true');
    const body = await res.json();
    assert.equal(body.success, true);

    // Assert purchases table has no duplicates for that key
    const db = new DatabaseSync(dbPath);
    const purchases = db.prepare('SELECT * FROM hour_pack_purchases WHERE id = ?').all(body.transaction.id);
    assert.equal(purchases.length, 1, 'Hour pack purchases table must contain exactly 1 row despite duplicate submission');
    db.close();
  });
});
