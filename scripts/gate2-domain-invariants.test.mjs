import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  HourPackLedger,
  Money,
  InsufficientHoursError,
  ConcurrencyConflictError,
  StudySheetGenerator
} from "../lib/domain/hour-pack-ledger.mjs";

describe("Al-Baraa Gate 2: Pure Domain Invariants Suite", () => {
  test("Invariant 1: Minor unit currency rejects non-integers", () => {
    const m = new Money(25000, "SAR");
    assert.equal(m.amountMinor, 25000);
    assert.equal(m.currency, "SAR");
    assert.throws(() => new Money(15.75, "SAR"), /Money amount must be an integer/);
  });

  test("Invariant 2: HourPack balance conservation equation holds across purchases and deductions", () => {
    const ledger = HourPackLedger.create("std_test_g2", "عمر الفاروق", "+966500000000", "Asia/Riyadh", "SAR", 5000);
    assert.equal(ledger.totalMinutesPurchased, 0);

    ledger.purchasePack({
      packId: "pack-16h",
      hours: 16,
      priceMinor: 35000,
      teacherId: "teacher-1"
    });
    assert.equal(ledger.totalMinutesPurchased, 960);
    assert.equal(ledger.minutesRemaining, 960);
    assert.equal(ledger.minutesUsed, 0);

    ledger.recordSessionCompletion({
      sessionId: "sess_g2_1",
      durationMinutes: 120,
      teacherId: "teacher-1"
    });
    assert.equal(ledger.minutesUsed, 120);
    assert.equal(ledger.minutesRemaining, 840);
    assert.equal(ledger.totalMinutesPurchased, ledger.minutesUsed + ledger.minutesRemaining);
  });

  test("Invariant 3: Insufficient balance debit attempts throw InsufficientHoursError", () => {
    const ledger = HourPackLedger.create("std_test_g2_sub", "فاطمة أحمد", "+966511111111", "Asia/Riyadh", "SAR", 5000);
    ledger.purchasePack({ packId: "pack-1h", hours: 1, priceMinor: 3000 });
    assert.throws(
      () => ledger.recordSessionCompletion({ sessionId: "sess_fail", durationMinutes: 120 }),
      (err) => err instanceof InsufficientHoursError
    );
  });

  test("Invariant 4: Concurrency fencing tokens reject stale concurrent updates", () => {
    const ledger = HourPackLedger.create("std_test_fence", "خالد بن الوليد", "+966522222222");
    ledger.purchasePack({ packId: "p1", hours: 5, priceMinor: 25000 }); // version becomes 2
    assert.throws(
      () => ledger.recordSessionCompletion({
        sessionId: "sess_stale",
        durationMinutes: 60,
        teacherId: "teacher-1",
        expectedVersion: 1
      }),
      (err) => err instanceof ConcurrencyConflictError
    );
  });

  test("Invariant 5: Teacher and Academy commission split computes exact integer minor units", () => {
    const ledger = HourPackLedger.create("std_test_split", "عبدالله عمر", "+966500000000", "Asia/Riyadh", "SAR", 6000);
    ledger.purchasePack({ packId: "p1", hours: 10, priceMinor: 60000 });
    const res = ledger.recordSessionCompletion({
      sessionId: "sess_split",
      durationMinutes: 45,
      teacherId: "teacher-expert",
      topic: "تجويد المقدمة الجزرية"
    });
    assert.equal(res.teacherPayoutMinor, 3150);
    assert.equal(res.academyFeeMinor, 1350);
    assert.equal(res.teacherPayoutMinor + res.academyFeeMinor, 4500);
  });
});
