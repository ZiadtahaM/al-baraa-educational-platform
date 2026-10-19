# Al-Baraa Educational Platform (Al-Baraa OS) - Ubiquitous Language

This document defines the ubiquitous language for Al-Baraa Educational Platform (Al-Baraa OS), an Arabic Academy and Multi-Timezone Tutoring Operating System. All entities, API endpoints, variable names, and documentation must adhere strictly to these domain definitions.

## Core Domain Terms

### 1. HourPack (باقة الساعات)
A pre-purchased bundle of instructional time measured in integer minutes. Hour packs are denominated in fixed-point integer currency minor units (SAR halalas, EGP piasters, or USD cents). Floating-point values are forbidden.

### 2. HourPackLedger (سجل باقات الساعات)
The consistency boundary and aggregate root governing a student's purchased instructional time. It tracks `totalMinutesPurchased`, `minutesUsed`, and `minutesRemaining`, along with an append-only sequence of immutable ledger entries protected by monotonic fencing tokens (`version`).

### 3. SessionDebit (خصم الحصة)
An atomic transaction debited from the student's remaining instructional balance immediately upon completion and attendance confirmation of a tutoring session. Debiting is rejected if `minutesRemaining < durationMinutes`.

### 4. LowBalanceThreshold (عتبة الرصيد المنخفض)
The critical operational boundary configured at 120 minutes (2.0 hours). When `minutesRemaining <= 120`, the ledger transitions to an alerted state and synthesizes an automated Click-to-WhatsApp renewal invoice link directed to the student or guardian's phone.

### 5. TeacherPayoutSplit (حصة المعلم)
The contracted percentage or hourly rate allocated to the tutor for completed instructional time. Payouts are computed strictly as integer minor units:
`payoutMinor = Math.round((durationMinutes / 60) * teacherHourlySplitMinor)`.

### 6. AcademyCommission (عمولة الأكاديمية)
The retained gross margin calculated per instructional session:
`commissionMinor = Math.round((durationMinutes / 60) * academyCommissionMinor)`.

### 7. StudySheet (ورقة المراجعة الذكية)
An automated pedagogical digest generated post-session from the session topic, syllabus transcript, or curriculum node. It comprises an executive summary in standard Arabic, Egyptian dialect, or English, core Tajweed/Fiqh rules, five formative assessment questions with rationale, and active-recall flashcards.

### 8. FencingToken (رمز الحماية التسلسلي)
A strictly monotonic integer incremented with every mutation to prevent write-skew anomalies and concurrent double-debit races across distributed background workers.
