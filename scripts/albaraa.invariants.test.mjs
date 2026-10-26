import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  HourPackLedger,
  TeacherPayoutLedger,
  StudySheetGenerator,
  Money,
  DomainError,
  InsufficientHoursError,
  ConcurrencyConflictError,
} from "../lib/domain/hour-pack-ledger.mjs";
import { PersistenceManager } from "../lib/persistence.mjs";

test("Invariant 1: Money values are strictly fixed-point integers in minor units", () => {
  assert.throws(() => new Money(50.5), { name: "DomainError", code: "INVALID_MONEY_AMOUNT" });

  const m1 = new Money(5000, "SAR"); // 50.00 SAR
  const m2 = new Money(2500, "SAR"); // 25.00 SAR
  const sum = m1.add(m2);

  assert.equal(sum.amountMinor, 7500);
  assert.equal(sum.format(), "75.00 SAR");
  assert.equal(sum.toMajor(), 75);

  assert.throws(() => m1.add(new Money(1000, "USD")), {
    name: "DomainError",
    code: "CURRENCY_MISMATCH",
  });
});

test("Invariant 2: HourPack balance conservation equation is strictly enforced", () => {
  const ledger = HourPackLedger.create("test-student", "أحمد التميمي", "+966551122334");
  assert.equal(ledger.totalMinutesPurchased, 0);
  assert.equal(ledger.minutesRemaining, 0);
  assert.equal(ledger.minutesUsed, 0);
  assert.equal(ledger.version, 1);

  // Purchase 8 hours (480 minutes)
  ledger.purchasePack({
    packId: "pack-8h",
    hours: 8,
    priceMinor: 20000,
    teacherId: "teacher-1",
    subjectId: "quran",
  });

  assert.equal(ledger.totalMinutesPurchased, 480);
  assert.equal(ledger.minutesRemaining, 480);
  assert.equal(ledger.minutesUsed, 0);
  assert.equal(ledger.version, 2);
  assert.equal(ledger.totalMinutesPurchased, ledger.minutesUsed + ledger.minutesRemaining);

  // Complete a 60-minute session
  const res = ledger.recordSessionCompletion({
    sessionId: "sess_001",
    durationMinutes: 60,
    teacherId: "teacher-1",
    topic: "تجويد سورة الفاتحة",
  });

  assert.equal(ledger.minutesUsed, 60);
  assert.equal(ledger.minutesRemaining, 420);
  assert.equal(ledger.version, 3);
  assert.equal(ledger.totalMinutesPurchased, ledger.minutesUsed + ledger.minutesRemaining);
  assert.equal(res.remainingHoursFormatted, "7.0");
  assert.equal(res.lowBalanceAlert, false);
});

test("Invariant 3: Insufficient balance debit attempts are rejected immediately", () => {
  const ledger = HourPackLedger.create("test-student-2", "سارة خالد", "+966559988776");
  ledger.purchasePack({ packId: "p1", hours: 1, priceMinor: 5000 }); // 60 minutes

  // Attempting to debit 90 minutes from a 60-minute balance must fail
  assert.throws(
    () =>
      ledger.recordSessionCompletion({
        sessionId: "sess_fail",
        durationMinutes: 90,
        teacherId: "teacher-1",
      }),
    (err) => {
      assert.ok(err instanceof InsufficientHoursError);
      assert.equal(err.code, "INSUFFICIENT_HOURS");
      return true;
    }
  );

  // State must remain uncorrupted
  assert.equal(ledger.minutesRemaining, 60);
  assert.equal(ledger.minutesUsed, 0);
  assert.equal(ledger.version, 2);
});

test("Invariant 4: Low-balance alert triggers when remaining minutes <= 120 and generates WhatsApp deep link", () => {
  const ledger = HourPackLedger.create("test-student-3", "زياد طه", "+966501234567");
  ledger.purchasePack({ packId: "p1", hours: 3, priceMinor: 15000 }); // 180 minutes

  // Deduct 70 minutes -> 110 minutes remaining (<= 120 minutes)
  const res = ledger.recordSessionCompletion({
    sessionId: "sess_alert",
    durationMinutes: 70,
    teacherId: "teacher-1",
    topic: "مراجعة الورد",
  });

  assert.equal(res.lowBalanceAlert, true);
  assert.ok(res.whatsappReupLink.startsWith("https://wa.me/966501234567?text="));
  assert.ok(res.whatsappReupLink.includes("%D8%B3%D8%A7%D8%B9%D8%A9")); // contains Arabic encoded text

  // Purchasing more hours must clear the alert
  ledger.purchasePack({ packId: "p2", hours: 8, priceMinor: 20000 });
  assert.equal(ledger.lowBalanceAlert, false);
  assert.equal(ledger.whatsappReupLink, null);
});

test("Invariant 5: Teacher and Academy commission split computes exact integer minor units", () => {
  const ledger = HourPackLedger.create("test-student-4", "عبدالله عمر", "+966500000000", "Asia/Riyadh", "SAR", 6000);
  // Hourly rate 60.00 SAR (6000 halalas). Teacher split: 70% = 4200 halalas, Academy: 1800 halalas.
  ledger.purchasePack({ packId: "p1", hours: 10, priceMinor: 60000 });

  // 45 minute session
  const res = ledger.recordSessionCompletion({
    sessionId: "sess_split",
    durationMinutes: 45,
    teacherId: "teacher-expert",
    topic: "شرح المقدمة الجزرية",
  });

  // 45/60 * 4200 = 3150 halalas (31.50 SAR)
  assert.equal(res.teacherPayoutMinor, 3150);
  // 45/60 * 1800 = 1350 halalas (13.50 SAR)
  assert.equal(res.academyFeeMinor, 1350);
  assert.equal(res.teacherPayoutMinor + res.academyFeeMinor, 4500); // 45/60 * 6000
});

test("Invariant 6: Concurrency fencing tokens reject stale updates", () => {
  const ledger = HourPackLedger.create("test-student-5", "خالد سالم", "+966500000000");
  ledger.purchasePack({ packId: "p1", hours: 5, priceMinor: 25000 }); // version becomes 2

  assert.throws(
    () =>
      ledger.recordSessionCompletion({
        sessionId: "sess_stale",
        durationMinutes: 60,
        teacherId: "teacher-1",
        expectedVersion: 1, // Stale version!
      }),
    (err) => {
      assert.ok(err instanceof ConcurrencyConflictError);
      assert.equal(err.code, "CONCURRENCY_CONFLICT");
      return true;
    }
  );
});

test("Invariant 7: StudySheetGenerator outputs complete pedagogical structures in Arabic and English", () => {
  const arSheet = StudySheetGenerator.generate({
    sessionId: "sess_tajweed_1",
    studentName: "أحمد",
    teacherName: "الشيخة سارة",
    subject: "قرآن كريم",
    topic: "أحكام الميم الساكنة",
    language: "ar",
  });

  assert.ok(arSheet.sheetId.startsWith("sheet_"));
  assert.equal(arSheet.practiceQuiz.length, 5);
  assert.equal(arSheet.flashcards.length, 4);
  assert.ok(arSheet.keyRulesOrConcepts.length >= 3);
  assert.ok(arSheet.practiceQuiz[0].options.length === 4);

  const enSheet = StudySheetGenerator.generate({
    sessionId: "sess_tajweed_2",
    studentName: "Ahmed",
    teacherName: "Sheikha Sarah",
    subject: "Quranic Sciences",
    topic: "Rules of Meem Saakinah",
    language: "en",
  });

  assert.equal(enSheet.language, "en");
  assert.ok(enSheet.title.includes("Rules of Meem Saakinah"));
  assert.equal(enSheet.practiceQuiz.length, 5);
});

test("Invariant 8: PersistenceManager initializes, saves, and reloads without loss", async () => {
  const store = await PersistenceManager.load();
  assert.ok(store.ledgers["student-1"]);
  assert.ok(store.ledgers["student-2"]);
  assert.equal(store.plans.length, 3);
  assert.equal(store.teachers.length, 2);

  const ledger1 = await PersistenceManager.getLedger("student-1");
  assert.equal(ledger1.studentName, "أحمد محمد العلي");
  assert.equal(ledger1.minutesRemaining + ledger1.minutesUsed, ledger1.totalMinutesPurchased);
});
