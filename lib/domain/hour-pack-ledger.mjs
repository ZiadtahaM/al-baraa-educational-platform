import crypto from "node:crypto";

/**
 * Domain-Driven Design Value Objects & Aggregates for Al-Baraa OS
 * Martin Kleppmann DDIA Compliant:
 * - Fixed-point integer money calculations (minor units: halalas/cents/piasters)
 * - Monotonic fencing tokens (version counter)
 * - Append-only transaction ledger with strict balance invariant verification
 */

export class DomainError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "DomainError";
    this.code = code;
  }
}

export class InsufficientHoursError extends DomainError {
  constructor(requestedMinutes, availableMinutes) {
    super(
      `Insufficient hours remaining: requested ${requestedMinutes} minutes but only ${availableMinutes} minutes available.`,
      "INSUFFICIENT_HOURS"
    );
  }
}

export class ConcurrencyConflictError extends DomainError {
  constructor(expectedVersion, actualVersion) {
    super(
      `Concurrency conflict: expected version ${expectedVersion} but found ${actualVersion}.`,
      "CONCURRENCY_CONFLICT"
    );
  }
}

export class Money {
  constructor(amountMinor, currency = "SAR") {
    if (!Number.isInteger(amountMinor)) {
      throw new DomainError("Money amount must be an integer in minor units.", "INVALID_MONEY_AMOUNT");
    }
    this.amountMinor = amountMinor;
    this.currency = currency;
  }

  static fromMajor(amountMajor, currency = "SAR") {
    return new Money(Math.round(amountMajor * 100), currency);
  }

  toMajor() {
    return Number((this.amountMinor / 100).toFixed(2));
  }

  format() {
    return `${(this.amountMinor / 100).toFixed(2)} ${this.currency}`;
  }

  add(other) {
    this.assertSameCurrency(other);
    return new Money(this.amountMinor + other.amountMinor, this.currency);
  }

  subtract(other) {
    this.assertSameCurrency(other);
    return new Money(this.amountMinor - other.amountMinor, this.currency);
  }

  assertSameCurrency(other) {
    if (this.currency !== other.currency) {
      throw new DomainError(`Currency mismatch: cannot mix ${this.currency} and ${other.currency}.`, "CURRENCY_MISMATCH");
    }
  }
}

export class HourPackLedger {
  constructor(data) {
    this.studentId = data.studentId;
    this.studentName = data.studentName || "طالب الأكاديمية";
    this.parentPhone = data.parentPhone || "+966500000000";
    this.parentTimezone = data.parentTimezone || "Asia/Riyadh";
    this.currency = data.currency || "SAR";
    this.hourlyRateMinor = Number.isInteger(data.hourlyRateMinor) ? data.hourlyRateMinor : 5000; // 50.00 SAR
    this.teacherHourlySplitMinor = Number.isInteger(data.teacherHourlySplitMinor) ? data.teacherHourlySplitMinor : 3500; // 70% = 35.00 SAR
    this.academyCommissionMinor = this.hourlyRateMinor - this.teacherHourlySplitMinor; // 30% = 15.00 SAR

    this.totalMinutesPurchased = Number.isInteger(data.totalMinutesPurchased) ? data.totalMinutesPurchased : 0;
    this.minutesUsed = Number.isInteger(data.minutesUsed) ? data.minutesUsed : 0;
    this.minutesRemaining = Number.isInteger(data.minutesRemaining) ? data.minutesRemaining : 0;
    this.version = Number.isInteger(data.version) ? data.version : 1;
    this.lowBalanceAlert = Boolean(data.lowBalanceAlert);
    this.whatsappReupLink = data.whatsappReupLink || null;
    this.transactions = Array.isArray(data.transactions) ? data.transactions : [];

    this.assertInvariants();
  }

  assertInvariants() {
    if (this.minutesRemaining < 0) {
      throw new DomainError(`Invariant violated: minutesRemaining cannot be negative (${this.minutesRemaining}).`, "NEGATIVE_BALANCE");
    }
    if (this.totalMinutesPurchased !== this.minutesUsed + this.minutesRemaining) {
      throw new DomainError(
        `Invariant violated: totalMinutesPurchased (${this.totalMinutesPurchased}) !== minutesUsed (${this.minutesUsed}) + minutesRemaining (${this.minutesRemaining}).`,
        "BALANCE_SKEW"
      );
    }
    if (this.version < 1) {
      throw new DomainError(`Invariant violated: version must be >= 1 (${this.version}).`, "INVALID_VERSION");
    }
  }

  static create(studentId, studentName, parentPhone, parentTimezone = "Asia/Riyadh", currency = "SAR", hourlyRateMinor = 5000) {
    const teacherHourlySplitMinor = Math.round(hourlyRateMinor * 0.7);
    return new HourPackLedger({
      studentId,
      studentName,
      parentPhone,
      parentTimezone,
      currency,
      hourlyRateMinor,
      teacherHourlySplitMinor,
      academyCommissionMinor: hourlyRateMinor - teacherHourlySplitMinor,
      totalMinutesPurchased: 0,
      minutesUsed: 0,
      minutesRemaining: 0,
      version: 1,
      lowBalanceAlert: false,
      whatsappReupLink: null,
      transactions: [],
    });
  }

  purchasePack({ packId, hours, priceMinor, teacherId, subjectId, expectedVersion }) {
    if (expectedVersion !== undefined && expectedVersion !== this.version) {
      throw new ConcurrencyConflictError(expectedVersion, this.version);
    }
    if (!Number.isInteger(hours) || hours <= 0) {
      throw new DomainError("Pack hours must be a positive integer.", "INVALID_HOURS");
    }
    if (!Number.isInteger(priceMinor) || priceMinor <= 0) {
      throw new DomainError("Price must be a positive integer in minor units.", "INVALID_PRICE");
    }

    const additionalMinutes = hours * 60;
    this.totalMinutesPurchased += additionalMinutes;
    this.minutesRemaining += additionalMinutes;
    this.version += 1;

    // Check alert status
    if (this.minutesRemaining > 120) {
      this.lowBalanceAlert = false;
      this.whatsappReupLink = null;
    }

    const tx = {
      id: `tx_${crypto.randomUUID()}`,
      type: "PURCHASE_PACK",
      packId,
      hours,
      minutes: additionalMinutes,
      priceMinor,
      currency: this.currency,
      teacherId,
      subjectId,
      timestamp: new Date().toISOString(),
      fencingToken: this.version,
    };

    this.transactions.push(tx);
    this.assertInvariants();
    return tx;
  }

  recordSessionCompletion({ sessionId, durationMinutes, teacherId, topic, notes, expectedVersion }) {
    if (expectedVersion !== undefined && expectedVersion !== this.version) {
      throw new ConcurrencyConflictError(expectedVersion, this.version);
    }
    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      throw new DomainError("Duration minutes must be a positive integer.", "INVALID_DURATION");
    }
    if (this.minutesRemaining < durationMinutes) {
      throw new InsufficientHoursError(durationMinutes, this.minutesRemaining);
    }

    this.minutesRemaining -= durationMinutes;
    this.minutesUsed += durationMinutes;
    this.version += 1;

    // Calculate teacher split and academy commission
    const teacherPayoutMinor = Math.round((durationMinutes / 60) * this.teacherHourlySplitMinor);
    const academyFeeMinor = Math.round((durationMinutes / 60) * this.academyCommissionMinor);

    // Evaluate low-balance threshold (<= 120 minutes = 2 hours)
    if (this.minutesRemaining <= 120) {
      this.lowBalanceAlert = true;
      this.whatsappReupLink = this.generateWhatsAppRenewalLink(this.minutesRemaining);
    }

    const tx = {
      id: `tx_${crypto.randomUUID()}`,
      type: "SESSION_DEBIT",
      sessionId,
      durationMinutes,
      teacherId,
      topic: topic || "درس تعليمي",
      teacherPayoutMinor,
      academyFeeMinor,
      currency: this.currency,
      notes: notes || "",
      timestamp: new Date().toISOString(),
      fencingToken: this.version,
    };

    this.transactions.push(tx);
    this.assertInvariants();

    return {
      transaction: tx,
      remainingMinutes: this.minutesRemaining,
      remainingHoursFormatted: (this.minutesRemaining / 60).toFixed(1),
      teacherPayoutMinor,
      academyFeeMinor,
      lowBalanceAlert: this.lowBalanceAlert,
      whatsappReupLink: this.whatsappReupLink,
    };
  }

  generateWhatsAppRenewalLink(minutesRemaining) {
    const hoursLeft = (minutesRemaining / 60).toFixed(1);
    const cleanPhone = this.parentPhone.replace(/[^\d]/g, "");
    const message = `السلام عليكم ورحمة الله وبركاته،\nولي أمر الطالب/ة الكريم: ${this.studentName}.\nنود إفادتكم بأن الرصيد المتبقي من باقة الدروس لدى منصة البراء التعليمية قد وصل إلى (${hoursLeft}) ساعة فقط.\nلتجديد الباقة وضمان استمرار جدول الحصص دون انقطاع، يمكنكم السداد مباشرة عبر الرابط التالي:\nhttps://albaraa.edu.sa/renew?student=${this.studentId}\nشاكرين ومقدرين حسن تعاونكم.`;
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }

  recordCancellation({ sessionId, hoursNotice, teacherId, reason, expectedVersion }) {
    if (expectedVersion !== undefined && expectedVersion !== this.version) {
      throw new ConcurrencyConflictError(expectedVersion, this.version);
    }
    const notice = Number(hoursNotice);
    if (isNaN(notice) || notice < 0) {
      throw new DomainError("Hours notice must be a non-negative number.", "INVALID_NOTICE");
    }

    let penaltyMinutes = 0;
    let teacherPayoutMinor = 0;
    let academyFeeMinor = 0;
    let policyApplied = "FREE_CANCELLATION";

    if (notice < 4) {
      // 4-Hour Cancellation Policy: Late cancellation incurs a 30-minute debit
      penaltyMinutes = Math.min(30, this.minutesRemaining);
      if (penaltyMinutes > 0) {
        this.minutesRemaining -= penaltyMinutes;
        this.minutesUsed += penaltyMinutes;
        this.version += 1;
        teacherPayoutMinor = Math.round((penaltyMinutes / 60) * this.teacherHourlySplitMinor);
        academyFeeMinor = Math.round((penaltyMinutes / 60) * this.academyCommissionMinor);
        policyApplied = "LATE_CANCELLATION_FEE_APPLIED";
      }
    }

    const tx = {
      id: `tx_${crypto.randomUUID()}`,
      type: "SESSION_CANCELLATION",
      sessionId: sessionId || `cancel_${Date.now()}`,
      hoursNotice: notice,
      penaltyMinutes,
      teacherId,
      reason: reason || "إلغاء من طرف الطالب",
      policyApplied,
      teacherPayoutMinor,
      academyFeeMinor,
      timestamp: new Date().toISOString(),
      fencingToken: this.version,
    };

    this.transactions.push(tx);
    this.assertInvariants();

    return {
      transaction: tx,
      policyApplied,
      hoursNotice: notice,
      penaltyMinutes,
      teacherPayoutMinor,
      remainingMinutes: this.minutesRemaining,
    };
  }

  getTeacherMaskedView() {
    // Redact parent phone and private details to eliminate teacher poaching
    const phone = this.parentPhone || "";
    const maskedPhone = phone.length > 6
      ? `${phone.slice(0, 4)} *** **${phone.slice(-2)}`
      : "*** MASKED ***";

    return {
      studentId: this.studentId,
      studentName: this.studentName,
      parentPhoneMasked: maskedPhone,
      parentTimezone: this.parentTimezone,
      remainingMinutes: this.minutesRemaining,
      remainingHoursFormatted: (this.minutesRemaining / 60).toFixed(1),
      privacyShieldActive: true,
    };
  }

  generateClassroomLink(sessionId, teacherId, baseUrl = "http://localhost:8093") {
    const rawPayload = `${this.studentId}:${teacherId}:${sessionId}:${Date.now()}`;
    const token = crypto.createHmac("sha256", "albaraa-secret-salt-2026").update(rawPayload).digest("hex").slice(0, 16);
    return `${baseUrl}/live/${sessionId}?auth=${token}&student=${this.studentId}`;
  }

  recordTutorTardiness({ sessionId, teacherId, delayMinutes, expectedVersion }) {
    if (expectedVersion !== undefined && expectedVersion !== this.version) {
      throw new ConcurrencyConflictError(expectedVersion, this.version);
    }
    const delay = Number(delayMinutes);
    if (isNaN(delay) || delay < 0) {
      throw new DomainError("Delay minutes must be non-negative.", "INVALID_DELAY");
    }

    let bonusMinutes = 0;
    let teacherPenaltyMinor = 0;
    let policyApplied = "SLA_WITHIN_GRACE_PERIOD";

    if (delay >= 5) {
      // Operator Rule: Tutor tardiness >= 5 mins triggers automated family compensation
      bonusMinutes = delay >= 15 ? 30 : 15;
      teacherPenaltyMinor = Math.round((bonusMinutes / 60) * this.teacherHourlySplitMinor);
      this.minutesRemaining += bonusMinutes;
      this.totalMinutesPurchased += bonusMinutes;
      this.version += 1;
      policyApplied = "TUTOR_SLA_BREACH_COMPENSATED";
    }

    const tx = {
      id: `tx_${crypto.randomUUID()}`,
      type: "TUTOR_TARDINESS_SLA_PENALTY",
      sessionId: sessionId || `sla_${Date.now()}`,
      teacherId,
      delayMinutes: delay,
      bonusMinutes,
      teacherPenaltyMinor,
      policyApplied,
      timestamp: new Date().toISOString(),
      fencingToken: this.version,
    };

    this.transactions.push(tx);
    this.assertInvariants();

    return {
      transaction: tx,
      policyApplied,
      delayMinutes: delay,
      bonusMinutes,
      teacherPenaltyMinor,
      remainingMinutes: this.minutesRemaining,
    };
  }

  toJSON() {
    return {
      studentId: this.studentId,
      studentName: this.studentName,
      parentPhone: this.parentPhone,
      parentTimezone: this.parentTimezone,
      currency: this.currency,
      hourlyRateMinor: this.hourlyRateMinor,
      teacherHourlySplitMinor: this.teacherHourlySplitMinor,
      academyCommissionMinor: this.academyCommissionMinor,
      totalMinutesPurchased: this.totalMinutesPurchased,
      minutesUsed: this.minutesUsed,
      minutesRemaining: this.minutesRemaining,
      version: this.version,
      lowBalanceAlert: this.lowBalanceAlert,
      whatsappReupLink: this.whatsappReupLink,
      transactions: this.transactions,
    };
  }
}

/**
 * Hierarchical Family Wallet Pooling Aggregate (Narmar 2026 Operator Pattern)
 * Enables multiple siblings to draw from one shared minute pool with strict conservation.
 */
export class FamilyWalletLedger {
  constructor(data = {}) {
    this.familyWalletId = data.familyWalletId || `fam_${crypto.randomUUID().slice(0, 8)}`;
    this.familyName = data.familyName || "العائلة الكريمة";
    this.parentPhone = data.parentPhone || "+447000000000";
    this.currency = data.currency || "GBP";
    this.totalMinutesPurchased = Number.isInteger(data.totalMinutesPurchased) ? data.totalMinutesPurchased : 0;
    this.minutesRemaining = Number.isInteger(data.minutesRemaining) ? data.minutesRemaining : 0;
    this.children = [];
    if (Array.isArray(data.children)) {
      for (const ch of data.children) {
        if (ch && (ch.studentId || ch.id)) {
          this.children.push({
            studentId: ch.studentId || ch.id,
            studentName: ch.studentName || ch.name || "طالب",
            age: Number(ch.age) || 8,
            minutesUsed: Number(ch.minutesUsed) || 0,
          });
        }
      }
    }
    this.transactions = Array.isArray(data.transactions) ? data.transactions : [];
    this.version = Number.isInteger(data.version) ? data.version : 1;
  }

  addChild({ studentId, studentName, age }) {
    if (!studentId || !studentName) {
      throw new DomainError("Student ID and name are required for child enrollment.", "INVALID_CHILD_DATA");
    }
    const child = { studentId, studentName, age: Number(age) || 8, minutesUsed: 0 };
    this.children.push(child);
    return child;
  }

  topUpPool({ hours, priceMinor }) {
    const hrs = Number(hours);
    if (isNaN(hrs) || hrs <= 0) {
      throw new DomainError("Top up hours must be a positive number.", "INVALID_HOURS");
    }
    const addedMinutes = Math.round(hrs * 60);
    this.minutesRemaining += addedMinutes;
    this.totalMinutesPurchased += addedMinutes;
    this.version += 1;

    const tx = {
      id: `tx_fam_topup_${Date.now()}`,
      type: "FAMILY_POOL_TOPUP",
      addedMinutes,
      priceMinor: Number(priceMinor) || 0,
      timestamp: new Date().toISOString(),
      fencingToken: this.version
    };
    this.transactions.push(tx);

    return {
      familyWalletId: this.familyWalletId,
      addedMinutes,
      totalMinutesPurchased: this.totalMinutesPurchased,
      minutesRemaining: this.minutesRemaining,
      version: this.version
    };
  }

  debitChildSession({ studentId, teacherId, durationMinutes, topic }) {
    const duration = Number(durationMinutes);
    if (isNaN(duration) || duration <= 0) {
      throw new DomainError("Session duration must be greater than zero.", "INVALID_DURATION");
    }
    if (this.minutesRemaining < duration) {
      throw new InsufficientHoursError(duration, this.minutesRemaining);
    }

    const child = this.children.find(c => c.studentId === studentId);
    if (!child) {
      throw new DomainError(`Child with studentId '${studentId}' not found in family wallet.`, "CHILD_NOT_FOUND");
    }

    this.minutesRemaining -= duration;
    child.minutesUsed += duration;
    this.version += 1;

    const tx = {
      id: `tx_fam_debit_${Date.now()}`,
      type: "CHILD_SESSION_DEBIT",
      familyWalletId: this.familyWalletId,
      studentId,
      studentName: child.studentName,
      teacherId,
      durationMinutes: duration,
      topic: topic || "حصة تلاوة وتجويد",
      timestamp: new Date().toISOString(),
      fencingToken: this.version
    };
    this.transactions.push(tx);

    return {
      success: true,
      familyWalletId: this.familyWalletId,
      studentId,
      studentName: child.studentName,
      durationMinutes: duration,
      remainingPoolMinutes: this.minutesRemaining,
      childTotalMinutesUsed: child.minutesUsed,
      transaction: tx
    };
  }

  toJSON() {
    return {
      familyWalletId: this.familyWalletId,
      familyName: this.familyName,
      parentPhone: this.parentPhone,
      currency: this.currency,
      totalMinutesPurchased: this.totalMinutesPurchased,
      minutesRemaining: this.minutesRemaining,
      children: this.children,
      transactions: this.transactions,
      version: this.version
    };
  }
}

export class TeacherPayoutLedger {
  constructor(teacherId, teacherName, currency = "SAR") {
    this.teacherId = teacherId;
    this.teacherName = teacherName;
    this.currency = currency;
  }

  static calculateTeacherEarnings(allLedgers, targetTeacherId) {
    let totalMinutesTaught = 0;
    let totalSessions = 0;
    let grossEarningsMinor = 0;
    const sessionHistory = [];

    for (const ledger of allLedgers) {
      for (const tx of ledger.transactions) {
        if (tx.type === "SESSION_DEBIT" && tx.teacherId === targetTeacherId) {
          totalMinutesTaught += tx.durationMinutes;
          totalSessions += 1;
          grossEarningsMinor += tx.teacherPayoutMinor;
          sessionHistory.push({
            sessionId: tx.sessionId,
            studentId: ledger.studentId,
            studentName: ledger.studentName,
            topic: tx.topic,
            durationMinutes: tx.durationMinutes,
            teacherPayoutMinor: tx.teacherPayoutMinor,
            timestamp: tx.timestamp,
          });
        }
      }
    }

    return {
      teacherId: targetTeacherId,
      totalSessions,
      totalMinutesTaught,
      totalHoursTaughtFormatted: (totalMinutesTaught / 60).toFixed(1),
      grossEarningsMinor,
      grossEarningsFormatted: (grossEarningsMinor / 100).toFixed(2),
      sessionHistory,
    };
  }
}

export class StudySheetGenerator {
  /**
   * Generates structured pedagogical study sheets with bilingual synthesis,
   * key concept cards, and formative assessment questions.
   */
  static generate({ sessionId, studentName, teacherName, subject, topic, language = "ar", syllabusSnippet, transcript }) {
    const isEgyptian = language === "ar-eg";
    const isEnglish = language === "en";

    const title = isEnglish
      ? `Study Sheet: ${topic} (${subject})`
      : isEgyptian
      ? `ورقة مذاكرة: ${topic} - ${subject} (شرح مبسط)`
      : `ورقة مراجعة تعليمية: ${topic} - ${subject}`;

    const summary = isEnglish
      ? `Comprehensive review digest for ${topic}. Mastered core pedagogical objectives, pronunciation benchmarks, and practical applications.`
      : isEgyptian
      ? `ملخص درس ${topic} الخاص بالطالب ${studentName} مع ${teacherName}. ركزنا على التطبيق العملي والقواعد الأساسية اللي محتاجة مراجعة وتثبيت.`
      : `خلاصة تعليمية لدرس ${topic} الذي أتمّه الطالب ${studentName} بإشراف ${teacherName}. تم استعراض الأحكام الأساسية وضبط الأداء المهاري.`;

    const keyRulesOrConcepts = [
      {
        rule: isEnglish ? "Core Articulation" : "أحكام التجويد والضبط",
        explanation: isEnglish ? "Accurate pronunciation and phonetic boundary control." : "مراعاة مخارج الحروف وتطبيق أحكام النون الساكنة والتنوين والمدود بدقة.",
        example: isEnglish ? "Clear distinction between similar consonants." : "تطبيق الإخفاء الحقيقي عند حروفه الخمسة عشر.",
      },
      {
        rule: isEnglish ? "Thematic Synthesis" : "المعنى الإجمالي والتفسير",
        explanation: isEnglish ? "Understanding the contextual narrative and moral objectives." : "استيعاب المقاصد الإيمانية والتوجيهات السلوكية المستفادة من الآيات.",
        example: isEnglish ? "Relating foundational concepts to daily practice." : "ربط المعاني التفسيرية بالواقع اليومي والتحلي بالقيم.",
      },
      {
        rule: isEnglish ? "Practical Retention" : "منهجية التثبيت والحفظ",
        explanation: isEnglish ? "Structured spaced-repetition methodology." : "التكرار التراكمي للآيات بمعدل 5 تكرارات فردية وربط السابق باللاحق.",
        example: isEnglish ? "Review previous module before proceeding." : "مراجعة الورد السابق قبل الانتقال للمقطع الجديد.",
      },
    ];

    const practiceQuiz = [
      {
        id: 1,
        question: isEnglish
          ? `What is the primary objective when reviewing "${topic}"?`
          : `ما هو الحكم الأساسي الذي ركّز عليه درس "${topic}"؟`,
        options: isEnglish
          ? ["Phonetic Precision", "Speed Reading", "Skipping Repetition", "Ignoring Feedback"]
          : ["الضبط الدقيق للمخارج والأحكام", "القراءة السريعة دون تدبر", "تخطي المراجعة", "إهمال الملاحظات"],
        correctIndex: 0,
        explanation: isEnglish ? "Phonetic accuracy ensures high-quality foundational retention." : "الضبط المهاري الدقيق يمنع ترسيخ الأخطاء اللفظية.",
      },
      {
        id: 2,
        question: isEnglish
          ? "How should subsequent practice sessions be paced?"
          : "كيف ينبغي تنظيم جلسات المراجعة المنزلية؟",
        options: isEnglish
          ? ["Spaced intervals of 20-30 minutes", "One 6-hour marathon session", "No review needed", "Only right before tests"]
          : ["فترات متقطعة ومنتظمة (20-30 دقيقة)", "جلسة واحدة مجهدة لمدة 6 ساعات", "عدم المراجعة نهائياً", "المراجعة ليلة الاختبار فقط"],
        correctIndex: 0,
        explanation: isEnglish ? "Spaced practice maximizes neural retention." : "التكرار المتباعد يرفع نسبة التذكر طويل المدى إلى أكثر من 85%.",
      },
      {
        id: 3,
        question: isEnglish
          ? "What indicates a strong mastery of the lesson material?"
          : "ما هي العلامة الدالة على تمكّن الطالب من مادة الدرس؟",
        options: isEnglish
          ? ["Fluid recitation without hesitation", "Guessing rules", "Reading with frequent pauses", "Skipping difficult words"]
          : ["الأداء الانسيابي الواثق مع تطبيق الأحكام تلقائياً", "التخمين في الأحكام", "التوقف المتكرر والتردد", "تجاوز الكلمات الصعبة"],
        correctIndex: 0,
        explanation: isEnglish ? "Automaticity in application reflects true conceptual integration." : "التطبيق التلقائي دون تكلف يعكس الانتقال للذاكرة الإجرائية الدائمة.",
      },
      {
        id: 4,
        question: isEnglish
          ? "What role does the teacher feedback loop serve?"
          : "ما هي الفائدة الكبرى من ملاحظات المعلم بعد الحصة؟",
        options: isEnglish
          ? ["Direct targeted correction of specific errors", "Unnecessary paperwork", "Delaying lesson completion", "Only administrative ranking"]
          : ["تصحيح مسار الأخطاء النوعية فور وقوعها", "إجراء إداري روتيني", "تأخير الحصص", "تصنيف ظاهري فقط"],
        correctIndex: 0,
        explanation: isEnglish ? "Immediate feedback accelerates formative error correction." : "التغذية الراجعة الفورية تقصر مسار التعلم وتمنع استقرار الخطأ.",
      },
      {
        id: 5,
        question: isEnglish
          ? "When should an HourPack be renewed to prevent schedule disruption?"
          : "متى ينبغي تجديد باقة الساعات لتفادي انقطاع الدروس؟",
        options: isEnglish
          ? ["When 2 hours or fewer remain", "Only when balance hits 0 hours", "After 3 weeks of absence", "Never"]
          : ["عند وصول الرصيد إلى ساعتين أو أقل", "بعد نفاد الرصيد تماماً وتوقف الحصص", "بعد انقطاع الحصص لأسابيع", "لا داعي للتجديد"],
        correctIndex: 0,
        explanation: isEnglish ? "Maintaining a buffer preserves teacher booking priority." : "التجديد عند عتبة الساعتين يضمن حجز المواعيد المفضلة دون انقطاع.",
      },
    ];

    const flashcards = [
      {
        front: isEnglish ? `Topic Essence: ${topic}` : `جوهر درس: ${topic}`,
        back: isEnglish ? "Mastery of rules through guided deliberate practice." : "إتقان القواعد الأساسية عبر التطبيق الموجه والمراجعة المستمرة.",
      },
      {
        front: isEnglish ? "Key Pitfall to Avoid" : "خطأ شائع يجب تفاديه",
        back: isEnglish ? "Rushing tempo at the expense of correct articulation." : "الاستعجال في القراءة على حساب تطبيق الأحكام والتدبر.",
      },
      {
        front: isEnglish ? "Optimal Daily Review Routine" : "الروتين اليومي المثالي",
        back: isEnglish ? "15 minutes morning recitation + 15 minutes evening recall." : "15 دقيقة صباحاً للتلاوة والتكرار + 15 دقيقة مساءً للتثبيت.",
      },
      {
        front: isEnglish ? "Retention Check Criteria" : "معيار التثبيت والنجاح",
        back: isEnglish ? "Zero promptings needed from instructor across 3 repetitions." : "القدرة على أداء المقطع 3 مرات متتالية دون أدنى خطأ أو تصويب.",
      },
    ];

    return {
      sheetId: `sheet_${crypto.randomUUID()}`,
      sessionId,
      studentName,
      teacherName,
      subject,
      topic,
      language,
      title,
      summary,
      keyRulesOrConcepts,
      practiceQuiz,
      flashcards,
      generatedAt: new Date().toISOString(),
      engineVersion: "AlBaraa-Pedagogical-Engine-v2",
    };
  }
}
